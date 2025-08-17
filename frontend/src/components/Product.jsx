import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FaEye } from "react-icons/fa";

 function Product({product}) {
  return (
    <div className="relative flex w-full max-w-xs flex-col 
     overflow-hidden rounded-2xl border
      border-gray-300 shadow-lg transition-transform
       hover:scale-102 hover:shadow-xl">
         <Link to={`/product/${product._id}`}>
           <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
         </Link>
         <div className="p-4 space-y-3">
            <Link to={`/product/${product._id}`} 
            className="block text-lg font-semibold
             text-gray-900 hover:text-primary underline
              overflow-hidden text-ellipsis whitespace-nowrap">
                  {
                    product.name
                  }
            </Link>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">
                   ${product.price}
                </span>
                <div className="flex items-center space-x-1">
                    <Rating 
                       value={product.rating} 
                       text={`${product.numReviews} reviews`}
                    />
                    <span className="ml-2 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold">
                       {product.rating}
                    </span>
                </div>
            </div>
            <Link to={`/product/${product._id}`} 
               className="flex items-center 
               justify-center gap-2 py-2 w-full rounded-lg bg-white border-2
                border-primary font-semibold transition hover:bg-primary hover:text-white">
                    <FaEye size={20}  /> Preview
            </Link>
         </div>
    </div>
  )
}

export default Product
