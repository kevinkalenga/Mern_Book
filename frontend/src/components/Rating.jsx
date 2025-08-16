import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa"

function Rating({value, text}) {
  return (
    <div className="flex items-center space-x-1 text-yellow-400">
        {
            [1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-lg sm:text-xl">
                   {
                     value >= i ? (
                       <FaStar size={15}/>
                     ) : value >= 1 - 0.5 ? (
                        <FaStarHalf size={15} />
                     ): (
                        <FaRegStar size={15} />
                     )
                   }
                </span>
            ))
        }
        {
            text && <span className="text-sm text-gray-600 ml-2">{text}</span>
        }
    </div>
  )
}

export default Rating
