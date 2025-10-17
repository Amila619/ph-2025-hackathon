import { useState } from "react";
import { Button, Card, Form, Input, Typography, Checkbox, message } from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  SmileOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful! Please log in.');
        window.location.href = '/login';
      } else {
        message.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-[#8A1717]">හෙළSavi</h1>
            <p className="text-xl !text-[#8A1717]">
              Connecting Farmers, Businesses & Workers
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <SafetyOutlined className="text-3xl mt-1 !text-black" />
                <div>
                <h3 className="font-semibold text-lg !text-black">Secure Platform</h3>
                <p className="text-sm !text-black">
                    Your data is protected with industry-standard security
                </p>
            </div>
        </div>

        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <ThunderboltOutlined className="text-3xl mt-1 !text-black" />
            <div>
                <h3 className="font-semibold text-lg !text-black">Quick Access</h3>
                <p className="text-sm !text-black">
                    Manage everything from one dashboard
                </p>
            </div>
        </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <GlobalOutlined className="text-3xl mt-1 !text-black" />
                <div>
                <h3 className="font-semibold text-lg !text-black">Universal Platform</h3>
                <p className="text-sm !text-black">
                    Access from anywhere, anytime
                </p>
                </div>
            </div>
            </div>
        </div>

        {/* Right Side - Sign Up Card */}
        <Card className="shadow-2xl rounded-2xl border-0">
          <div className="space-y-6">
            {/* Logo/Icon */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br text-[#8A1717] rounded-full shadow-lg mb-4">
                <SmileOutlined className="text-4xl text-white" />
              </div>
              <Title level={2} className="mb-2">Create Account</Title>
              <Text type="secondary" className="text-base">
                Sign up to join the ResLink community
              </Text>
            </div>

            {/* Sign Up Form */}
            <Form
              name="signup"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Enter your full name"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="email"
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

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be minimum 6 characters.' }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('The two passwords do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item name="agreement" valuePropName="checked" rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject('You must accept the terms and privacy policy'),
                  },
                ]}
              >
                <Checkbox>
                  I agree to the{" "}
                  <Link href="#" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.6)]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.6)]">
                    Privacy Policy
                  </Link>.
                </Checkbox>
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                //   type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 text-lg font-semibold !bg-[#8A1717] border-0 hover:!bg-white shadow-lg !text-white hover:!text-black"
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Text type="secondary">
                Already have an account?{" "}
                <Link href="/login" className="!text-[rgba(138,23,23,1)] hover:!text-[rgba(138,23,23,0.6)]">
                  Sign in
                </Link>
              </Text>
            </div>

            {/* Footer */}
            <div className="text-center">
              <Text type="secondary" className="text-xs">
                © 2025 ResLink. All rights reserved.
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Branding */}
      <div className="md:hidden text-center mt-6 text-white">
        <Text className="text-white text-sm">
          © 2025 ResLink. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default SignUp;
