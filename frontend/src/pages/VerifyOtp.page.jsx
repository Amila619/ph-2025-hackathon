import OTPComponent from "../components/OTP.component";
import { useAuth } from "../context/Auth.context";
import { AxiosInstance } from "../services/Axios.service";
import { useLocation, useNavigate } from "react-router";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshMe, setIsLoggedIn, setRole, setUser } = useAuth();

  // Check for user from navigation state or localStorage (registration flow)
  let { user } = location.state || {};
  if (!user) {
    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      user = JSON.parse(pendingUser);
    }
  }

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
        // Clear pending user from localStorage if it exists
        localStorage.removeItem('pendingUser');
        
        // Save token to localStorage
        localStorage.setItem("accessToken", response.data.accessToken);

        // Get role and user from the response data
        const userRole = response.data?.user?.role || "user";
        const userData = response.data?.user;
        
        // Immediately update auth context to prevent PublicRoute from redirecting
        setIsLoggedIn(true);
        setRole(userRole);
        setUser(userData);

        // Navigate based on role
        if (userRole === "admin") {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/dashboard/user", { replace: true });
        }

        // Refresh user data in background (for full user info)
        refreshMe();
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
