/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaEye, FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import "../../styles/admin-dashboard.css";
const TouristDashboard = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();
  const sidebarRef = React.createRef();

  const links = [
    {
      text: "View Profile",
      path: "/tourist/dashboard",
      icon: <FaUser />,
    },
    {
      text: "View Orders",
      path: "/tourist/dashboard/orders",
      icon: <FaEye />,
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

export default TouristDashboard;
