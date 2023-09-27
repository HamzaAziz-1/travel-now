import NavLinks from "../Small-sidebar/NavLinks";
import Logo from "../../assets/images/logo1.png";
import Wrapper from "../../assets/wrappers/BigSidebar";
import { useGlobalContext } from "../../context/AuthContext";

const BigSidebar = () => {
  const { isSidebarOpen } = useGlobalContext()

  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
