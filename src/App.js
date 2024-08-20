import React, { lazy, useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import { Toaster } from 'react-hot-toast';



// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))







// Check for login and initialize axios



function App() {

  useEffect(() => {
    themeChange(false)
  }, [])


  return (
    <>
    <Toaster/>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Place new routes over this */}
          <Route path="/app/*" element={<Layout />} />

     

        </Routes>
      </Router>
    </>
  )
}

export default App
