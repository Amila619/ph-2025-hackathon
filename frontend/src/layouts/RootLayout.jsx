import { Outlet } from "react-router-dom";
//import NavBar from "../components/NavBar";
import Footer from "../components/Footer"
import Breadcrumbs from "../components/BreadCrumb";
import AnimatedNavbar from "../components/AnimatedNavBar";
import HeroSection from "../components/HeroSection";
import HomePage from "../components/homepage";

export default function RootLayout() {
    return (
        <>
            <AnimatedNavbar />
            <HomePage />
            <Outlet />
            <Footer />
        </>
    )
}