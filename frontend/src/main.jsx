import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import HomePage from './components/Home/HomePage.jsx';
import About from './components/About/About.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Login from './components/Auth/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import Profile from './components/Dashboard/Profile.jsx';

const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<HomePage />} />/
        <Route path="about" element={<About />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="*" element={<HomePage />} />
      </Route>
      <Route path="dashboard" element={<PrivateRoute element={<Dashboard />} />} />
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId} >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
