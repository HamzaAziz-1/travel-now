/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaUserFriends, FaClipboardList, FaEye, FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const CustomSidebar = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();
  const sidebarRef = React.createRef();

  const links = [
    {
      text: "Manage Users",
      path: "/admin/dashboard/manage-users",
      icon: <FaUserFriends />,
    },
    {
      text: "View Tours",
      path: "/admin/dashboard/view-tours",
      icon: <FaEye />,
    },
    {
      text: "View Profile",
      path: "/admin/dashboard/update-profile",
      icon: <FaUser />,
    },
    {
      text: "Manage Orders",
      path: "/admin/dashboard/view-orders",
      icon: <FaClipboardList />,
    },
  ];


  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="dashboard mt-5">
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

export default CustomSidebar;
