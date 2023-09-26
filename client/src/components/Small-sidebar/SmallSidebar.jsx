import Wrapper from "../../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import Logo from "../../assets/images/logo1.png";

import NavLinks from "./NavLinks";
import { useGlobalContext } from "../../context/AuthContext";

const SmallSidebar = () => {
  const { isSidebarOpen,toggleSidebar } = useGlobalContext()

  const toggle = () => {
    toggleSidebar();
  };
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button className="close-btn" onClick={toggle}>
            <FaTimes />
          </button>
          <header>
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
