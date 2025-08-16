import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(
   createRoutesFromElements(
      <Route path='/' element={<App />}>

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
