import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";

function App() {
   const dispatch = useDispatch()
  useEffect(() => {
    const checkTokenExpiration = () => {
       try {
        const expirationTime = localStorage.getItem("expirationTime")
        if(!expirationTime) return 

        const isExpired = Date.now() > Number(expirationTime)

        if(isExpired) {
          dispatch(logout());
        }
       } catch (error) {
         console.log("Error checking token expiration", error)
       }
    }
    checkTokenExpiration();
  }, [dispatch])
  
  
  return (
    <>
    <ToastContainer />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
   )
}

export default App;
