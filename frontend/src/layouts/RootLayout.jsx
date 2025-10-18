import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"
import AnimatedNavbar from "../components/AnimatedNavBar";
import BreadCrumbs from "../components/BreadCrumbs";
import FloatingChatbot from "../components/ChatBot";

export default function RootLayout() {
    return (
        <>
            <AnimatedNavbar />
            <BreadCrumbs />
            <Outlet />
            <FloatingChatbot />
            <Footer />
        </>
    )
}