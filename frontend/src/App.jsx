// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import SignUpintro from "./signUpintro.jsx"
import HomePage from "./components/homepage.jsx"
import Dashboard from './pages/Dashboard.page.jsx';
import Login from './pages/Login.page.jsx';


function App() {

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
      {/* <RouterProvider router={router} /> */}
    </div>
  )
}

export default App
