import { useState } from "react";
import { useNavigate, useParams, Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import Message from "../components/Message";
import {IoChevronBackCircleSharp} from 'react-icons/io5'
import { FaWindowClose } from "react-icons/fa";
import { addToCart } from "../slices/cartSlice";



function ProductScreen() {
  
    const [isOpen, setIsOpen] = useState(false)
    
    const {id:productId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const {data:product, isLoading, refetch, error} = useGetProductDetailsQuery(productId)
    const {userInfo} = useSelector((state) => state.auth)

     const [createReview, { isLoading: loadingProductReview }] =
      useCreateReviewMutation();
  
 const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    //   setRating(0);
    //   setComment('')
      setIsOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
    
  const addToCartHandler = () => {
     dispatch(addToCart({...product, qty}))
     navigate("/cart")
  }
    
    return (
    
     <div className="max-w-6xl mx-auto p-6">
        <Link to="/">
           <IoChevronBackCircleSharp size={35} className="text-primary hover:text-secondary"  />
        </Link>
        {
            isLoading? (
                <Loader />
            ):error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ):(
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                   <div className="lg:col-span-1">
                      <img src={product.image} alt={product.image} className="w-full rounded-lg shadow-lg" />
                   </div>
                   <div className="lg:col-span-1">
                          <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-300 pb-4">
                            {product.name}
                          </h1>
                          <div className="mt-4 border-b border-gray-300 pb-4">
                            <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                            <p className="mt-4 text-gray-700">{product.description}</p>
                         </div>
                   </div>
                   
                   
                   <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="space-y-4">
                               <p className="flex justify-between text-lg">
                                 <span className="text-gray-600">Price:</span>
                                 <span className="font-semibold">${product.price}</span>
                               </p>
                               <p className="flex justify-between text-lg">
                                  <span className="text-gray-600">Status</span>
                                  <span className={`${product.countInStock > 0 ? "text-green-600" : "text-red-600"}`}>
                                      {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                                  </span>
                               </p>
                               {
                                product.countInStock > 0 && (
                                    <div className="mt-4">
                                         <label htmlFor="qty" className="block text-gray-700 font-semibold mb-2">Quantity</label>
                                         <select name="" id="qty" className="w-full border rounded focus:outline-none focus:ring-2 p-2 focus:ring-blue-500" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                             {
                                                [...Array(product.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {" "}
                                                        {x + 1}
                                                    </option>
                                                ))
                                             }
                                         </select>
                                    </div> 

                                )
                               }
                               <button className={`w-full mt-6 py-3 rounded-lg font-semibold ${
                                 product.countInStock === 0 ? "bg-gray-300 cursor-not-allowed" : 
                                  "bg-primary hover:bg-secondary text-white"
                               }`} disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                   Add To Cart
                               </button>
                            </div>
                        </div>
                        <div className="mt-8">
                           <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                           {
                            product.reviews.length === 0 ? (<Message>No Reviews</Message>) : (
                                <div className="mt-6 space-y-5">
                                    {
                                        product.reviews.map((review) => (
                                            <div className="bg-white p-6 rounded-lg shadow-sm" key={review._id}>
                                               <div className="flex items-center space-x-1">
                                                  <strong className="text-gray-900">
                                                     {review.name}
                                                  </strong>
                                                    <Rating value={Math.round(Number(review.rating) * 10) / 10} />


                                                  <p className="text-sm text-gray-500">
                                                    {review.createdAt.substring(0,10)}
                                                    
                                                  </p>
                                                  <p className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleTimeString()} {/* Affiche date + heure */}
                                                 </p>
                                               </div>
                                               <p className="mt-2 text-gray-700">{review.comment}</p>
                                               
                                            </div>
                                        ))
                                    }

                                </div>
                            )
                           }
                           {
                            userInfo && !isOpen && (
                                <button className="w-48 py-2 bg-primary text-white 
                                  rounded-lg font-semibold hover:bg-secondary mt-6" onClick={()=>setIsOpen(true)}>
                                      Add a Review
                                  </button>
                            )
                           }
                        </div>
                   </div>
               </div>

               {
                isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                       <div className="fixed inset-0 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>

                       <div className="bg-white p-6 rounded-lg shadow-sm w-96 relative z-50">
                           <button onClick={() => setIsOpen(false)}>
                               <FaWindowClose 
                                 size={25}
                                 className="text-primary hover:text-primary"
                               />
                           </button>
                           <h2 className="text-xl font-bold text-gray-900 my-4">Add a Review</h2>
                           {
                            loadingProductReview && <Loader />
                           }

                           <form onSubmit={submitHandler} className="space-y-4">
                               <div>
                                  <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                                  <select onChange={(e) => setRating(e.target.value)}
                                     required value={rating} 
                                     className="w-full border rounded-lg focus:outline-none
                                      focus:ring-2 focus:ring-primary">
                                         <option value="">Select...</option>
                                         <option value="1">1 - Poor</option>
                                         <option value="2">2 - Fair</option>
                                         <option value="3">3 - Good</option>
                                         <option value="4">4 - Very Good</option>
                                         <option value="5">5 - Excellent</option>
                                  </select>
                               </div>
                               <div>
                                <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                                <textarea className="w-full p-2 border rounded-lg focus:outline-none 
                                focus:ring-2 focus:ring-primary" rows="4" required value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                               </div>
                               <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary" disabled={loadingProductReview}>
                                   Submit Review
                               </button>
                           </form>
                       </div>
                    </div>
                )
               }
            </>
            )
        }
     </div>
  )
}

export default ProductScreen
