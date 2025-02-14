import React from 'react'
import  { useContext } from "react";
import { AppContext } from '../context/AppContext'

const Home = () => {
  const {setShowLogin} = useContext(AppContext)

  return (
    <div className='flex justify-center items-center mx-auto my-auto'>
      <button className='bg-black text-white px-6 py-2 rounded-md' onClick={() => setShowLogin(true)}>Login</button>
    </div>
  )
}

export default Home
