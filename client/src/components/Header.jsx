import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'

const Header = () => {
    const { setUser, setToken } = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        // Clear user authentication data
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)

        // Redirect to home page
        navigate('/')
    }

    return (
        <div className='flex justify-between border-b pb-3'>
            <h1 className='font-bold text-4xl text-black italic'>Persona.</h1>

            <div className='flex justify-between items-center space-x-16'>

            {/* <AlertDialog>
                <AlertDialogTrigger className=' bg-black text-white px-6 py-1.5 rounded-md font-bold'>Restore local</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Restore now</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
                <AlertDialogTrigger className=' bg-black text-white px-6 py-1.5 rounded-md font-bold'>Restore via QR code</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Generate QR</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}


                <AlertDialog>
                    <AlertDialogTrigger className='border bg-black text-white font-bold p-2 rounded'>Logout</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog> 
            </div>

        </div>
    )
}

export default Header
