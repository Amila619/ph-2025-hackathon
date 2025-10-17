import { Button, Form, Input, Typography, Image } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useNavigate } from 'react-router';

const { Title } = Typography;

const RegisterPage = () =>{
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const response = await AxiosInstance.post('/api/auth/register', {
            universityMail: values.universityMail
        });
        if (response.data?.user) {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className={"h-screen flex flex-col justify-center items-center"}>
            <Image
                preview={false}
                src="/logo.png"
                width={120}
                className={"mb-5"}
            />
            <Title level={3}>Create your account</Title>
            <Form
                name="register"
                onFinish={onFinish}
                style={{ maxWidth: 360, width: '100%' }}
            >
                <Form.Item
                    name="universityMail"
                    rules={[{ required: true, message: 'Please input your valid Email!', type: 'email' }]}
                >
                    <Input placeholder="University Email" />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default RegisterPage;