import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../services/Axios.service";
import { Button, Card, Form, Input, Typography, Checkbox, message } from "antd";
import { 
  UserOutlined, 
  LoginOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("/auth/login", {
        universityMail: values.universityMail,
      });

      if (response?.data?.message === "Verify OTP") {
        
        // Handle "Remember me" functionality
        if (values.rememberMe) {
          localStorage.setItem('universityMail', values.universityMail);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('universityMail');
          localStorage.removeItem('rememberMe');
        }

        // Navigate to the OTP verification page
        navigate('/verify-otp', { replace: true, state: { user: response.data.user } });
      }
    } catch (error) {
      console.error('Login error:', error);
      // If user not found, redirect to register page
      if (error.response?.status === 401) {
        setTimeout(() => {
          navigate('/signup', { replace: true });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white flex items-center justify-center p-4">      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding (from File 1) */}
        <div className="space-y-6 hidden md:block">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-[#8A1717]">හෙළSavi</h1>
            <p className="text-xl text-[#8A1717]">
              Connecting Farmers, Businesses & Workers
            </p>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <SafetyOutlined className="text-3xl mt-1" />
              <div>
                <h3 className="text-black-100 font-semibold text-lg">Secure Platform</h3>
                <p className="text-black-100 text-sm">
                  Your data is protected with industry-standard security
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <ThunderboltOutlined className="text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-black-100">Quick Access</h3>
                <p className="text-black-100 text-sm">
                  Manage everything from one dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <GlobalOutlined className="text-3xl mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-black-100">Universal Platform</h3>
                <p className="text-sm text-black-100">
                  Access from anywhere, anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card (Design from File 1, Functionality from File 2) */}
        <Card className="shadow-2xl rounded-2xl border-0">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br text-[#8A1717] rounded-full shadow-lg mb-4">
                <LoginOutlined className="text-4xl text-white" />
              </div>
              <Title level={2} className="mb-2">Sign In</Title>
              <Text type="secondary" className="text-base">
                Enter your email to receive an OTP
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="universityMail"
                label="Email"
                rules={[ 
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Enter your email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item name="rememberMe" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  className="w-full h-12 text-lg font-semibold !bg-[#8A1717] border-0 hover:!bg-white shadow-lg !text-white hover:!text-black"
                >
                  Continue
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center pt-4 border-t border-gray-200">
              <Text>
                Don't have an account?{" "}
                <Link href="/signup" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.5)]">
                  Sign up now
                </Link>
              </Text>
            </div>

            <div className="text-center">
              <Text className="text-xs">
                By signing in, you agree to our{" "}
                <Link href="#" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.5)]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.5)]">
                  Privacy Policy
                </Link>
              </Text>
            </div>
          </div>
        </Card>
      </div>

      <div className="md:hidden text-center mt-6 text-white">
        <Text className="text-white text-sm">
          © 2025 ResLink. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default Login;