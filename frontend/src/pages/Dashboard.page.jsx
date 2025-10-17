import { Spin } from 'antd';
import { AxiosInstance } from '../services/Axios.service';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/Auth.context';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, role, loading, refreshMe } = useAuth();
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
            navigate('/', { replace: true }); 
            return; 
        }
        
        // If we already have user data, redirect immediately
        if (user && role) {
            if (role === 'admin') {
                navigate('/dashboard/admin', { replace: true });
            } else {
                navigate('/dashboard/user', { replace: true });
            }
            return;
        }
        
        // Only fetch user data if we don't have it
        (async () => {
            try {
                const me = await refreshMe();
                if (me) {
                    const effectiveRole = me.role || 'user';
                    if (effectiveRole === 'admin') {
                        navigate('/dashboard/admin', { replace: true });
                    } else {
                        navigate('/dashboard/user', { replace: true });
                    }
                } else {
                    navigate('/', { replace: true });
                }
            } catch (e) {
                navigate('/', { replace: true });
            } finally {
                setLocalLoading(false);
            }
        })();
    }, [navigate, user, role, refreshMe]);

    return (
        <div className={"p-6 flex items-center justify-center min-h-screen"}>
            <Spin spinning={loading || localLoading} size="large" />
        </div>
    )
}

export default Dashboard;