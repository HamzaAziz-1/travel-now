import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaUserFriends,
  FaClipboardList,
  FaEye,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const VendorDashboard = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();
  const sidebarRef = useRef(null);
  const rightContentRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const links = [
    {
      text: "Create Tour",
      path: "/vendor/dashboard/create-tour",
      icon: <FaUserFriends />,
    },
    {
      text: "View Tours",
      path: "/vendor/dashboard/view-tours",
      icon: <FaEye />,
    },
    {
      text: "View Profile",
      path: "/vendor/dashboard",
      icon: <FaUser />,
    },
    {
      text: "View Orders",
      path: "/vendor/dashboard/orders",
      icon: <FaClipboardList />,
    },
  ];

  const handleLinkClick = (path) => {
    setActiveLink(path);
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    const updateSidebarHeight = () => {
      const contentHeight = rightContentRef.current.scrollHeight;
      const windowHeight = window.innerHeight;
      sidebarRef.current.style.height =
        contentHeight < windowHeight ? "105vh" : "auto";
    };

    updateSidebarHeight(); // Initial call to set the sidebar height
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", updateSidebarHeight);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", updateSidebarHeight);
    };
  }, []);

  return (
    <div className="dashboard mt-5 pt-2">
      <Container fluid>
        <Row>
          {isSidebarOpen || !isSmallScreen ? (
            <Col md={2} className="dashboard__sidebar" ref={sidebarRef}>
              <ul className="sidebar__menu">
                {links.map((link, index) => (
                  <li
                    key={index}
                    className={`sidebar__menu-item ${
                      location.pathname === link.path ? "active" : ""
                    }`}
                  >
                    <Link
                      to={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      className="sidebar__menu-link"
                    >
                      <span className="sidebar__menu-icon">{link.icon}</span>
                      <span className="sidebar__menu-text">{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ) : null}

          <Col className="" md={isSidebarOpen || !isSmallScreen ? 10 : 12}>
            {isSmallScreen ? (
              <Button onClick={toggleSidebar} className="toggle-button">
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </Button>
            ) : null}
            <div ref={rightContentRef} style={{ minHeight: "100vh" }}>
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VendorDashboard;
