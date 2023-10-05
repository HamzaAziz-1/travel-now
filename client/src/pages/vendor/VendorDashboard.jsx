/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaUserFriends, FaClipboardList, FaEye, FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const VendorDashboard = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();
  const sidebarRef = useRef(null);
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
  useEffect(() => {
    const updateSidebarHeight = () => {
      const contentHeight = sidebarRef.current.scrollHeight;
      const windowHeight = window.innerHeight;

      // Set the sidebar height based on the content height and window height
      if (contentHeight < windowHeight) {
        sidebarRef.current.style.height = "100";
      } else {
        sidebarRef.current.style.height = "auto";
      }
    };

    // Call the function on component mount and window resize
    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateSidebarHeight);
    };
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="dashboard mt-5 pt-2">
      <Container fluid>
        <Row>
          <Col
            md={2}
            className="dashboard__sidebar"
            ref={sidebarRef}
            style={{ overflow: "hidden" }}
            bg="dark"
            variant="dark"
          >
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

          <Col className="" md={10}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};


export default VendorDashboard;
