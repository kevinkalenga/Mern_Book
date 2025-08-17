import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";

function HomeScreen() {
  const { pageNumber: pageParam, keyword: urlKeyword } = useParams();
  const navigate = useNavigate();

  // State pour la recherche
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const pageNumber = pageParam || 1;

  // Hook RTK Query pour récupérer les produits
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: urlKeyword || "",
    pageNumber,
  });

  // Fonction de recherche
  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}/page/1`);
    } else {
      navigate(`/page/1`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="px-4 py-6">
          <SearchBox
            keyword={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={handleSearch}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {data?.products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={data?.page} pages={data?.pages} keyword={urlKeyword || ""} />
        </div>
      )}
    </>
  );
}

export default HomeScreen;

