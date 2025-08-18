import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import Message from "../components/Message";



function CartScreen() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {cart} = useSelector((state) => state.cart)
  const {cartItems} = cart
  
  const addToCardHandler = (product, qty) => {
    dispatch(addToCart({...product, qty}))
  }
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  
  const checkoutHandler = () => {
     navigate("/login?redirect=/shipping")
  }
  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8 text-gray-800">Cart</h1>
       {
        cartItems.length === 0 ? (
        
               <Message>
                  Your cart is empty
                 <Link to="/" className="text-blue-500 underline">Go Back</Link>
                </Message>
           
        ):(
            <div className="flex flex-col lg:flex-row gap-8">
               <div className="lg:w-2/3">
                  <div className="space-y-6">
                      {
                        cartItems.map((item) => (
                            <div className="flex flex-col 
                              md:flex-row items-center gap-6 p-6 border
                               border-gray-200 rounded-lg shadow-sm
                                hover:shadow-md transition-shadow duration-300 bg-white" key={item._id}>
                                  <div className="w-24 h-24 flex-shrink-0">
                                     <img src={item.image} alt={item.name} 
                                       className="w-full h-full rounded-lg" />
                                  </div>
                                  <div className="flex-1">
                                     <Link 
                                      className="text-lg font-semibold text-gray-800
                                       hover:text-primary transition-colors duration-300"
                                      to={`/product/${item._id}`}>
                                        {
                                            item.name
                                        }
                                     </Link>
                                     <p className="text-gray-600 mt-1">{item.price}</p>
                                  </div>
                                  <div className="w-24">
                                      <select 
                                      className="w-full p-2 border border-gray-300 
                                        rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                                      onChange={(e) => addToCardHandler(item, Number(e.target.value))}
                                       value={item.qty}>
                                          {[...Array(item.countInStock).keys()].map((x) => (
                                             <option value={x+1} key={x+1}>
                                                {x+1}
                                             </option>
                                          ))}
                                      </select>
                                  </div>
                                  <button
                                    onClick={() => removeFromCartHandler(item._id)} 
                                    type="button" className="p-2 text-red-400
                                      hover:text-red-700 transition-colors duration-300">
                                         <FaTrash size={20} />
                                  </button>
                            </div>
                        ))
                      }
                  </div>
               </div>
            </div>
        )
       }
    </div>
  )
}

export default CartScreen
