import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Badge, 
  Table, 
  Tag, 
  Statistic,
  Dropdown,
  Space,
  Button,
  Tabs,
  List,
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  Modal
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  RiseOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  CrownOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  ShopOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify';

import { useAuth } from "../context/Auth.context";
import { AxiosInstance } from "../services/Axios.service";

const { TextArea } = Input;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, role, setIsLoggedIn, setRole, setUser, refreshMe } = useAuth();
  
  // All data states
  const [allUsers, setAllUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [welfareApplications, setWelfareApplications] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [payments, setPayments] = useState([]);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState([]);
  
  // User features states
  const [userProducts, setUserProducts] = useState([]);
  const [userServices, setUserServices] = useState([]);
  
  // Modal states
  const [editProductModal, setEditProductModal] = useState({ visible: false, product: null });
  const [editServiceModal, setEditServiceModal] = useState({ visible: false, service: null });
  const [editUserModal, setEditUserModal] = useState({ visible: false, user: null });
  
  // Form instances
  const [productForm] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [createProductForm] = Form.useForm();
  const [createServiceForm] = Form.useForm();
  const [editUserForm] = Form.useForm();
  const [welfareForm] = Form.useForm();
  
  // Category and Status management
  const [productCategories, setProductCategories] = useState(['Electronics', 'Books', 'Clothing', 'Food', 'Furniture', 'Sports', 'Other']);
  const [serviceCategories, setServiceCategories] = useState(['Tutoring', 'Repair', 'Transportation', 'Cleaning', 'Event Services', 'Other']);
  const [statusOptions] = useState(['active', 'inactive']);

  // Enrich cart items with full product/service details
  const enrichCartItems = useCallback(async (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      setCartItemsWithDetails([]);
      return;
    }

    try {
      const enrichedItems = await Promise.all(
        cartItems.map(async (item) => {
          try {
            let details = null;
            if (item.kind === 'product') {
              details = products.find(p => p._id === item.refId);
              if (!details) {
                const res = await AxiosInstance.get(`/products/${item.refId}`);
                details = res.data;
              }
            } else if (item.kind === 'service') {
              details = services.find(s => s._id === item.refId);
              if (!details) {
                const res = await AxiosInstance.get(`/services/${item.refId}`);
                details = res.data;
              }
            }
            
            return {
              ...item,
              details: details || null
            };
          } catch (error) {
            console.error(`Error fetching ${item.kind} details:`, error);
            return {
              ...item,
              details: null
            };
          }
        })
      );
      
      setCartItemsWithDetails(enrichedItems);
    } catch (error) {
      console.error('Error enriching cart items:', error);
      setCartItemsWithDetails([]);
    }
  }, [products, services]);

  const handleLogout = async () => {
    try {
      await AxiosInstance.post('/auth/logout');
    } catch (_) { /* noop */ }
    
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('welcomed');
    
    setIsLoggedIn(false);
    setRole('user');
    setUser(null);
    
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    if (role !== 'admin') {
      navigate('/dashboard/user', { replace: true });
      return;
    }

    (async () => {
      try {
        // Load data with individual error handling
        const usersRes = await AxiosInstance.get('/users').catch(err => {
          console.error('Failed to load users:', err);
          return { data: [] };
        });
        
        const productsRes = await AxiosInstance.get('/products').catch(err => {
          console.error('Failed to load products:', err);
          return { data: [] };
        });
        
        const servicesRes = await AxiosInstance.get('/services').catch(err => {
          console.error('Failed to load services:', err);
          return { data: [] };
        });
        
        const cartRes = await AxiosInstance.get('/cart').catch(err => {
          console.error('Failed to load cart:', err);
          return { data: { items: [] } };
        });
        
        const welfareRes = await AxiosInstance.get('/welfare').catch(err => {
          console.error('Failed to load welfare applications:', err);
          return { data: [] };
        });
        
        const paymentsRes = await AxiosInstance.get('/payment/all').catch(err => {
          console.error('Failed to load payments:', err);
          return { data: [] };
        });

        setAllUsers(usersRes.data || []);
        setProducts(productsRes.data || []);
        setServices(servicesRes.data || []);
        setCart(cartRes.data || { items: [] });
        setWelfareApplications(welfareRes.data || []);
        setPayments(paymentsRes.data || []);

        // Log loaded data counts
        console.log('Dashboard Data Loaded:');
        console.log('- Total Users:', (usersRes.data || []).length);
        console.log('- Total Products:', (productsRes.data || []).length);
        console.log('- Total Services:', (servicesRes.data || []).length);
        console.log('- Welfare Applications:', (welfareRes.data || []).length);
        console.log('- Payments:', (paymentsRes.data || []).length);

        if (user?._id) {
          setUserProducts((productsRes.data || []).filter(p => p.seller_id === user._id));
          setUserServices((servicesRes.data || []).filter(s => s.seller_id === user._id));
        }

        await enrichCartItems(cartRes.data?.items || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load some dashboard data. Please refresh.', { autoClose: 5000 });
      }
    })();
  }, [isLoggedIn, role, navigate, user, enrichCartItems]);

  // USER MANAGEMENT
  const handleMakeAdmin = (userId) => {
    Modal.confirm({
      title: 'Make Admin',
      content: 'Are you sure you want to promote this user to admin?',
      onOk: async () => {
        try {
          await AxiosInstance.put(`/users/${userId}`, { role: 'admin' });
          toast.success('User promoted to admin!', { autoClose: 3000 });
          const usersRes = await AxiosInstance.get('/users');
          setAllUsers(usersRes.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to promote user', { autoClose: 5000 });
        }
      }
    });
  };

  const handleRemoveAdmin = (userId) => {
    Modal.confirm({
      title: 'Remove Admin',
      content: 'Are you sure you want to remove admin privileges from this user?',
      onOk: async () => {
        try {
          await AxiosInstance.put(`/users/${userId}`, { role: 'user' });
          toast.success('Admin privileges removed!', { autoClose: 3000 });
          const usersRes = await AxiosInstance.get('/users');
          setAllUsers(usersRes.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to remove admin', { autoClose: 5000 });
        }
      }
    });
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await AxiosInstance.delete(`/users/${userId}`);
          toast.success('User deleted successfully!', { autoClose: 3000 });
          const usersRes = await AxiosInstance.get('/users');
          setAllUsers(usersRes.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete user', { autoClose: 5000 });
        }
      }
    });
  };

  const handleEditUser = (user) => {
    setEditUserModal({ visible: true, user });
    editUserForm.setFieldsValue({
      universityMail: user.universityMail,
      role: user.role,
      isPremium: user.isPremium
    });
  };

  const handleUpdateUser = async (values) => {
    try {
      await AxiosInstance.put(`/users/${editUserModal.user._id}`, values);
      toast.success('User updated successfully!', { autoClose: 3000 });
      setEditUserModal({ visible: false, user: null });
      editUserForm.resetFields();
      const usersRes = await AxiosInstance.get('/users');
      setAllUsers(usersRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user', { autoClose: 5000 });
    }
  };

  // WELFARE MANAGEMENT
  const handleApproveWelfare = (applicationId) => {
    Modal.confirm({
      title: 'Approve Welfare Application',
      content: 'Are you sure you want to approve this welfare application?',
      onOk: async () => {
        try {
          await AxiosInstance.post(`/welfare/${applicationId}/review`, { action: 'approve' });
          toast.success('Welfare application approved!', { autoClose: 3000 });
          const welfareRes = await AxiosInstance.get('/welfare');
          setWelfareApplications(welfareRes.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to approve', { autoClose: 5000 });
        }
      }
    });
  };

  const handleRejectWelfare = (applicationId) => {
    Modal.confirm({
      title: 'Reject Welfare Application',
      content: 'Are you sure you want to reject this welfare application?',
      onOk: async () => {
        try {
          await AxiosInstance.post(`/welfare/${applicationId}/review`, { action: 'reject' });
          toast.success('Welfare application rejected!', { autoClose: 3000 });
          const welfareRes = await AxiosInstance.get('/welfare');
          setWelfareApplications(welfareRes.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to reject', { autoClose: 5000 });
        }
      }
    });
  };

  const applyWelfare = async (values) => {
    try {
      const docs = values.documents 
        ? values.documents.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      
      await AxiosInstance.post('/welfare/apply', { 
        documents: docs, 
        note: values.note || '' 
      });
      toast.success('Welfare application submitted!', { autoClose: 3000 });
      welfareForm.resetFields();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit', { autoClose: 5000 });
    }
  };

  // PRODUCT/SERVICE CRUD
  const createProduct = async (values) => {
    try {
      await AxiosInstance.post('/products', values);
      toast.success('Product created!', { autoClose: 3000 });
      createProductForm.resetFields();
      const productsRes = await AxiosInstance.get('/products');
      setProducts(productsRes.data || []);
      if (user?._id) {
        setUserProducts((productsRes.data || []).filter(p => p.seller_id === user._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product', { autoClose: 5000 });
    }
  };

  const createService = async (values) => {
    try {
      await AxiosInstance.post('/services', values);
      toast.success('Service created!', { autoClose: 3000 });
      createServiceForm.resetFields();
      const servicesRes = await AxiosInstance.get('/services');
      setServices(servicesRes.data || []);
      if (user?._id) {
        setUserServices((servicesRes.data || []).filter(s => s.seller_id === user._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create service', { autoClose: 5000 });
    }
  };

  const handleEditProduct = (product) => {
    setEditProductModal({ visible: true, product });
    productForm.setFieldsValue({
      name: product.name,
      price: product.price,
      category: product.category,
      status: product.status || 'active',
      p_description: product.p_description
    });
  };

  const handleEditService = (service) => {
    setEditServiceModal({ visible: true, service });
    serviceForm.setFieldsValue({
      s_category: service.s_category,
      status: service.status || 'active',
      s_description: service.s_description
    });
  };

  const handleUpdateProduct = async (values) => {
    try {
      await AxiosInstance.put(`/products/${editProductModal.product._id}`, values);
      toast.success('Product updated!', { autoClose: 3000 });
      setEditProductModal({ visible: false, product: null });
      productForm.resetFields();
      const productsRes = await AxiosInstance.get('/products');
      setProducts(productsRes.data || []);
      if (user?._id) {
        setUserProducts((productsRes.data || []).filter(p => p.seller_id === user._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update', { autoClose: 5000 });
    }
  };

  const handleUpdateService = async (values) => {
    try {
      await AxiosInstance.put(`/services/${editServiceModal.service._id}`, values);
      toast.success('Service updated!', { autoClose: 3000 });
      setEditServiceModal({ visible: false, service: null });
      serviceForm.resetFields();
      const servicesRes = await AxiosInstance.get('/services');
      setServices(servicesRes.data || []);
      if (user?._id) {
        setUserServices((servicesRes.data || []).filter(s => s.seller_id === user._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update', { autoClose: 5000 });
    }
  };

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure?',
      okType: 'danger',
      onOk: async () => {
        try {
          await AxiosInstance.delete(`/products/${productId}`);
          toast.success('Product deleted!', { autoClose: 3000 });
          const productsRes = await AxiosInstance.get('/products');
          setProducts(productsRes.data || []);
          if (user?._id) {
            setUserProducts((productsRes.data || []).filter(p => p.seller_id === user._id));
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete', { autoClose: 5000 });
        }
      }
    });
  };

  const handleDeleteService = (serviceId) => {
    Modal.confirm({
      title: 'Delete Service',
      content: 'Are you sure?',
      okType: 'danger',
      onOk: async () => {
        try {
          await AxiosInstance.delete(`/services/${serviceId}`);
          toast.success('Service deleted!', { autoClose: 3000 });
          const servicesRes = await AxiosInstance.get('/services');
          setServices(servicesRes.data || []);
          if (user?._id) {
            setUserServices((servicesRes.data || []).filter(s => s.seller_id === user._id));
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete', { autoClose: 5000 });
        }
      }
    });
  };

  // TABLE COLUMNS
  const userColumns = [
    { 
      title: "Email", 
      dataIndex: "universityMail", 
      key: "universityMail",
    },
    { 
      title: "Role", 
      dataIndex: "role", 
      key: "role",
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role?.toUpperCase() || 'USER'}
        </Tag>
      )
    },
    { 
      title: "Premium", 
      dataIndex: "isPremium", 
      key: "isPremium",
      render: (isPremium) => (
        <Tag color={isPremium ? 'gold' : 'default'} icon={isPremium ? <CrownOutlined /> : null}>
          {isPremium ? 'PREMIUM' : 'Regular'}
        </Tag>
      )
    },
    { 
      title: "Welfare", 
      dataIndex: "isWelfareReciever", 
      key: "isWelfareReciever",
      render: (isWelfare) => (
        <Tag color={isWelfare ? 'green' : 'default'}>
          {isWelfare ? 'YES' : 'NO'}
        </Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEditUser(record)}
          />
          {record.role === 'admin' ? (
            <Button 
              type="text" 
              danger
              size="small"
              onClick={() => handleRemoveAdmin(record._id)}
            >
              Remove Admin
            </Button>
          ) : (
            <Button 
              type="text" 
              size="small"
              icon={<SafetyOutlined />}
              onClick={() => handleMakeAdmin(record._id)}
            >
              Make Admin
            </Button>
          )}
          <Button 
            type="text" 
            danger
            size="small"
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteUser(record._id)}
          />
        </Space>
      )
    }
  ];

  const welfareColumns = [
    {
      title: "User Email",
      dataIndex: ["user_id", "universityMail"],
      key: "userEmail",
      render: (_, record) => record.user_id?.universityMail || 'N/A'
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = { pending: 'orange', approved: 'green', rejected: 'red' };
        return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => note || 'No note'
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      render: (docs) => docs?.length || 0
    },
    {
      title: "Applied At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === 'pending' ? (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApproveWelfare(record._id)}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleRejectWelfare(record._id)}
              >
                Reject
              </Button>
            </>
          ) : (
            <Tag color={record.status === 'approved' ? 'green' : 'red'}>
              {record.status === 'approved' ? 'Approved' : 'Rejected'}
            </Tag>
          )}
        </Space>
      )
    }
  ];

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout
    },
  ];

  const pendingWelfare = welfareApplications.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white flex justify-between items-center px-6 py-4 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.universityMail || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-6">
          <Badge count={pendingWelfare} color="#f56a00">
            <BellOutlined className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500 transition" />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer hover:opacity-80 transition">
              <Avatar size="large" icon={<UserOutlined />} className="bg-indigo-600" />
              <span className="text-gray-700 font-medium hidden md:inline">{user?.universityMail || 'Admin'}</span>
            </Space>
          </Dropdown>
        </div>
      </div>

      <div className="m-6">
        {/* Quick Stats */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg rounded-xl border-l-4 border-indigo-600">
              <Statistic
                title="Total Users"
                value={allUsers.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#4f46e5' }}
              />
              <div className="mt-2 flex items-center text-sm text-green-500">
                <RiseOutlined className="mr-1" />
                <span>All registered users</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg rounded-xl border-l-4 border-green-500">
              <Statistic
                title="All Products"
                value={products.length}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg rounded-xl border-l-4 border-purple-500">
              <Statistic
                title="All Services"
                value={services.length}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#9333ea' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg rounded-xl border-l-4 border-orange-500">
              <Statistic
                title="Pending Welfare"
                value={pendingWelfare}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#f97316' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for All Features */}
        <Card className="shadow-lg">
          <Tabs
            defaultActiveKey="users"
            items={[
              {
                key: 'users',
                label: <span><TeamOutlined /> User Management</span>,
                children: (
                  <Table
                    columns={userColumns}
                    dataSource={allUsers}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                )
              },
              {
                key: 'welfare',
                label: <span><SafetyOutlined /> Welfare Applications</span>,
                children: (
                  <Table
                    columns={welfareColumns}
                    dataSource={welfareApplications}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                )
              },
              {
                key: 'my-products',
                label: <span><ShopOutlined /> My Products</span>,
                children: (
                  <>
                    <Card title="Create Product" style={{ marginBottom: 16 }}>
                      <Form form={createProductForm} layout="vertical" onFinish={createProduct}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                              <Input placeholder="Enter product name" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="price" label="Price (LKR)" rules={[{ required: true }]}>
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                              <Select
                                placeholder="Select category"
                                options={productCategories.map(cat => ({ label: cat, value: cat }))}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        const newCat = prompt('Enter new category:');
                                        if (newCat && !productCategories.includes(newCat)) {
                                          setProductCategories([...productCategories, newCat]);
                                        }
                                      }}
                                    >
                                      + Add Category
                                    </Button>
                                  </>
                                )}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="status" label="Status" initialValue="active">
                              <Select options={statusOptions.map(s => ({ label: s, value: s }))} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item name="p_description" label="Description">
                              <TextArea rows={3} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button type="primary" htmlType="submit">Create Product</Button>
                      </Form>
                    </Card>

                    <List
                      dataSource={userProducts}
                      renderItem={(product) => (
                        <List.Item
                          actions={[
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProduct(product)}>Edit</Button>,
                            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={<span>{product.name} - LKR {product.price}</span>}
                            description={`${product.category} | ${product.status}`}
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )
              },
              {
                key: 'my-services',
                label: <span><ShopOutlined /> My Services</span>,
                children: (
                  <>
                    <Card title="Create Service" style={{ marginBottom: 16 }}>
                      <Form form={createServiceForm} layout="vertical" onFinish={createService}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item name="s_category" label="Service Category" rules={[{ required: true }]}>
                              <Select
                                placeholder="Select category"
                                options={serviceCategories.map(cat => ({ label: cat, value: cat }))}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        const newCat = prompt('Enter new category:');
                                        if (newCat && !serviceCategories.includes(newCat)) {
                                          setServiceCategories([...serviceCategories, newCat]);
                                        }
                                      }}
                                    >
                                      + Add Category
                                    </Button>
                                  </>
                                )}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="status" label="Status" initialValue="active">
                              <Select options={statusOptions.map(s => ({ label: s, value: s }))} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item name="s_description" label="Description">
                              <TextArea rows={3} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button type="primary" htmlType="submit">Create Service</Button>
                      </Form>
                    </Card>

                    <List
                      dataSource={userServices}
                      renderItem={(service) => (
                        <List.Item
                          actions={[
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditService(service)}>Edit</Button>,
                            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteService(service._id)}>Delete</Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={service.s_category}
                            description={`${service.status} | ${service.s_description || 'No description'}`}
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )
              },
              {
                key: 'my-cart',
                label: <span><ShoppingCartOutlined /> My Cart</span>,
                children: (
                  <Card title="Cart Items">
                    {cartItemsWithDetails.length === 0 ? (
                      <Typography.Text type="secondary">Your cart is empty</Typography.Text>
                    ) : (
                      <List
                        dataSource={cartItemsWithDetails}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.kind === 'product' ? item.details?.name : item.details?.s_category}
                              description={`Quantity: ${item.qty} | ${item.kind}`}
                            />
                            {item.kind === 'product' && item.details && (
                              <Typography.Text strong>
                                LKR {(item.details.price * item.qty).toFixed(2)}
                              </Typography.Text>
                            )}
                          </List.Item>
                        )}
                      />
                    )}
                  </Card>
                )
              },
              {
                key: 'apply-welfare',
                label: <span><SafetyOutlined /> Apply for Welfare</span>,
                children: (
                  <Card title="Apply for Welfare">
                    <Form form={welfareForm} layout="vertical" onFinish={applyWelfare}>
                      <Form.Item label="Document URLs (comma separated)" name="documents">
                        <TextArea rows={4} placeholder="https://... , https://..." />
                      </Form.Item>
                      <Form.Item label="Note" name="note">
                        <TextArea rows={3} />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Submit Application</Button>
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
                          <List.Item.Meta
                            title={`${payment.payment_type} - ${payment.status}`}
                            description={`Amount: LKR ${payment.amount} | ${new Date(payment.createdAt).toLocaleDateString()}`}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                )
              }
            ]}
          />
        </Card>
      </div>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={editProductModal.visible}
        onCancel={() => {
          setEditProductModal({ visible: false, product: null });
          productForm.resetFields();
        }}
        footer={null}
      >
        <Form form={productForm} layout="vertical" onFinish={handleUpdateProduct}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={productCategories.map(cat => ({ label: cat, value: cat }))} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions.map(s => ({ label: s, value: s }))} />
          </Form.Item>
          <Form.Item name="p_description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Update Product</Button>
        </Form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        title="Edit Service"
        open={editServiceModal.visible}
        onCancel={() => {
          setEditServiceModal({ visible: false, service: null });
          serviceForm.resetFields();
        }}
        footer={null}
      >
        <Form form={serviceForm} layout="vertical" onFinish={handleUpdateService}>
          <Form.Item name="s_category" label="Category" rules={[{ required: true }]}>
            <Select options={serviceCategories.map(cat => ({ label: cat, value: cat }))} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions.map(s => ({ label: s, value: s }))} />
          </Form.Item>
          <Form.Item name="s_description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Update Service</Button>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editUserModal.visible}
        onCancel={() => {
          setEditUserModal({ visible: false, user: null });
          editUserForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editUserForm} layout="vertical" onFinish={handleUpdateUser}>
          <Form.Item name="universityMail" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select options={[{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }]} />
          </Form.Item>
          <Form.Item name="isPremium" label="Premium Status" valuePropName="checked">
            <Select options={[{ label: 'Regular', value: false }, { label: 'Premium', value: true }]} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Update User</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
