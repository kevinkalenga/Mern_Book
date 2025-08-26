import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";

function OrderListScreen() {
  
  const {data:orders, isLoading, error} = useGetOrdersQuery();
  console.log(orders)
  
  return (
    <div className="container mx-auto p-5">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
         {
           isLoading ? (<Loader />): error?(
              <Message variant="danger">
                  {error?.data?.message || error.error}
              </Message>
           ):(
            <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              USER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              DATE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              TOTAL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              PAID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              DELIVERED
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                              ACTIONS
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                      orders.map((order) => (
                         <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.user && order.user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.createdAt.substring(0,10)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  $ {order.totalPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  $ {order.isPaid ? (order.paidAt.substring(0, 10)) : (
                                     <FaTimes className="text-red-500" />
                                  )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {
                                  order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (<FaTimes className="text-red-500" />)
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link to={`/order/${order._id}`} className="text-primary hover:text-secondary underline">
                                  Details
                                </Link>
                            </td>
                         </tr>
                      ))
                     }
                  </tbody>
               </table>
            </div>
           )
         }
    </div>
  )
}

export default OrderListScreen;
