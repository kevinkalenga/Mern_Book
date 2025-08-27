import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import ProductScreen from './screens/ProductScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import CartScreen from './screens/CartScreen.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import ShippingScreen from './screens/ShippingScreen.jsx'
import PaymentScreen from './screens/PaymentScreen.jsx'
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx'
import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import OrderScreen from './screens/OrderScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import OrderListScreen from './screens/admin/OrderListScreen.jsx'
import UserListScreen from './screens/admin/UserListScreen.jsx'
import UserEditScreen from "./screens/admin/UserEditScreen.jsx";

const router = createBrowserRouter(
   createRoutesFromElements(
        <Route path='/' element={<App />}>
             <Route index element={<HomeScreen />} />
              <Route path='/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/search/:keyword' element={<HomeScreen />} />
              <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/register' element={<RegisterScreen />} />
              <Route path='/cart' element={<CartScreen />} />

              <Route path='' element={<PrivateRoute />}>
                  <Route path='/shipping' element={<ShippingScreen />} />
                  <Route path='/payment' element={<PaymentScreen />} />
                  <Route path='/placeorder' element={<PlaceOrderScreen />} />
                  <Route path='/order/:id' element={<OrderScreen />} />
                  <Route path='/profile' element={<ProfileScreen />} />
              </Route>
              <Route path='' element={<AdminRoute />}>
                  <Route path='/admin/orderlist' element={<OrderListScreen />} />
                  <Route path='/admin/userlist' element={<UserListScreen />} />
                  <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              </Route>
         </Route>

   )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>,
)
