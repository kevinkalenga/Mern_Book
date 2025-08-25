import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"
import Message from "../components/Message"
import FormContainer from "../components/FormContainer"
import {useProfileMutation} from '../slices/usersApiSlice'
import { useGetMyOrderQuery } from "../slices/ordersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { Link } from "react-router-dom"

function ProfileScreen() {
  
      const [name, setName] = useState("")
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [confirmPassword, setConfirmPassword] = useState("")
      const [showPassword, setShowPassword] = useState(false)
      const [showConfirmPassword, setShowConfirmPassword] = useState(false)

      const [activeTab, setActiveTab] = useState("profile");
      const {userInfo} = useSelector((state) => state.auth)
      const {data:orders, isLoading, error} = useGetMyOrderQuery()

      const [updateProfile, {isLoading:loadingUpdateProfile}] = useProfileMutation() 

      useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
      }, [userInfo.name, userInfo.email])

      const dispatch = useDispatch()

      const togglePasswordVisibility = () => {
         setShowPassword(!showPassword)
      }
      const toggleConfirmPasswordVisibility = () => {
         setShowConfirmPassword(!showConfirmPassword)
      }

      const submitHandler = async (e) => {
         e.preventDefault()
         if(password !== confirmPassword) {
            toast.error = ("Password do not match")
         } else {
            try {
                const res = await updateProfile({
                    name, 
                    email,
                    password
                }).unwrap()
                dispatch(setCredentials({...res}))
                toast.success("Profile updated successfully")
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
         }
      }
  
  
    return (
    <div>ProfileScreen</div>
  )
}

export default ProfileScreen
