import OTPComponent from "../components/OTP.component";
import { AxiosInstance } from "../services/Axios.service";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/Auth.context";

const VerifyOtpPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { refreshMe } = useAuth();

    const { user } = location.state || {};

    const onChange = async (text) => {
        try {
            const response = await AxiosInstance.post("/api/auth/verify-otp", {
                otp: text,
                user: user
            });

            if (response.data.message === "Login successful") {
                localStorage.setItem('accessToken', response.data.accessToken);

                // Update auth context and get user data
                try {
                    const me = await refreshMe();
                    if (me) {
                        const role = me.role || 'user';
                        if (role === 'admin') {
                            navigate('/dashboard/admin', { replace: true });
                        } else {
                            navigate('/dashboard/user', { replace: true });
                        }
                    } else {
                        navigate('/dashboard', { replace: true });
                    }
                } catch (_) {
                    navigate('/dashboard', { replace: true });
                }
            }
        } catch (err) {
            // Let Axios interceptor show error toast; stay on page for retry
        }
    }

    return (
        <div className={"h-screen flex flex-col justify-center items-center"}>
            <OTPComponent onChange={onChange} />
        </div>
    );
}

export default VerifyOtpPage;