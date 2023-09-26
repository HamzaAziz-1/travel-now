import NavLinks from "../Small-sidebar/NavLinks";
import Logo from "../../assets/images/logo1.png";
import Wrapper from "../../assets/wrappers/BigSidebar";
import { useGlobalContext } from "../../context/AuthContext";
import { FaAlignLeft} from "react-icons/fa";

const BigSidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useGlobalContext();
    const toggle =()=> {
    toggleSidebar();
   }


  return (
    <Wrapper>
        <button type="button" className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
      <div
        className={
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
