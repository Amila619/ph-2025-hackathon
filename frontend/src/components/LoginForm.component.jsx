import { MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { Link } from 'react-router';

const LoginFormComponent = ({ onFinish }) => {

  return (
    <Form
      name="login"
      initialValues={{ rememberMe: localStorage.getItem('rememberMe') === 'true', universityMail: localStorage.getItem('universityMail') }}
      style={{ maxWidth: 360, width: '100%'}}
      onFinish={onFinish}
    >
      <Form.Item
        name="universityMail"
        rules={[{ required: true, message: 'Please input your valid Email!', type: 'email', pattern: new RegExp('/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/') }]}
      >
        <Input prefix={<MailOutlined />} placeholder="User Email" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
        or <Link to="/register">Register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginFormComponent;