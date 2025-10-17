import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from './pages/Dashboard.page.jsx';
import Login from './pages/Login.page.jsx';
import VerifyOtpPage from './pages/VerifyOtp.page.jsx';
import RegisterPage from './pages/Register.page.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route index element={<Login />} />
            <Route path='/verify-otp' element={<VerifyOtpPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover theme="colored" />
    </BrowserRouter>
)
