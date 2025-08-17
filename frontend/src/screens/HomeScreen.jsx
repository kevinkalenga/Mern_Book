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

  const [keyword, setKeyword] = useState(urlKeyword || "");
  const pageNumber = pageParam || 1;

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: urlKeyword || "",
    pageNumber,
  });
  console.log(data)

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
            setKeyword={setKeyword} // <-- il faut passer setKeyword
            onSearch={handleSearch}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 md:gap-8 gap-4 justify-items-center">
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
