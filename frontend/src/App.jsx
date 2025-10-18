// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-import SignUpintro from "./components/signUpintro"
// import SignUpintro from "./components/signUpintro"
import HomePage from "./pages/HomePage.jsx"
import Dashboard from './pages/AdminDashboard.page.jsx';
import Login from './pages/Login.page.jsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Donation from "./pages/Donation.page.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import SignUp from "./pages/Signup.page.jsx";
import ProductGallery from "./pages/ProductGallery.page.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import News from "./pages/News.jsx";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product-gallery" element={<ProductGallery />} />
        <Route path="/News" element={<News />} />
      </Route>
    )
  )

  // <BrowserRouter>
  //       <Routes>
  //           <Route path="/" element={<Login />} />
  //           <Route path="/callback" element={<Dashboard />} />
  //       </Routes>
  //   </BrowserRouter>

  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route path='/' element={<RootLayout />}>
  //       <Route index element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" replace />} />
  //       {!isAuthenticated && (<><Route path='login' element={<AdminLogin />} />
  //         <Route path='reg' element={<RegisterLayout />}>
  //           <Route index element={<Navigate to="team" replace />} />
  //           <Route path='team' element={<RegisterTeam />} />
  //           <Route path='user/:id' element={<RegisterUser />} />
  //         </Route>
  //         <Route path='teams' element={<Teams />} /></>)}
  //       <Route element={<ProtectedRoute />}>
  //         <Route path='dashboard' element={<AdminDashboard />} />
  //         <Route path='update_team/:id' element={<UpdateTeam />} />
  //       </Route>
  //       <Route path='guidelines' element={<GuideLines />} />
  //       <Route path='agenda' element={<Agenda />} />
  //       <Route path="*" element={<NotFound />} />
  //     </Route>
  //   )
  // )

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
