import { useEffect } from "react"
import {Link, useNavigate} from 'react-router-dom'
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import Message from '../components/Message'
import Loader from "../components/Loader"
import {useCreateOrderMutation} from '../slices/ordersApiSlice'
import {clearCartItems} from '../slices/cartSlice'

function PlaceOrderScreen() {
  
    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)

    const [createOrder, {isLoading, error}] = useCreateOrderMutation()
    const dispatch = useDispatch();

    useEffect(() => {
        if(!cart.shippingAddress.address) {
            navigate("/shipping")
        } else if(!cart.paymentMethod) {
           navigate("/payment")
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])

    const placeOrder = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress:cart.shippingAddress,
                paymentMethod:cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.totalPrice
            }).unwrap()
            navigate(`/order/${res._id}`);
            dispatch(clearCartItems())
        } catch (error) {
            toast.error(error)
        }
    }
  
  return (
    <div className="container mx-auto p-6">
         <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-xl 
                  shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Details</h2>
                     <p className="text-gray-600">
                        <strong className="text-primary">Address:</strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}, {" "}
                        {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                     </p>
                </div>
                <div className="bg-white p-8 rounded-xl 
                  shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                     <p className="text-gray-600">
                        <strong className="text-primary">Method:</strong>
                        {cart.paymentMethod}
                     </p>
                </div>
            </div>
         </div>
    </div>
  )
}

export default PlaceOrderScreen
