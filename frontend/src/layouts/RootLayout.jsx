import { Outlet } from "react-router-dom";
//import NavBar from "../components/NavBar";
import Footer from "../components/Footer"
import Breadcrumbs from "../components/BreadCrumb";
import AnimatedNavbar from "../components/AnimatedNavBar";

export default function RootLayout() {
    return (
        <>
            <AnimatedNavbar />
            <Breadcrumbs />
            <Outlet />
            <Footer />
        </>
    )
}