import Header from "../Header/Header";
import Routers from "../../router/Routers";
import Footer from "../Footer/Footer";
 import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 import { useLocation } from "react-router-dom";
import {excludedRoutes,excludedHeaderRoutes} from "../../utils/routeConfig";
import { useGlobalContext } from "../../context/AuthContext";
 import Spinner from "../Spinner/Spinner";
const Layout = () => {
  const location = useLocation();
const { isLoading } = useGlobalContext();
if (isLoading) {
  return <Spinner />;
}
  // Check if the current location path is in the excludedRoutes array
  const shouldExcludeFooter = excludedRoutes.includes(location.pathname);
  const shouldExcludeHeader = excludedHeaderRoutes.includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" />
      {!shouldExcludeHeader && <Header />}
      <Routers />
      {!shouldExcludeFooter && <Footer />}
    </>
  );
};

export default Layout;
