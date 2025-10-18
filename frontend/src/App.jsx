import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.page.jsx";
import Login from "./pages/Login.page.jsx";
import Donation from "./pages/Donation.page.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import SignUp from "./pages/Signup.page.jsx";
import ProductGallery from "./pages/ProductGallery.page.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import VerifyOtpPage from "./pages/VerifyOtp.page.jsx";
import UserDashboard from "./pages/UserDashboard.page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/Auth.context.jsx";
import News from "./pages/News.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/donation" element={<Donation />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/product-gallery" element={<ProductGallery />} />
      <Route path="/news" element={<News />} />
      
      {/* Public routes - only accessible when NOT logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Protected routes - only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
