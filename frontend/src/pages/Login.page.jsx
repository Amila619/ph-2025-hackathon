import { Button } from "antd";
import { AxiosInstance } from "../services/Axios.service";

const Login = () => {

    const auth0 = async () => {

        // await AxiosInstance.post('/api/auth/login');
        // console.log(response);

        window.location = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;
    }

    return (
        <Button onClick={auth0}>Login Now</Button>
    );
}

export default Login;