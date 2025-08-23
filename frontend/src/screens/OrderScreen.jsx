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
   const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery()
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
            await payOrder({orderId, details});
            refetch();
            toast.success("Order is paid successfully");
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
     })
   }

   function onError(error) {
    toast.error(error.message)
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
  
    return (
    <div>OrderScreen</div>
  )
}

export default OrderScreen;
