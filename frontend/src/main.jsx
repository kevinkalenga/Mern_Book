import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import ProductScreen from './screens/ProductScreen.jsx'

const router = createBrowserRouter(
   createRoutesFromElements(
        <Route path='/' element={<App />}>
             <Route index element={<HomeScreen />} />
              <Route path='/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/search/:keyword' element={<HomeScreen />} />
              <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
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
