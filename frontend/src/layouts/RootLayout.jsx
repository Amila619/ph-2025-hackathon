import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"
import Breadcrumbs from "../components/BreadCrumb";

export default function RootLayout() {
    return (
        <>
            <NavBar />
            <Breadcrumbs />
            <Outlet />
            <Footer />
        </>
    )
}