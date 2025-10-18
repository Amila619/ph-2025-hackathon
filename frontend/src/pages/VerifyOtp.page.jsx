import OTPComponent from "../components/OTP.component";
import { useAuth } from "../context/Auth.context";
import { AxiosInstance } from "../services/Axios.service";
import { useLocation, useNavigate } from "react-router";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshMe } = useAuth();

  const { user } = location.state || {};

  const onChange = async (otpValue) => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await AxiosInstance.post("/auth/verify-otp", {
        otp: otpValue,
        user,
      });

      if (response.data?.message === "Login successful") {
        localStorage.setItem("accessToken", response.data.accessToken);

        // Get role from the response data
        const userRole = response.data?.user?.role || "user";
        
        // Refresh user data in context
        await refreshMe();

        // Navigate based on role
        if (userRole === "admin") {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/dashboard/user", { replace: true });
        }
      }
    } catch (err) {
      // Error handling is done by Axios interceptor
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      <OTPComponent onChange={onChange} />
    </div>
  );
};

export default VerifyOtpPage;
