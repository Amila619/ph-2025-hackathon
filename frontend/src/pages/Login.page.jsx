import { Button } from "antd";

const Login = () => {

    const auth0 = async () => {
        window.location = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;
    }

    return (
        <Button onClick={auth0}>Login Now</Button>
    );
}

export default Login;