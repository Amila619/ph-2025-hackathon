import LoginForm from '../components/LoginForm.component';
import { Image } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useNavigate } from 'react-router';

const LoginPage = () => {

  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values.universityMail, values.rememberMe);

    const response = await AxiosInstance.post('/api/auth/login', {
      universityMail: values.universityMail,
    });

    console.log("data:", response.data.message);

    if (response.data.message === "Verify OTP") { 

      if (values.rememberMe) {
        localStorage.setItem('universityMail', values.universityMail);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('universityMail');
        localStorage.removeItem('rememberMe');
      }

      navigate('/verify-otp', { replace: true, state: { user: response.data.user } });
    }
  }

  return (
    <div className={"h-screen flex flex-col justify-center items-center"}>
      <Image
        preview={false}
        src="/logo.png"
        width={150}
        className={"mb-7"}
      />
      <LoginForm onFinish={onFinish} />
    </div>
  );
};

export default LoginPage;