import { Button, NavDropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/images/logo1.png";
import "./header.css";
import { useGlobalContext } from "../../context/AuthContext";

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

  const userNameParts = user?.name?.split(" ");
  const displayName = userNameParts?.slice(0, 2).join(" ");

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
                    <Image src={user.image} className="logo" roundedCircle />
                    <span className="user-name">{displayName}</span>
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href={`/${user?.role}/dashboard`}>
                  Link 1
                </NavDropdown.Item>
                <NavDropdown.Item href={`/${user?.role}/link2`}>
                  Link 2
                </NavDropdown.Item>
                <NavDropdown.Item href={`/${user?.role}/link3`}>
                  Link 3
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    logoutUser();
                    navigate("/login");
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
