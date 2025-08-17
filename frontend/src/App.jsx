import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";

function App() {
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
