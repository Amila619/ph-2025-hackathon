import { Button, Card, List, Typography, Tabs, Table, Tag, Space, Form, Input, InputNumber, Modal, Select, Switch, message } from 'antd';
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
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userForm] = Form.useForm();

    useEffect(() => {
        if (!isLoggedIn) { navigate('/', { replace: true }); return; }
        
        // Quick role check first
        if (role && role !== 'admin') {
            navigate('/dashboard/user', { replace: true });
            return;
        }
        
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
                
                // Load dashboard data - only for admin users
                const [pRes, sRes, aRes, cRes, uRes, payRes] = await Promise.all([
                    AxiosInstance.get('/api/products'),
                    AxiosInstance.get('/api/services'),
                    AxiosInstance.get('/api/welfare'),
                    AxiosInstance.get('/api/cart'),
                    AxiosInstance.get('/api/users'),
                    AxiosInstance.get('/api/payment/all').catch(err => {
                        // If payment endpoint fails, just return empty array
                        if (err.response?.status === 403) {
                            console.warn('Payment access denied - user may not be admin');
                            return { data: [] };
                        }
                        throw err;
                    })
                ]);
                setProducts(pRes.data || []);
                setServices(sRes.data || []);
                setApps(aRes.data || []);
                setCart(cRes.data || { items: [] });
                setUsers(uRes.data || []);
                setPayments(payRes.data || []);
            } catch (err) {
                // Only redirect on auth errors, not timeouts
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/', { replace: true });
                } else {
                    console.warn('Dashboard data fetch failed:', err.message);
                }
            }
        })();
    }, [isLoggedIn, navigate, refreshMe, user, role]);

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

    // User Management Functions
    const handleCreateUser = async (values) => {
        try {
            await AxiosInstance.post('/api/users', values);
            message.success('User created successfully');
            const uRes = await AxiosInstance.get('/api/users');
            setUsers(uRes.data || []);
            userForm.resetFields();
        } catch (err) {
            message.error('Failed to create user');
        }
    };

    const handleUpdateUser = async (values) => {
        try {
            await AxiosInstance.put(`/api/users/${selectedUser._id}`, values);
            message.success('User updated successfully');
            const uRes = await AxiosInstance.get('/api/users');
            setUsers(uRes.data || []);
            setUserModalVisible(false);
            setSelectedUser(null);
            userForm.resetFields();
        } catch (err) {
            message.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await AxiosInstance.delete(`/api/users/${userId}`);
            message.success('User deleted successfully');
            const uRes = await AxiosInstance.get('/api/users');
            setUsers(uRes.data || []);
        } catch (err) {
            message.error('Failed to delete user');
        }
    };

    const openUserModal = (user = null) => {
        setSelectedUser(user);
        if (user) {
            userForm.setFieldsValue({
                universityMail: user.universityMail,
                role: user.role,
                isWelfareReciever: user.isWelfareReciever,
                isPremium: user.isPremium,
                'name.fname': user.name?.fname,
                'name.mname': user.name?.mname,
                'name.lname': user.name?.lname,
                'address.street': user.address?.street,
                'address.city': user.address?.city,
                'address.country': user.address?.country,
                'address.postalcode': user.address?.postalcode,
                'contact.email': user.contact?.email,
                'contact.phone': user.contact?.phone,
                gender: user.gender
            });
        } else {
            userForm.resetFields();
        }
        setUserModalVisible(true);
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
                        key: 'users',
                        label: 'User Management',
                        children: (
                            <>
                                <Card title="Users" style={{ marginBottom: 16 }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <Button type="primary" onClick={() => openUserModal()}>
                                            Add New User
                                        </Button>
                                    </div>
                                    <Table
                                        rowKey="_id"
                                        dataSource={users}
                                        columns={[
                                            { title: 'Email', dataIndex: 'universityMail' },
                                            { title: 'Role', dataIndex: 'role', render: (role) => <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag> },
                                            { title: 'Welfare Receiver', dataIndex: 'isWelfareReciever', render: (val) => <Tag color={val ? 'green' : 'default'}>{val ? 'Yes' : 'No'}</Tag> },
                                            { title: 'Premium', dataIndex: 'isPremium', render: (val) => <Tag color={val ? 'gold' : 'default'}>{val ? 'Yes' : 'No'}</Tag> },
                                            { title: 'Name', render: (_, record) => `${record.name?.fname || ''} ${record.name?.lname || ''}`.trim() || 'N/A' },
                                            { title: 'Phone', dataIndex: ['contact', 'phone'] },
                                            { title: 'Actions', render: (_, record) => (
                                                <Space>
                                                    <Button size="small" onClick={() => openUserModal(record)}>Edit</Button>
                                                    <Button size="small" danger onClick={() => handleDeleteUser(record._id)}>Delete</Button>
                                                </Space>
                                            )}
                                        ]}
                                    />
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
                        key: 'payments',
                        label: 'All Payments',
                        children: (
                            <Card title="Payment History">
                                <Table
                                    dataSource={payments}
                                    columns={[
                                        {
                                            title: 'Order ID',
                                            dataIndex: 'order_id',
                                            key: 'order_id',
                                            width: 200
                                        },
                                        {
                                            title: 'Type',
                                            dataIndex: 'payment_type',
                                            key: 'payment_type',
                                            render: (type) => (
                                                <Tag color={
                                                    type === 'premium_upgrade' ? 'gold' :
                                                    type === 'product_purchase' ? 'blue' :
                                                    type === 'service_purchase' ? 'green' : 'default'
                                                }>
                                                    {type.replace('_', ' ').toUpperCase()}
                                                </Tag>
                                            )
                                        },
                                        {
                                            title: 'Buyer',
                                            dataIndex: 'buyer_uid',
                                            key: 'buyer_uid',
                                            render: (buyerId) => {
                                                const buyer = users.find(u => u._id === buyerId);
                                                return buyer ? buyer.universityMail : buyerId;
                                            }
                                        },
                                        {
                                            title: 'Seller',
                                            dataIndex: 'seller_uid',
                                            key: 'seller_uid',
                                            render: (sellerId) => {
                                                if (sellerId === 'system') return 'System';
                                                const seller = users.find(u => u._id === sellerId);
                                                return seller ? seller.universityMail : sellerId;
                                            }
                                        },
                                        {
                                            title: 'Amount',
                                            dataIndex: 'payment_amount',
                                            key: 'payment_amount',
                                            render: (amount) => `LKR ${amount.toFixed(2)}`
                                        },
                                        {
                                            title: 'Status',
                                            dataIndex: 'payment_status',
                                            key: 'payment_status',
                                            render: (status) => (
                                                <Tag color={
                                                    status === 'completed' ? 'green' :
                                                    status === 'pending' ? 'orange' :
                                                    status === 'failed' ? 'red' : 'default'
                                                }>
                                                    {status.toUpperCase()}
                                                </Tag>
                                            )
                                        },
                                        {
                                            title: 'Date',
                                            dataIndex: 'createdAt',
                                            key: 'createdAt',
                                            render: (date) => new Date(date).toLocaleDateString()
                                        }
                                    ]}
                                    pagination={{ pageSize: 10 }}
                                />
                            </Card>
                        )
                    }
                ]}
            />
            
            {/* User Modal */}
            <Modal
                title={selectedUser ? 'Edit User' : 'Add New User'}
                open={userModalVisible}
                onCancel={() => {
                    setUserModalVisible(false);
                    setSelectedUser(null);
                    userForm.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={userForm}
                    layout="vertical"
                    onFinish={selectedUser ? handleUpdateUser : handleCreateUser}
                >
                    <Form.Item name="universityMail" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="user@university.edu" />
                    </Form.Item>
                    
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select placeholder="Select role">
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item name="isWelfareReciever" label="Welfare Receiver" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    
                    <Form.Item name="isPremium" label="Premium User" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    
                    <Typography.Title level={5}>Personal Information</Typography.Title>
                    
                    <Form.Item name="name.fname" label="First Name">
                        <Input placeholder="First name" />
                    </Form.Item>
                    
                    <Form.Item name="name.mname" label="Middle Name">
                        <Input placeholder="Middle name" />
                    </Form.Item>
                    
                    <Form.Item name="name.lname" label="Last Name">
                        <Input placeholder="Last name" />
                    </Form.Item>
                    
                    <Form.Item name="gender" label="Gender">
                        <Select placeholder="Select gender">
                            <Select.Option value="m">Male</Select.Option>
                            <Select.Option value="f">Female</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Typography.Title level={5}>Contact Information</Typography.Title>
                    
                    <Form.Item name="contact.email" label="Contact Email">
                        <Input placeholder="contact@email.com" />
                    </Form.Item>
                    
                    <Form.Item name="contact.phone" label="Phone">
                        <Input placeholder="Phone number" />
                    </Form.Item>
                    
                    <Typography.Title level={5}>Address</Typography.Title>
                    
                    <Form.Item name="address.street" label="Street">
                        <Input placeholder="Street address" />
                    </Form.Item>
                    
                    <Form.Item name="address.city" label="City">
                        <Input placeholder="City" />
                    </Form.Item>
                    
                    <Form.Item name="address.country" label="Country">
                        <Input placeholder="Country" />
                    </Form.Item>
                    
                    <Form.Item name="address.postalcode" label="Postal Code">
                        <InputNumber placeholder="Postal code" style={{ width: '100%' }} />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {selectedUser ? 'Update User' : 'Create User'}
                            </Button>
                            <Button onClick={() => {
                                setUserModalVisible(false);
                                setSelectedUser(null);
                                userForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AdminDashboard;


