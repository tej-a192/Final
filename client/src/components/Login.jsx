import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';

const Login = () => {

    const [state, setState] = useState('Login')
    const {setShowLogin, backendURL,setUser, setToken} = useContext(AppContext)
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e)=> {
        e.preventDefault()
        setLoading(true)
        try {
            
            if(state === 'Login') {
                const {data} = await axios.post(backendURL + '/api/user/signin', {email, password})

                if(data.success) {
                    setToken(data.token)
                    setShowLogin(false)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                }else {
                    toast.error(data.message)
                }
            }
            else {
                const {data} = await axios.post(backendURL + '/api/user/signup', {name, email, password})

                if(data.success) {
                    toast.success("Registration successful! Login Now"); 
                    setState('Login')
                }else {
                    toast.error(data.message)
                }
            }
            setLoading(false)
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "An error occurred");
            setLoading(false);
        }
        
    }

    useEffect(()=> {
        document.body.style.overflow = 'hidden'

        return ()=> {
            document.body.style.overflow = 'unset'
        }
    },[])


  return (
    <div className='fixed right-0 top-0 left-0 bottom-0 z-10 backdrop-blur-sm bg-black/10 flex justify-center items-center'>
      <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-md text-slate-500' initial={{scale:0}} animate={{scale:1}} exit={{opacity:0}} transition={{duration:0.3}}>
            <span className={`absolute bg-blue-500 h-1 bottom-0 left-0 rounded-lg ${loading ? 'w-full max-w-md transition-all duration-[10s]' : 'w-0'}`}/>
            {/* Heading */}
            <h1 className='font-medium text-3xl text-center'>{state}</h1>
            
            {/* Sub-Heading */}
            { state === 'Login'
                ? 
                    <p className='text-gray-500 text-center'>Welcome back! Please sign in to continue</p>
                :
                    <p className='text-gray-500 text-center'>Welcome to PixelPioneer!</p>
            }

            {/* Full name */}
            {
                state !== 'Login' &&
                <div className='flex items-center border px-5 py-2 rounded-md gap-2 mt-10 text-xl'>
                    <CiUser />
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter full name' required className='outline-none'/>
                </div>
            }

            {/* Email */}
            <div className='flex items-center border px-5 py-2 rounded-md gap-2 mt-5 text-xl'>
                <CiMail/>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email' required className='outline-none'/>
            </div>
            
            {/* Password */}
            <div className='flex items-center border px-5 py-2 rounded-md gap-2 mt-5 text-xl'>
                <CiLock />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password' required className='outline-none'/>
            </div>

            {/* Confrim Password */}
            {/* {
            state !== 'Login' &&
                <div className='flex items-center border px-5 py-2 rounded-md gap-2 mt-5 text-xl'>
                    <CiLock />
                    <input type="password" placeholder='Confirm password' required className='outline-none'/>
                </div>
            } */}

            {/* Button */}
            <button type='submit' className='w-full bg-blue-500 text-white mt-5 p-2 rounded-md text-2xl'>{state === 'Login' ? 'Login' : 'Register'}</button>


            {/* Have or dont have an account? */}
            {state === 'Login' ?
                <p className='mt-2 text-center'>Don't have an account? <span className='cursor-pointer text-blue-500 hover:underline' onClick={()=>setState('Sign Up')}>signup</span></p>

                :

                <p className='mt-2 text-center'>Already have an account? <span className='cursor-pointer text-blue-500 hover:underline' onClick={()=>setState('Login')}>Login</span></p>
            }
            {/* Close Button */}
            <RxCross2 onClick={()=> setShowLogin(false)} className='absolute top-3 right-3 text-3xl cursor-pointer' />

      </motion.form>
    </div>
  )
}

export default Login
