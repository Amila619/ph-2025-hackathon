import { Button, Card, List, Typography, Tabs, Table, Tag, Space, Form, Input, InputNumber } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/Auth.context.jsx';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role, refreshMe, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [apps, setApps] = useState([]);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/', { replace: true }); return; }
        (async () => {
            try {
                // Only refresh user data if we don't have it yet
                let me = user;
                if (!me) {
                    me = await refreshMe();
                    if (!me) {
                        console.warn('Could not fetch user data - staying on admin dashboard');
                        return;
                    }
                }
                
                const effectiveRole = me?.role || 'user';
                if (effectiveRole !== 'admin') { 
                    navigate('/dashboard/user', { replace: true }); 
                    return; 
                }
                
                // Load dashboard data
                const [pRes, sRes, aRes, cRes] = await Promise.all([
                    AxiosInstance.get('/api/products'),
                    AxiosInstance.get('/api/services'),
                    AxiosInstance.get('/api/welfare'),
                    AxiosInstance.get('/api/cart')
                ]);
                setProducts(pRes.data || []);
                setServices(sRes.data || []);
                setApps(aRes.data || []);
                setCart(cRes.data || { items: [] });
            } catch (err) {
                // Only redirect on auth errors, not timeouts
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/', { replace: true });
                } else {
                    console.warn('Dashboard data fetch failed:', err.message);
                }
            }
        })();
    }, [isLoggedIn, navigate, refreshMe, user]);

    const reviewApp = async (id, action) => {
        await AxiosInstance.post(`/api/welfare/${id}/review`, { action });
        const aRes = await AxiosInstance.get('/api/welfare');
        setApps(aRes.data || []);
    };

    const createProduct = async (values) => {
        await AxiosInstance.post('/api/products', values);
        const pRes = await AxiosInstance.get('/api/products');
        setProducts(pRes.data || []);
    };

    const createService = async (values) => {
        await AxiosInstance.post('/api/services', values);
        const sRes = await AxiosInstance.get('/api/services');
        setServices(sRes.data || []);
    };

    const addToCart = async (payload) => {
        await AxiosInstance.post('/api/cart/add', payload);
        const cRes = await AxiosInstance.get('/api/cart');
        setCart(cRes.data || { items: [] });
    };

    const handleLogout = async () => {
        try {
            await AxiosInstance.post('/api/auth/logout');
        } catch (_) { /* noop */ }
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('welcomed');
        navigate('/', { replace: true });
    };

    return (
        <div className={"p-6"}>
            <div className="flex justify-between items-center mb-6">
                <Typography.Title level={3} className="mb-0">Admin Dashboard</Typography.Title>
                <Button type="primary" danger onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <Tabs
                items={[
                    {
                        key: 'welfare',
                        label: 'Welfare Applications',
                        children: (
                            <Table
                                rowKey={(r) => r._id}
                                dataSource={apps}
                                columns={[
                                    { title: 'User', dataIndex: ['user_id','universityMail'] },
                                    { title: 'Status', dataIndex: 'status', render: (t) => <Tag color={t==='approved'?'green':t==='rejected'?'red':'blue'}>{t}</Tag> },
                                    { title: 'Documents', dataIndex: 'documents', render: (docs=[]) => docs.map((d,i)=>(<div key={i}><a href={d} target="_blank">doc {i+1}</a></div>)) },
                                    { title: 'Action', render: (_, r) => (
                                        <Space>
                                            <Button size="small" type="primary" onClick={() => reviewApp(r._id, 'approve')}>Approve</Button>
                                            <Button size="small" danger onClick={() => reviewApp(r._id, 'reject')}>Reject</Button>
                                        </Space>
                                    )}
                                ]}
                            />
                        )
                    },
                    {
                        key: 'products',
                        label: 'Products',
                        children: (
                            <>
                              <Card title="Create Product" style={{ marginBottom: 16 }}>
                                <Form layout="inline" onFinish={createProduct}>
                                  <Form.Item name="p_id" rules={[{ required: true }]}>
                                    <Input placeholder="Product ID" />
                                  </Form.Item>
                                  <Form.Item name="name" rules={[{ required: true }]}>
                                    <Input placeholder="Name" />
                                  </Form.Item>
                                  <Form.Item name="price" rules={[{ required: true }]}> 
                                    <InputNumber placeholder="Price" />
                                  </Form.Item>
                                  <Form.Item name="category" rules={[{ required: true }]}>
                                    <Input placeholder="Category" />
                                  </Form.Item>
                                  <Form.Item name="p_description">
                                    <Input placeholder="Description" />
                                  </Form.Item>
                                  <Form.Item>
                                    <Button type="primary" htmlType="submit">Create</Button>
                                  </Form.Item>
                                </Form>
                              </Card>
                              <List
                                grid={{ gutter: 16, column: 3 }}
                                dataSource={products}
                                renderItem={(item) => (
                                  <List.Item>
                                    <Card title={item.name} extra={<Tag>{item.category}</Tag>}>
                                      <div>Price: {item.price ?? 'N/A'}</div>
                                      <div>{item.p_description}</div>
                                      <Button style={{ marginTop: 8 }} onClick={() => addToCart({ kind: 'product', refId: item._id })}>Add to Cart</Button>
                                    </Card>
                                  </List.Item>
                                )}
                              />
                            </>
                        )
                    },
                    {
                        key: 'services',
                        label: 'Services',
                        children: (
                            <>
                              <Card title="Create Service" style={{ marginBottom: 16 }}>
                                <Form layout="inline" onFinish={createService}>
                                  <Form.Item name="s_id" rules={[{ required: true }]}>
                                    <Input placeholder="Service ID" />
                                  </Form.Item>
                                  <Form.Item name="s_category" rules={[{ required: true }]}>
                                    <Input placeholder="Category" />
                                  </Form.Item>
                                  <Form.Item name="status">
                                    <Input placeholder="Status (active/inactive)" />
                                  </Form.Item>
                                  <Form.Item name="s_description">
                                    <Input placeholder="Description" />
                                  </Form.Item>
                                  <Form.Item>
                                    <Button type="primary" htmlType="submit">Create</Button>
                                  </Form.Item>
                                </Form>
                              </Card>
                              <List
                                grid={{ gutter: 16, column: 3 }}
                                dataSource={services}
                                renderItem={(item) => (
                                  <List.Item>
                                    <Card title={item.s_category}>
                                      <div>Status: <Tag color={item.status==='active'?'green':'default'}>{item.status}</Tag></div>
                                      <div>{item.s_description}</div>
                                      <Button style={{ marginTop: 8 }} onClick={() => addToCart({ kind: 'service', refId: item._id })}>Add to Cart</Button>
                                    </Card>
                                  </List.Item>
                                )}
                              />
                            </>
                        )
                    },
                    {
                        key: 'cart',
                        label: 'Cart',
                        children: (
                          <Card title="My Cart">
                            <List
                              dataSource={cart?.items || []}
                              renderItem={(i) => (
                                <List.Item>
                                  {i.kind} - {i.refId} x {i.qty}
                                </List.Item>
                              )}
                            />
                          </Card>
                        )
                    }
                ]}
            />
        </div>
    )
}

export default AdminDashboard;


