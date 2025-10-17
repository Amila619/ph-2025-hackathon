import { Button, Card, List, Typography, Tabs, Input, Form, InputNumber, Space, Modal, message, Badge, Tag } from 'antd';
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
    const [premiumModalVisible, setPremiumModalVisible] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [userServices, setUserServices] = useState([]);
    const [payments, setPayments] = useState([]);

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
                const [pRes, sRes, cRes, payRes] = await Promise.all([
                    AxiosInstance.get('/api/products'),
                    AxiosInstance.get('/api/services'),
                    AxiosInstance.get('/api/cart'),
                    AxiosInstance.get('/api/payment/user')
                ]);
                setProducts(pRes.data || []);
                setServices(sRes.data || []);
                setCart(cRes.data || { items: [] });
                setPayments(payRes.data || []);
                
                // Load user's own products and services
                if (me) {
                    const userProducts = (pRes.data || []).filter(p => p.seller_id === me._id);
                    const userServices = (sRes.data || []).filter(s => s.seller_id === me._id);
                    setUserProducts(userProducts);
                    setUserServices(userServices);
                }
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

    // Premium functionality
    const handleUpgradeToPremium = () => {
        setPremiumModalVisible(true);
    };

    const handlePayHerePayment = async () => {
        try {
            // First create payment record in database
            const paymentResponse = await AxiosInstance.post('/api/payment/create', {
                buyer_uid: user._id,
                seller_uid: 'system', // System payment for premium upgrade
                p_id: 'premium_upgrade',
                payment_amount: 5000.00,
                payment_type: 'premium_upgrade',
                description: 'Premium User Upgrade - Lifetime Access'
            });

            const order_id = paymentResponse.data.order_id;

            // PayHere payment integration
            const paymentData = {
                merchant_id: "1220001", // Replace with your PayHere merchant ID
                return_url: window.location.origin + "/dashboard/user",
                cancel_url: window.location.origin + "/dashboard/user",
                notify_url: window.location.origin + "/api/payment/notify",
                first_name: user?.name?.fname || "User",
                last_name: user?.name?.lname || "",
                email: user?.universityMail || "",
                phone: user?.contact?.phone || "",
                address: user?.address?.street || "",
                city: user?.address?.city || "",
                country: user?.address?.country || "",
                order_id: order_id,
                items: "Premium User Upgrade",
                currency: "LKR",
                amount: "5000.00" // LKR 5000 for premium upgrade
            };

            // Create PayHere payment form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Use sandbox for testing

            Object.keys(paymentData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = paymentData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            // Store order ID for verification
            localStorage.setItem('pendingPremiumOrder', order_id);
        } catch (err) {
            message.error('Failed to initiate payment. Please try again.');
            console.error('Payment initiation error:', err);
        }
    };

    // Check for successful payment on component mount
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const pendingOrder = localStorage.getItem('pendingPremiumOrder');
            if (pendingOrder && !user?.isPremium) {
                try {
                    const response = await AxiosInstance.get(`/api/payment/verify/${pendingOrder}`);
                    if (response.data.isPremium) {
                        message.success('🎉 Welcome to Premium! Your upgrade was successful!');
                        localStorage.removeItem('pendingPremiumOrder');
                        // Refresh user data
                        await refreshMe();
                    }
                } catch (err) {
                    console.log('Payment verification failed:', err);
                }
            }
        };
        
        checkPaymentStatus();
    }, [user?.isPremium, refreshMe]);

    // Check posting limits
    const canPostMore = () => {
        if (!user) return false;
        if (user.isPremium) return true; // Premium users have unlimited posts
        const totalPosts = userProducts.length + userServices.length;
        return totalPosts < 5; // Regular users limited to 5 posts
    };

    const getPostingLimitInfo = () => {
        if (!user) return { canPost: false, message: "Loading..." };
        if (user.isPremium) return { canPost: true, message: "Premium user - Unlimited posts" };
        const totalPosts = userProducts.length + userServices.length;
        const remaining = 5 - totalPosts;
        return { 
            canPost: remaining > 0, 
            message: `${remaining} posts remaining (${totalPosts}/5 used)` 
        };
    };

    const purchasedProducts = (user?.purchased_products || []).map(pid => products.find(p => (p._id||p.id)===pid)).filter(Boolean);
    const purchasedServices = (user?.purchased_services || []).map(sid => services.find(s => (s._id||s.id)===sid)).filter(Boolean);

    return (
        <div className={"p-6"}>
            <div className={"flex items-center justify-between mb-4"}>
                <div className="flex items-center gap-3">
                    <Typography.Title level={3} style={{ margin: 0 }}>User Dashboard</Typography.Title>
                    {user?.isPremium && (
                        <Badge.Ribbon text="PREMIUM" color="gold">
                            <Tag color="gold" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                👑 PREMIUM USER
                            </Tag>
                        </Badge.Ribbon>
                    )}
                </div>
                <Space>
                    {!user?.isPremium && (
                        <Button type="primary" onClick={handleUpgradeToPremium}>
                            Upgrade to Premium
                        </Button>
                    )}
                    <Button onClick={onLogout}>Logout</Button>
                </Space>
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
                                <Card title="Posting Limits" style={{ marginBottom: 16 }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography.Text strong>Your Posts: </Typography.Text>
                                            <Typography.Text>{userProducts.length} Products + {userServices.length} Services = {userProducts.length + userServices.length} Total</Typography.Text>
                                        </div>
                                        <Tag color={getPostingLimitInfo().canPost ? 'green' : 'red'}>
                                            {getPostingLimitInfo().message}
                                        </Tag>
                                    </div>
                                    {!user?.isPremium && (
                                        <div style={{ marginTop: 8 }}>
                                            <Typography.Text type="secondary">
                                                Regular users can post up to 5 items. 
                                                <Button type="link" onClick={handleUpgradeToPremium} style={{ padding: 0, marginLeft: 4 }}>
                                                    Upgrade to Premium for unlimited posts!
                                                </Button>
                                            </Typography.Text>
                                        </div>
                                    )}
                                </Card>
                                
                                <Card title="Create Product" style={{ marginBottom: 16 }}>
                                    <Form layout="inline" onFinish={createProduct}>
                                        <Form.Item name="p_id" rules={[{ required: true }]}>
                                            <Input placeholder="Product ID" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="name" rules={[{ required: true }]}>
                                            <Input placeholder="Name" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="price" rules={[{ required: true }]}> 
                                            <InputNumber placeholder="Price" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="category" rules={[{ required: true }]}>
                                            <Input placeholder="Category" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="p_description">
                                            <Input placeholder="Description" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                disabled={!canPostMore()}
                                            >
                                                {canPostMore() ? 'Create' : 'Limit Reached'}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                                
                                <Card title="Create Service" style={{ marginBottom: 16 }}>
                                    <Form layout="inline" onFinish={createService}>
                                        <Form.Item name="s_id" rules={[{ required: true }]}>
                                            <Input placeholder="Service ID" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="s_category" rules={[{ required: true }]}>
                                            <Input placeholder="Category" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="status">
                                            <Input placeholder="Status (active/inactive)" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item name="s_description">
                                            <Input placeholder="Description" disabled={!canPostMore()} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                disabled={!canPostMore()}
                                            >
                                                {canPostMore() ? 'Create' : 'Limit Reached'}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                                
                                {/* Show user's own posts */}
                                <Card title="My Products" style={{ marginBottom: 16 }}>
                                    <List
                                        dataSource={userProducts}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <div className="flex justify-between items-center w-full">
                                                    <div>
                                                        <Typography.Text strong>{item.name}</Typography.Text>
                                                        <Typography.Text type="secondary"> - {item.category} - LKR {item.price}</Typography.Text>
                                                    </div>
                                                    <Tag color="blue">Product</Tag>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                                
                                <Card title="My Services">
                                    <List
                                        dataSource={userServices}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <div className="flex justify-between items-center w-full">
                                                    <div>
                                                        <Typography.Text strong>{item.s_category}</Typography.Text>
                                                        <Typography.Text type="secondary"> - {item.status}</Typography.Text>
                                                    </div>
                                                    <Tag color="green">Service</Tag>
                                                </div>
                                            </List.Item>
                                        )}
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
                    },
                    {
                        key: 'payments',
                        label: 'My Payments',
                        children: (
                            <Card title="Payment History">
                                <List
                                    dataSource={payments}
                                    renderItem={(payment) => (
                                        <List.Item>
                                            <div className="flex justify-between items-center w-full">
                                                <div>
                                                    <Typography.Text strong>
                                                        {payment.payment_type === 'premium_upgrade' ? 'Premium Upgrade' : 
                                                         payment.payment_type === 'product_purchase' ? 'Product Purchase' :
                                                         payment.payment_type === 'service_purchase' ? 'Service Purchase' : 
                                                         payment.payment_type}
                                                    </Typography.Text>
                                                    <Typography.Text type="secondary">
                                                        {' '}- {payment.description || 'No description'}
                                                    </Typography.Text>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        Order: {payment.order_id}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Typography.Text strong style={{ fontSize: '16px' }}>
                                                        LKR {payment.payment_amount.toFixed(2)}
                                                    </Typography.Text>
                                                    <div>
                                                        <Tag color={
                                                            payment.payment_status === 'completed' ? 'green' :
                                                            payment.payment_status === 'pending' ? 'orange' :
                                                            payment.payment_status === 'failed' ? 'red' : 'default'
                                                        }>
                                                            {payment.payment_status.toUpperCase()}
                                                        </Tag>
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                {payments.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                        <Typography.Text type="secondary">No payments found</Typography.Text>
                                    </div>
                                )}
                            </Card>
                        )
                    }
                ]}
            />
            
            {/* Premium Upgrade Modal */}
            <Modal
                title="Upgrade to Premium"
                open={premiumModalVisible}
                onCancel={() => setPremiumModalVisible(false)}
                footer={null}
                width={600}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Typography.Title level={2} style={{ color: '#faad14' }}>
                        👑 Premium User Benefits
                    </Typography.Title>
                    
                    <div style={{ margin: '20px 0' }}>
                        <Typography.Title level={4}>What you get:</Typography.Title>
                        <ul style={{ textAlign: 'left', fontSize: '16px' }}>
                            <li>✅ Unlimited product and service posts</li>
                            <li>✅ Priority listing in search results</li>
                            <li>✅ Premium badge on your profile</li>
                            <li>✅ Advanced analytics for your posts</li>
                            <li>✅ Priority customer support</li>
                            <li>✅ Access to premium features</li>
                        </ul>
                    </div>
                    
                    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px' }}>
                        <Typography.Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                            Only LKR 5,000.00
                        </Typography.Title>
                        <Typography.Text type="secondary">One-time payment for lifetime premium access</Typography.Text>
                    </div>
                    
                    <div style={{ margin: '20px 0' }}>
                        <Typography.Text type="secondary">
                            Secure payment powered by PayHere
                        </Typography.Text>
                    </div>
                    
                    <Space size="large">
                        <Button size="large" onClick={() => setPremiumModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={handlePayHerePayment}
                            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                        >
                            Pay with PayHere
                        </Button>
                    </Space>
                </div>
            </Modal>
        </div>
    )
}

export default UserDashboard;


