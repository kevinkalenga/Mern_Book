import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import Loader from "../components/Loader";
import {useLoginMutation, setCredentials} from '../slices/authSlice'
import {toast} from 'react-toastify'
import {FaEyeSlash, FaEye} from 'react-icons/fa6'


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
    <div>LoginScreen</div>
  )
}
export default LoginScreen
