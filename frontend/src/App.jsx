import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./context/Auth.context.jsx";
import News from "./pages/News.jsx";
// import { useAuth } from "./hooks/AuthContext.js";
import UserDashboard from "./pages/UserDashboard.page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {

  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/about" element={<AboutUs />} />
        <Route element={<ProtectedRoute />}>
          <Route path='admin-dashboard' element={<AdminDashboard />} />
          <Route path='user-dashboard' element={<UserDashboard />} />
        </Route>
        {!isAuthenticated && <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </>}
        <Route path="/product-gallery" element={<ProductGallery />} />
        <Route path="/News" element={<News />} />
      </Route>
    )
  )
  return (
    // ✅ Wrap everything inside AuthProvider
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
