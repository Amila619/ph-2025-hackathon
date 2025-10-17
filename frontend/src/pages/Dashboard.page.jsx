import { Button } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const onLogout = async () => {
        await AxiosInstance.post('/api/auth/logout');
        localStorage.removeItem('accessToken');
        navigate('/', { replace: true });
    };

    return (
        <div>
            <h1>Dashboard Page</h1>
            <Button onClick={onLogout}>Logout</Button>
        </div>
    )
}

export default Dashboard;