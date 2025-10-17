import { Button, Card, List, Typography, Tabs, Input, Form, InputNumber, Space } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/Auth.context.jsx';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role, refreshMe, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [cart, setCart] = useState(null);

    const onLogout = async () => {
        try {
            await AxiosInstance.post('/api/auth/logout');
        } catch (_) { /* noop */ }
        localStorage.removeItem('accessToken');
        navigate('/', { replace: true });
    };

    useEffect(() => {
        if (!isLoggedIn) { navigate('/', { replace: true }); return; }
        if (role === 'admin') { navigate('/dashboard/admin', { replace: true }); return; }
        (async () => {
            try {
                // Only refresh user data if we don't have it yet
                let me = user;
                if (!me) {
                    me = await refreshMe();
                    if (!me) {
                        console.warn('Could not fetch user data - staying on user dashboard');
                        return;
                    }
                }
                
                // Load dashboard data
                const [pRes, sRes, cRes] = await Promise.all([
                    AxiosInstance.get('/api/products'),
                    AxiosInstance.get('/api/services'),
                    AxiosInstance.get('/api/cart')
                ]);
                setProducts(pRes.data || []);
                setServices(sRes.data || []);
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
    }, [isLoggedIn, role, navigate, refreshMe, user]);

    const applyWelfare = async (values) => {
        const docs = (values.documents || []).split(',').map(s => s.trim()).filter(Boolean);
        await AxiosInstance.post('/api/welfare/apply', { documents: docs, note: values.note });
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

    const purchasedProducts = (user?.purchased_products || []).map(pid => products.find(p => (p._id||p.id)===pid)).filter(Boolean);
    const purchasedServices = (user?.purchased_services || []).map(sid => services.find(s => (s._id||s.id)===sid)).filter(Boolean);

    return (
        <div className={"p-6"}>
            <div className={"flex items-center justify-between mb-4"}>
                <Typography.Title level={3} style={{ margin: 0 }}>User Dashboard</Typography.Title>
                <Button onClick={onLogout}>Logout</Button>
            </div>
            <Tabs
                items={[
                    {
                        key: 'my-purchases',
                        label: 'My Purchases',
                        children: (
                            <>
                              <Typography.Title level={4}>Products</Typography.Title>
                              <List
                                dataSource={purchasedProducts}
                                renderItem={(item) => <List.Item>{item?.name} - {item?.category}</List.Item>}
                              />
                              <Typography.Title level={4}>Services</Typography.Title>
                              <List
                                dataSource={purchasedServices}
                                renderItem={(item) => <List.Item>{item?.s_category} - {item?.status}</List.Item>}
                              />
                            </>
                        )
                    },
                    {
                        key: 'sell',
                        label: 'Sell',
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
                    },
                    {
                        key: 'apply-welfare',
                        label: 'Apply Welfare',
                        children: (
                            <Card title="Apply for Welfare">
                              <Form layout="vertical" onFinish={applyWelfare}>
                                <Form.Item label="Document URLs (comma separated)" name="documents">
                                  <Input.TextArea rows={4} placeholder="https://... , https://..." />
                                </Form.Item>
                                <Form.Item label="Note" name="note">
                                  <Input.TextArea rows={3} />
                                </Form.Item>
                                <Button htmlType="submit" type="primary">Submit Application</Button>
                              </Form>
                            </Card>
                        )
                    }
                ]}
            />
        </div>
    )
}

export default UserDashboard;


