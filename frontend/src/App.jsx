import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"

function App() {
   return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
   )
}

export default App;
