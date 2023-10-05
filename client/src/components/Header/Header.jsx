import { NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/images/logo1.png";
import "./header.css";
import { useGlobalContext } from "../../context/AuthContext";
// import { admin, tourist, vendor } from "../../utils/userLinks";

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
  const { user, logoutUser } = useGlobalContext();
  const navigate = useNavigate();
  // Define user-specific paths based on the user's role
  // const userPaths =
    // user?.role === "admin" ? admin : user?.role === "vendor" ? vendor : tourist;

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="sticky__header"
    >
      <Container>
        <Navbar.Brand>
          <Link to={"/home"} className="logo">
            <img src={logo} alt="React Bootstrap logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto me-3" navbarScroll>
            {nav__links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  window.location.pathname === link.path ? "active__link" : ""
                }`}
              >
                {link.display}
              </Link>
            ))}

            {user ? (
              <NavDropdown
                title={
                  <>
                    <Image src={user?.image} className="logo" roundedCircle />
                    <span className="user-name">{user?.name}</span>
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  style={{}}
                  href={`/${user?.role}/dashboard`}
                  className="nav-dropdown"
                >
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="nav-dropdown"
                  onClick={() => {
                    logoutUser();
                    navigate("/");
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
