import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Navigate } from "react-router-dom"
import SignUp from './components/Auth/SignUp.jsx'
import Login from './components/Auth/Login.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Route>
      <Route path='dashboard' element={<PrivateRoute element={<Dashboard />} />}/>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
