import React from 'react'
import { useContext } from "react";
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
const App = () => {

  const { user, showLogin } = useContext(AppContext)

  return (
    <div className='p-6'>
      <ToastContainer position='bottom-right'/>
      {showLogin && <Login /> }
      <Routes>
        <Route path="/" element={user ? <Dashboard/> : <Home />} />
      </Routes>
    </div>
  )
}

export default App
