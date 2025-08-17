import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import Loader from "../components/Loader";
import {useLoginMutation} from '../slices/usersApiSlice'
import {toast} from 'react-toastify'
import {FaEyeSlash, FaEye} from 'react-icons/fa6'
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";


import React from 'react'

function LoginScreen() {
 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()
    const {userInfo} = useSelector((state) => state.auth)
    
    // if you add product to cart then you will be redirected to checkout if you're logged in
    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get("redirect") || "/"

    useEffect(() => {
        
        if(userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]) 


    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const res = await login({email, password}).unwrap()
            
            dispatch(setCredentials({...res}))
            navigate(redirect)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    
    
    return (
    <FormContainer>
        <h1 className="text-2xl font-semibold mb-4 mt-5">Sign In</h1>
        <form className="space-y-4" onSubmit={submitHandler}>
            <div className="space-y-2">
                <label htmlFor="email" className="block tex-sm font-meduim text-gray-700">Email Address</label>
                <input type="email" id="email" className="w-full px-3
                       py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:right-2 focus:ring-2 focus:ring-primary"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email"/>
            </div>
            <div className="space-y-2 relative">
                <label htmlFor="password" className="block tex-sm font-meduim text-gray-700">Password</label>
                <input type={showPassword ? "text":"password"} id="password" className="w-full px-3
                       py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:right-2 focus:ring-2 focus:ring-primary"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"/>
                
                 <button 
                   type="button"
                   onClick={togglePasswordVisibility}
                   className="absolute inset-y-0 right-2 top-5 text-primary"
                   >
                     {
                        showPassword ? <FaEyeSlash /> : <FaEye />
                     }
                 </button>
            </div>
            <button 
              disabled={isLoading} 
              type="submit" 
               className="w-full bg-primary
                text-white py-2 px-2 rounded-md hover:bg-secondary 
                focus:outline-none focus:ring-2 focus:ring-secondary">
                     Sign In
            </button>
            {
                isLoading && <Loader />
            }
        </form>
        <div className="py-3">
           <p>
            New User ? <Link className="text-primary hover:text-secondary" to={redirect ? `register?redirect=${redirect}`:'/register' }>
               Register
            </Link>
           </p>
        </div>
    </FormContainer>
  )
}
export default LoginScreen
