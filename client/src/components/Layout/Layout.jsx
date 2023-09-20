import Header from "../Header/Header";
import Routers from "../../router/Routers";
import Footer from "../Footer/Footer";
 import { ToastContainer } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
const Layout = () => {
  return (
    <>
      <ToastContainer position="top-center"/>
      <Header />
      <Routers />
      <Footer />
    </>
  );
};

export default Layout;
