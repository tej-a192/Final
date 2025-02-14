import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";
export const AppContext = createContext()


const AppContextProvider = (props)=> {

    const [user, setUser] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const backendURL = import.meta.env.VITE_BACKEND_URL

    

    const logout = ()=> {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }


    const value = {
        user, setUser, showLogin, setShowLogin, backendURL,token, setToken, logout
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
