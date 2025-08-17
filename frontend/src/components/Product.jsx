import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FaEye } from "react-icons/fa";
/*
flex flex-col w-full max-w-[250px] sm:max-w-[220px] md:max-w-[200px] lg:max-w-[180px] 
                    overflow-hidden rounded-2xl border border-gray-300 shadow-lg 
                    transition-transform hover:scale-105 hover:shadow-xl

*/ 

function Product({ product }) {
  return (
    <div className="bg-white md:w-[330px] shadow-md hover:shadow-lg 
      transition-transform overflow-hidden rounded-lg w-full sm:w-[300px] hover:scale-105">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full aspect-square object-cover rounded-t-2xl"
        />
      </Link>

      <div className="p-3 space-y-2">
        <Link 
          to={`/product/${product._id}`} 
          className="block text-sm md:text-base font-semibold text-gray-900 hover:text-primary 
                     overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-sm md:text-base font-bold text-gray-800">
            ${product.price}
          </span>
          <div className="flex items-center space-x-1">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            <span className="ml-1 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold">
              {product.rating}
            </span>
          </div>
        </div>

        <Link 
          to={`/product/${product._id}`} 
          className="flex items-center justify-center gap-2 py-2 w-full rounded-lg 
                     bg-white border-2 border-primary font-semibold text-sm transition 
                     hover:bg-primary hover:text-white"
        >
          <FaEye size={18} /> Preview
        </Link>
      </div>
    </div>
  );
}

export default Product;
