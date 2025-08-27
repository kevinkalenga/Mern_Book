
import { Link } from "react-router-dom";

function Pagination({ page, pages, keyword = "", isAdmin = false }) {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 gap-2">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={
            isAdmin
              ? `/admin/productlist/${x + 1}`
              : keyword
              ? `/search/${keyword}/page/${x + 1}`
              : `/page/${x + 1}`
          }
          className={`px-3 py-1 border rounded ${
            x + 1 === page ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
}

export default Pagination;


