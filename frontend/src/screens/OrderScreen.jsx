import { useEffect } from "react";
import {useParams, Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
 useDeliverOrderMutation,
 useGetMyOrderQuery,
 useGetOrderDetailsQuery,
 useGetPaypalClientIdQuery,
 usePayOrderMutation
} from '../slices/ordersApiSlice'
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'

function OrderScreen() {
  
   const {id: orderId} = useParams();
   const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId, {skip:!orderId})
   const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()
   const [deliverOrder, {isLoading:loadingDeliver}] = useDeliverOrderMutation()
   const {userInfo} = useSelector((state)=>state.auth)
   const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
   const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPaypalClientIdQuery()

   useEffect(() => {
     if(!errorPayPal && !loadingPayPal && paypal.clientId) {
        const loadingPaypalScript = async () => {
            paypalDispatch({
                type: "resetOptions",
                value: {
                    "client-id": paypal.clientId,
                    currency: "USD"
                },
            });
            paypalDispatch({type: "setLoadingStatus", value: "pending"})
        };
        if(order && !order.isPaid) {
            if(!window.paypal) {
                loadingPaypalScript()
            }
        }
     }
   }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch])

   function onApprove(data, actions) {
     return actions.order.capture().then(async function(details){
        try {
            await payOrder({
                orderId, 
                details: {
                paypalId: details.id,
                status: details.status,
                update_time: details.update_time,
                email_address: details.payer.email_address
        }

            }).unwrap();
            await refetch();
            toast.success("Order is paid successfully");
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
     })
   }

   function onError(error) {
    toast.error(error?.message)
   }

   function createOrder(data, actions) {
     return actions.order.create({
        purchase_units: [{amount: {value: order.totalPrice}}],
     }).then((orderId) => {
        return orderId
     })
   }

   const deliverHandler = async () => {
      await deliverOrder(orderId);
      refetch()
   }
  
    return isLoading ? (
       <Loader/>
    ): error? (
        <Message>{error.data?.message}</Message>
    ): (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-5">
             <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-500">
                     <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                        Shipping
                     </h1>
                     <p className="text-gray-600">
                        <strong>Name: </strong> {order.user.name}
                     </p>
                     <p className="text-gray-600">
                         <strong>Email: </strong> 
                         <a href={`mailto:${order.user.email}`} 
                         className="text-primary hover:text-secondary transition-colors">
                            {order.user.email}
                         </a>
                     </p>
                     <p className="text-gray-600">
                       <strong>Address</strong> {order.shippingAddress.address}, {" "}
                        {order.shippingAddress.city} {order.shippingAddress.postalCode}, {" "}
                         {order.shippingAddress.country}
                     </p>
                      {order.isDelivered ? (
                        <Message variant='success'>
                            Delivered on {order.deliveredAt}
                        </Message>
                      ):(
                        <Message className='danger'>
                            Not Delivered
                        </Message>
                      )}
                </div>
                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Payment Method
    </h2>
    <p className="text-gray-800">
        <strong>Method: </strong> {order.paymentMethod}
    </p>
    {order.isPaid ? (
        <Message variant='success'>
            Paid on {new Date(order.paidAt).toLocaleString()}
        </Message>
    ): (
        <Message variant='danger'>
            Not Paid
        </Message>
    )}
</div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Order Items
                    </h2>
                    {!order?.orderItems || order.orderItems.length === 0 ? (
                        <Message>No order</Message>
                    ): (
                      <div className="space-y-4">
                          {
                            order.orderItems.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start
                                 sm:items-center p-4 rounded-lg hover:bg-gray-500 transition-colors">
                                     <div className="w-16 h-16 mb-4 sm:mb-0">
                                         <img src={item.image} alt={item.name} className="w-full h-full rounded-lg" />
                                     </div>
                                     <div className="sm:ml-6 flex-1">
                                        <Link to={`/product/${item.product}`}
                                         className="text-lg font-medium text-primary
                                          hover:text-secondary transition-colors">{item.name}</Link>
                                     </div>
                                     <div className="text-right mt-4 sm:mt-0">
                                         <p className="text-gray-700">
                                             {item.qty} * ${item.price} = {" "}
                                             <strong>
                                                ${item.qty * item.price}
                                             </strong>
                                         </p>
                                     </div>
                                </div>
                            ))
                          }
                      </div>
                    )}
                </div>
             </div>
             <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <span className="text-gray-600">Items</span>
                           <span className="text-gray-800">${order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-gray-800">${order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-800">${order.taxPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total</span>
                            <span className="text-gray-800">${order.totalPrice}</span>
                        </div>
                     </div>
                     {
                        !order.isPaid && (
                            <div className="mt-6">
                                {loadingPay && <Loader />}
                                {
                                    isPending ? (<Loader />):(
                                        <div className="mt-4">
                                            <PayPalButtons 
                                             createOrder={createOrder}
                                             onApprove={onApprove}
                                             onError={onError}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        )
                     }
                     {
                        loadingDeliver && <Loader />
                     }
                     {
                        userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <div className="mt-6">
                               <button className="w-full bg-primary
                                 text-white py-2 rounded-lg hover:bg-secondary
                                  transition-colors" onClick={deliverHandler}>
                                  Set To Deliver
                               </button>
                            </div>
                        )
                     }
                </div>
             </div>
          </div>
        </>
    )
}

export default OrderScreen;

