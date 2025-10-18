import { useEffect, useState } from "react";
import { 
  Layout, 
  Menu, 
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
  Button
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

//import { getLoginStatus } from "../services/api";
import { useAuth } from "../hooks/AuthContext";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const { setIsAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [userData, setUserData] = useState([]);
  const [products, setProducts] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getLoginStatus()
      .then((data) => {
        setIsAuthenticated(data);
        localStorage.setItem("auth", data);
      })
      .catch((err) => console.error(err));

    // Enhanced mock data
    setUserData([
      { 
        key: 1, 
        name: "John Doe", 
        role: "Farmer", 
        location: "Galle",
        email: "john@example.com",
        joinDate: "2024-01-15",
        status: "Active"
      },
      { 
        key: 2, 
        name: "Acme Factory", 
        role: "Business", 
        location: "Colombo",
        email: "acme@example.com",
        joinDate: "2024-02-20",
        status: "Active"
      },
      { 
        key: 3, 
        name: "Jane Smith", 
        role: "Worker", 
        location: "Kandy",
        email: "jane@example.com",
        joinDate: "2024-03-10",
        status: "Inactive"
      },
    ]);

    setProducts([
      { 
        key: 1, 
        name: "Coconut", 
        price: 120, 
        farmer: "John Doe", 
        location: "Galle",
        stock: 150,
        category: "Fruits"
      },
      { 
        key: 2, 
        name: "Vegetables", 
        price: 80, 
        farmer: "Mary Jane", 
        location: "Kandy",
        stock: 200,
        category: "Vegetables"
      },
      { 
        key: 3, 
        name: "Rice", 
        price: 200, 
        farmer: "Sam Wilson", 
        location: "Anuradhapura",
        stock: 500,
        category: "Grains"
      },
    ]);

    setJobs([
      { 
        key: 1, 
        title: "Transport Coconuts", 
        worker: "Alex", 
        status: "Open",
        payment: "Rs 5000",
        deadline: "2025-01-20"
      },
      { 
        key: 2, 
        title: "Harvesting", 
        worker: "Saman", 
        status: "Filled",
        payment: "Rs 3000",
        deadline: "2025-01-18"
      },
      { 
        key: 3, 
        title: "Packaging Work", 
        worker: "Nimal", 
        status: "Open",
        payment: "Rs 4000",
        deadline: "2025-01-25"
      },
    ]);
  }, [setIsAuthenticated]);

  const userColumns = [
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email"
    },
    { 
      title: "Role", 
      dataIndex: "role", 
      key: "role",
      render: (role) => {
        const colors = {
          Farmer: 'green',
          Business: 'blue',
          Worker: 'orange'
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      }
    },
    { 
      title: "Location", 
      dataIndex: "location", 
      key: "location"
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "success" : "default"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            className="text-blue-500 hover:text-blue-700"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-green-500 hover:text-green-700"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      )
    }
  ];

  const productColumns = [
    { 
      title: "Product", 
      dataIndex: "name", 
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    { 
      title: "Category", 
      dataIndex: "category", 
      key: "category",
      render: (category) => <Tag color="purple">{category}</Tag>
    },
    { 
      title: "Price (Rs)", 
      dataIndex: "price", 
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <span className="font-semibold">Rs {price}</span>
    },
    { 
      title: "Stock", 
      dataIndex: "stock", 
      key: "stock",
      sorter: (a, b) => a.stock - b.stock
    },
    { 
      title: "Farmer", 
      dataIndex: "farmer", 
      key: "farmer"
    },
    { 
      title: "Location", 
      dataIndex: "location", 
      key: "location"
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-500 hover:text-blue-700"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      )
    }
  ];

  const jobColumns = [
    { 
      title: "Job Title", 
      dataIndex: "title", 
      key: "title"
    },
    { 
      title: "Worker", 
      dataIndex: "worker", 
      key: "worker"
    },
    { 
      title: "Payment", 
      dataIndex: "payment", 
      key: "payment",
      render: (payment) => <span className="font-semibold text-green-600">{payment}</span>
    },
    { 
      title: "Deadline", 
      dataIndex: "deadline", 
      key: "deadline"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Open" ? "green" : "blue"} className="font-semibold">
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            className="text-blue-500 hover:text-blue-700"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-orange-500 hover:text-orange-700"
          />
        </Space>
      )
    }
  ];

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '3',
      icon: <ShopOutlined />,
      label: 'Products',
    },
    {
      key: '4',
      icon: <FileTextOutlined />,
      label: 'Jobs',
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const openJobs = jobs.filter(j => j.status === "Open").length;

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        className="bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-xl"
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center text-white border-b border-indigo-600">
          <h1 className="text-2xl font-bold tracking-wider">
            {collapsed ? "RL" : "ResLink"}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          className="mt-4 bg-transparent"
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white flex justify-between items-center px-6 shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              type="text" 
              icon={<SearchOutlined />} 
              className="text-gray-600 hover:text-blue-500"
            />
            <Badge count={5} color="#f56a00">
              <BellOutlined className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500 transition" />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:opacity-80 transition">
                <Avatar size="large" icon={<UserOutlined />} className="bg-indigo-600" />
                <span className="text-gray-700 font-medium hidden md:inline">Admin User</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="m-6">
          {/* Quick Stats */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-xl border-l-4 border-indigo-600 hover:shadow-2xl transition-all duration-300">
                <Statistic
                  title={<span className="text-gray-600">Total Users</span>}
                  value={userData.length}
                  prefix={<UserOutlined className="text-indigo-600" />}
                  valueStyle={{ color: '#4f46e5' }}
                />
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <RiseOutlined className="mr-1" />
                  <span>12% increase</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-xl border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300">
                <Statistic
                  title={<span className="text-gray-600">Products Listed</span>}
                  value={products.length}
                  prefix={<ShopOutlined className="text-green-500" />}
                  valueStyle={{ color: '#22c55e' }}
                />
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <RiseOutlined className="mr-1" />
                  <span>8% increase</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-xl border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300">
                <Statistic
                  title={<span className="text-gray-600">Active Jobs</span>}
                  value={openJobs}
                  prefix={<FileTextOutlined className="text-yellow-500" />}
                  valueStyle={{ color: '#eab308' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {jobs.length - openJobs} filled
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-lg rounded-xl border-l-4 border-purple-600 hover:shadow-2xl transition-all duration-300">
                <Statistic
                  title={<span className="text-gray-600">Revenue (Monthly)</span>}
                  value={125000}
                  prefix="Rs"
                  valueStyle={{ color: '#9333ea' }}
                />
                <div className="mt-2 flex items-center text-sm text-red-500">
                  <FallOutlined className="mr-1" />
                  <span>3% decrease</span>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Tables Section */}
          <div className="space-y-6">
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Users Management</span>
                  <Button type="primary" icon={<PlusOutlined />} className="bg-indigo-600">
                    Add User
                  </Button>
                </div>
              }
              extra={
                <Button icon={<ExportOutlined />}>Export</Button>
              }
              className="shadow-lg rounded-xl"
            >
              <Table
                columns={userColumns}
                dataSource={userData}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={() => "hover:bg-gray-50 transition-colors"}
              />
            </Card>

            <Card 
              title={
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Products Inventory</span>
                  <Button type="primary" icon={<PlusOutlined />} className="bg-green-600">
                    Add Product
                  </Button>
                </div>
              }
              extra={
                <Button icon={<ExportOutlined />}>Export</Button>
              }
              className="shadow-lg rounded-xl"
            >
              <Table
                columns={productColumns}
                dataSource={products}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={() => "hover:bg-gray-50 transition-colors"}
              />
            </Card>

            <Card 
              title={
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Jobs Management</span>
                  <Button type="primary" icon={<PlusOutlined />} className="bg-yellow-600">
                    Post Job
                  </Button>
                </div>
              }
              extra={
                <Button icon={<ExportOutlined />}>Export</Button>
              }
              className="shadow-lg rounded-xl"
            >
              <Table
                columns={jobColumns}
                dataSource={jobs}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={() => "hover:bg-gray-50 transition-colors"}
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;