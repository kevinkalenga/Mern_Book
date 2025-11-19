import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import Loader from "../components/Loader";
import {useRegisterMutation} from '../slices/usersApiSlice'
import {toast} from 'react-toastify'
import {FaEyeSlash, FaEye} from 'react-icons/fa6'
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";


import React from 'react'

function LoginScreen() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()
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

        if(password !== confirmPassword) {
            toast.error("Password do not match")
        } else {
            try {
                const res = await register({name, email, password}).unwrap()
                dispatch(setCredentials({...res}))
                navigate(redirect)
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    
    
    return (
    <FormContainer>
        <h1 className="text-2xl font-semibold mb-4 mt-5">Register</h1>
        <form className="space-y-4" onSubmit={submitHandler}>
             <div className="space-y-2">
                 <label htmlFor="name" className="block tex-sm font-meduim text-gray-700">Name</label>
                 <input type="text" name="name" 
                    id="name" placeholder="Enter your name" 
                    value={name} className="w-full px-3
                       py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:right-2 focus:ring-2 focus:ring-primary" 
                       onChange={(e) => setName(e.target.value)} />
             </div>
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
             <div className="space-y-2 relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" placeholder="Confirm Password"
                  onChange={(e) =>setConfirmPassword(e.target.value)}
                  className="w-full px-3
                       py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:right-2 focus:ring-2 focus:ring-primary"
                />
                <button 
                   type="button" 
                   onClick={toggleConfirmPasswordVisibility} 
                   className="absolute inset-y-0 right-2 top-5 text-primary">
                    {
                        showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                    }
                </button>
             </div>
            <button 
              disabled={isLoading} 
              type="submit" 
               className="w-full bg-primary
                text-white py-2 px-2 rounded-md hover:bg-secondary 
                focus:outline-none focus:ring-2 focus:ring-secondary">
                     Register
            </button>
            {
                isLoading && <Loader />
            }
        </form>
        <div className="py-3">
           <p>
            Already have an account ?{" "} <Link className="text-primary hover:text-secondary" to={redirect ? `/login?redirect=${redirect}`:'/login' }>
               Login
            </Link>
           </p>
        </div>
    </FormContainer>
  )
}
export default LoginScreen
