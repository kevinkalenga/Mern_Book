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
              </Route>
         </Route>

   )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
