import { Outlet } from "react-router-dom";
// import { BigSidebar, Navbar, SmallSidebar } from "../../components";

import BigSidebar from "../Big-sidebar/BigSidebar";
import Header from "../Header/Header";
import SmallSidebar from "../Small-sidebar/SmallSidebar";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { ToastContainer } from "react-toastify";

const SharedLayout = () => {
  return (
    <Wrapper>
      <ToastContainer position="top-center" />
      <main className="dashboard mt-5 pt-5">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Header />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
export default SharedLayout;
