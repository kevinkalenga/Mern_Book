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
import Loader from "../components/Loader"


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
            toast.error("Password do not match")
            return
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
    <div className="container mx-auto my-5">
        <div className="flex space-x-4 mb-4">
           <button className={`px-4 py-2 hover:bg-secondary ${
             activeTab === "profile" ? "bg-primary text-white":"bg-gray-200"
             
           }`} onClick={()=> setActiveTab("profile")}>
                User Profile
           </button>
           <button className={`px-4 py-2 hover:bg-secondary ${
             activeTab === "orders" ? "bg-primary text-white":"bg-gray-200"
             
           }`} onClick={() => setActiveTab("orders")}>
               My orders
           </button>
        </div>
         <FormContainer>
            {
                activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-2xl font-bold mb-4">User Prifle</h2>
                       <form onSubmit={submitHandler} className="space-y-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <input 
                                type="text" 
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full py-2 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-primary focus:border-primary px-3"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700">Email Address</label>
                              <input 
                                type="email" 
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full py-2 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-primary focus:border-primary px-3"
                              />
                           </div>
                           <div className="relative">
                              <label className="block text-sm font-medium text-gray-700">Password</label>
                              <input 
                                type={showPassword ? 'text': 'password'} 
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full py-2 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-primary focus:border-primary px-3"
                              />
                              <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-2 top-6 text-primary"
                              >
                                {
                                    showPassword ? <FaEyeSlash /> : <FaEye />
                                }
                              </button>
                           </div>
                           <div className="relative">
                              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                              <input 
                                type={showConfirmPassword ? 'text': 'password'} 
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full py-2 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-primary focus:border-primary px-3"
                              />
                              <button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                              className="absolute inset-y-0 right-2 top-6 text-primary"
                              >
                                {
                                    showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                                }
                              </button>
                           </div>
                           <button 
                             type="submit"
                             className="w-full justify-center py-2 px-4 border
                              border-transparent rounded-md shadow-sm 
                              text-sm font-medium text-white bg-primary
                               hover:bg-secondary focus:outline-none focus:ring-2 
                               focus:ring-offset-2 focus:ring-primary"
                            >
                               Update
                           </button>
                           {loadingUpdateProfile && <Loader />}
                       </form>
                       
                    </div>
                )
            }
         </FormContainer>
         {
             activeTab === "orders" && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                                {
                                    isLoading? (<Loader />):error?(<Message>
                                        {error?.data?.message || error.error}
                                    </Message>):(
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                     <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             DATE
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             TOTAL
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             PAID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             DELIVERED
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                             
                                                        </th>

                                                     </tr>
                                                </thead>
                                                 <tbody className="bg-white divide-y divide-y-200">
                                                    {
                                                        orders.map((order) => (
                                                            <tr key={order._id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {order._id}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {order.createdAt.substring(0,10)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {order.totalPrice}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {order.isPaid ? (order.paidAt.substring(0,10)):(<FaTimes className="text-red-500" />)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {order.isDelivered ? (
                                                                        order.deliveredAt.substring(0,10)
                                                                    ):(
                                                                        <FaTimes className="text-red-500" />
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <Link
                                                                     to={`/order/${order._id}`}
                                                                     className="text-primary hover:text-secondary"
                                                                    >
                                                                       <FaEye size={20} />
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    }

                                                 </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                            </div>
                )
        }
    </div>
  )
}

export default ProfileScreen
