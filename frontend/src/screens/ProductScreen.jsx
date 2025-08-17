import { useState } from "react";
import { useNavigate, useParams, Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import Message from "../components/Message";
import {IoChevronBackCirlcleSharp} from 'react-icons/io5'
import { FaWindowClose } from "react-icons/fa";



function ProductScreen() {
  
    const [isOpen, setIsOpen] = useState(false)
    
    const {id:productId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const {data:product, isLoading, refetch, error} = useGetProductDetailsQuery(id)
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
    
    
      return (
    <div>ProductScreen</div>
  )
}

export default ProductScreen
