import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import { useNavigate } from "react-router-dom"
import { saveShippingAddress } from "../slices/cartSlice"

function ShippingScreen() {
  
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart; 

    const [address, setAddress] = useState(shippingAddress.address || "")
    const [city, seCity] = useState(shippingAddress.city || "")
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "")
    const [country, setCountry] = useState(shippingAddress.country || "")
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate("/payment")
    }
  
    return (
    <div>ShippingScreen</div>
  )
}

export default ShippingScreen
