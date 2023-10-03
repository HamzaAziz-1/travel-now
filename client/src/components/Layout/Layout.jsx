import Header from "../Header/Header";
import Routers from "../../router/Routers";
import Footer from "../Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteConfig from "../../utils/RouteConfig";
import { useGlobalContext } from "../../context/AuthContext";
import Spinner from "../Spinner/Spinner";

const Layout = () => {
  const { shouldExcludeFooter, shouldExcludeHeader } = RouteConfig();

  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return <Spinner />;
  }

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
