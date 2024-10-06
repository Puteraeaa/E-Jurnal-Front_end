import React, { lazy, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import { Toaster } from 'react-hot-toast';
import PrivateRoutes from './routes/PrivateRoutes';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Page404 = lazy(() => import('./pages/protected/404')); // Import halaman 404
const Page403 = lazy(() => import('./pages/protected/Forbidden')); // Import halaman 404

function App() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Redirect dari /dashboard ke /app/dashboard */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

          {/* Rute untuk bagian yang terlindungi */}
          <Route
            path="/app/*"
            element={
              <PrivateRoutes>
                <Layout />
              </PrivateRoutes>
            }
          />

          {/* Rute wildcard untuk 404 */}
          <Route path="*" element={<Page404 />} />
          <Route path="403" element={<Page403 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
