import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/AuthContext";
import { Container, Row, Col, Nav } from "react-bootstrap";
import "../../styles/admindashboard.css";
import ViewTours from "../ShowTours";
import { UpdateProfile, ManageOrders, ManageUsers } from "../index";
 

const AdminDashboard = () => {
  const [page, setPage] = useState("ViewTours");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGlobalContext();
  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (user.role !== "admin") {
        navigate("/home");
      }
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="spinner-grow text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  const renderPage = () => {
    switch (page) {
      case "ManageUsers":
        return <ManageUsers />;
      case "ViewTours":
        return <ViewTours />;
      case "UpdateProfile":
        return <UpdateProfile />;
      case "ManageOrders":
        return <ManageOrders />;
      default:
        return <ViewTours />;
    }
  };

  return (
    <div className="dashboard mt-5">
      <Container fluid>
        <Row>
          <Col md={2} className="dashboard__sidebar">
            <Nav className="flex-column">
              <Nav.Link
                onClick={() => setPage("ManageUsers")}
                className={`dashboard__sidebar-link ${
                  page === "ManageUsers"
                    ? "dashboard__sidebar-link--active"
                    : ""
                }`}
              >
                Manage Users
              </Nav.Link>
              <Nav.Link
                onClick={() => setPage("ViewTours")}
                className={`dashboard__sidebar-link ${
                  page === "ViewTours" ? "dashboard__sidebar-link--active" : ""
                }`}
              >
                View Tours
              </Nav.Link>
              <Nav.Link
                onClick={() => setPage("UpdateProfile")}
                className={`dashboard__sidebar-link ${
                  page === "UpdateProfile"
                    ? "dashboard__sidebar-link--active"
                    : ""
                }`}
              >
                View Profile
              </Nav.Link>
              <Nav.Link
                onClick={() => setPage("ManageOrders")}
                className={`dashboard__sidebar-link ${
                  page === "ManageOrders"
                    ? "dashboard__sidebar-link--active"
                    : ""
                }`}
              >
                Manage Orders
              </Nav.Link>
            </Nav>
          </Col>

          <Col className="" md={10}>
            {renderPage()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
