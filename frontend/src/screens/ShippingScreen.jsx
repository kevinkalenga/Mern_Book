import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import { useNavigate } from "react-router-dom"
import { saveShippingAddress } from "../slices/cartSlice"

function ShippingScreen() {
  
    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart; 

    const [address, setAddress] = useState(shippingAddress.address || "")
    const [city, setCity] = useState(shippingAddress.city || "")
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
    <FormContainer>
        <h1 className="text-2xl font-bold my-6">Shipping</h1>
        <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address"
                   placeholder="Enter address" value={address} 
                   required onChange={(e) =>setAddress(e.target.value)} 
                   className="w-full p-2 border border-gray-300
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                   />
            </div>
            <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city"
                   placeholder="Enter city" value={city} 
                   required onChange={(e) =>setCity(e.target.value)} 
                   className="w-full p-2 border border-gray-300
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                   />
            </div>
            <div className="space-y-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                <input type="text" id="postalCode"
                   placeholder="Enter Postal code" value={postalCode} 
                   required onChange={(e) =>setPostalCode(e.target.value)} 
                   className="w-full p-2 border border-gray-300
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                   />
            </div>
            <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" id="country"
                   placeholder="Enter country" value={country} 
                   required onChange={(e) =>setCountry(e.target.value)} 
                   className="w-full p-2 border border-gray-300
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                   />
            </div>
            <button type="submit" className="w-full py-2
             bg-primary text-white font-semibold rounded-lg
              hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
                  Continue
            </button>
        </form>
    </FormContainer>
  )
}

export default ShippingScreen
