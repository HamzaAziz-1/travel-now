import { Button } from "react-bootstrap";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/images/logo1.png";
import "./header.css";
import { useGlobalContext } from "../../context/AuthContext";
import Wrapper from "../../assets/wrappers/Navbar";
const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/tours",
    display: "Tours",
  },
  {
    path: "/search/spots",
    display: "Discover",
  },
  {
    path: "/contact-us",
    display: "Contact Us",
  },
];

const Header = () => {
  const { user, logoutUser, toggleSidebar } = useGlobalContext();
    const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const toggle = () => {
    toggleSidebar();
  };
  return (
    <Wrapper>
         <div className='nav-center'>
        <button type='button' className='toggle-btn' onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Link to={"/home"} className="logo">
            <img src={logo} alt="React Bootstrap logo" />
          </Link>
        </div>
        <div className='btn-container'>
          <button
            type='button'
            className='btn'
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
            <button
              type='button'
              className='dropdown-btn'
              onClick={() => {logoutUser()
              navigate('/login')}
            }
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
    // <Navbar
    //   bg="dark"
    //   variant="dark"
    //   expand="lg"
    //   fixed="top"
    //   className="sticky__header"
    // >
    //   <Container>
    //     <Navbar.Brand>
    //       <Link to={"/home"} className="logo">
    //         <img src={logo} alt="React Bootstrap logo" />
    //       </Link>
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="navbarScroll" />
    //     <Navbar.Collapse id="navbarScroll">
    //       <Nav className="ms-auto me-3" navbarScroll>
    //         {nav__links.map((link) => (
    //           <Link
    //             key={link.path}
    //             to={link.path}
    //             className={`nav-link ${
    //               window.location.pathname === link.path ? "active__link" : ""
    //             }`}
    //           >
    //             {link.display}
    //           </Link>
    //         ))}
          
    //         {user && (
    //           <Link to={`/${user?.role}/dashboard`} className="nav-link">
    //             Dashboard
    //           </Link>
    //         )}


    //       {user && (
    //         <Button
    //         className="btn btn-light"
    //         onClick={() => {
    //             logoutUser();
    //             navigate("/login");
    //           }}
    //         >
    //           Logout
    //         </Button>
    //       )}
        
    //         {!user && (
    //           <Link to="/login" className="nav-link">
    //             Login
    //           </Link>
    //         )}
    //         {!user && (
    //           <Link to="/register" className="nav-link">
    //             Register
    //           </Link>
    //         )}
    //             </Nav>
         
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
    // </header>
  );
};

export default Header;
