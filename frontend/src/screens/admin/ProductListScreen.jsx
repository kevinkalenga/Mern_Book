import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../slices/productApiSlice";
import { toast } from "react-toastify";

function ProductListScreen() {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: pageNumber || 1,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete ?")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

    const createProductHandler = async () => {
  if (window.confirm("Are you sure you want to create a new product ?")) {
    try {
      const createdProduct = await createProduct({}).unwrap(); 
      toast.success("Product created successfully");
      // Rediriger vers l'édition du nouveau produit
      window.location.href = `/admin/product/${createdProduct._id}/edit`;
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }
};


  return (
    <div className=" container mx-auto p-5">
      <div className=" flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="bg-primary text-white px-4 py-4 rounded-md hover:bg-secondary flex items-center"
          onClick={createProductHandler}
        >
          <FaPlus className=" mr-2" /> Add a Product
        </button>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                    PRICE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $ {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="text-primary hover:text-secondary"
                        >
                          <FaEdit size={20} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination pages={data?.pages} page={data?.page} isAdmin={true} />
          </div>


        </>
      )}
    </div>
  );
}

export default ProductListScreen;
