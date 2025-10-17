import OTPComponent from "../components/OTP.component";
import { AxiosInstance } from "../services/Axios.service";
import { useLocation, useNavigate } from "react-router";

const VerifyOtpPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { user } = location.state || {};

    const onChange = async (text) => {


        const response = await AxiosInstance.post("/api/auth/verify-otp", {
            otp: text,
            user: user
        });

        if (response.data.message === "Login successful") {

            localStorage.setItem('accessToken', response.data.accessToken);
            navigate('/dashboard', { replace: true, state: { user: user } });
        }
    }

    return (
        <div className={"h-screen flex flex-col justify-center items-center"}>
            <OTPComponent onChange={onChange} />
        </div>
    );
}

export default VerifyOtpPage;