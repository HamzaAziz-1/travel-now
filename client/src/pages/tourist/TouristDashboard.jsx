import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/AuthContext";
import { Container, Row, Col, Nav } from "react-bootstrap";
import "../../styles/admindashboard.css";

import UpdateProfile from "../profile/UpdateProfile";
import OrdersPage from "../profile/OrdersPage";
const TouristDashboard = () => {
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState("UpdateProfile");

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="mt-5 pt-5">
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
      case "UpdateProfile":
        return <UpdateProfile />;
      case "ViewOrders":
        return <OrdersPage />;
      default:
        return <UpdateProfile />;
    }
  };

  return (
    <div className="dashboard mt-5">
      <Container fluid>
        <Row>
          <Col md={2} className="dashboard__sidebar">
            <Nav className="flex-column">
              <Nav.Link
                onClick={() => setPage("UpdateProfile")}
                className={`dashboard__sidebar-link ${
                  page === "UpdateProfile"
                    ? "dashboard__sidebar-link--active"
                    : ""
                }`}
              >
                Update Profile
              </Nav.Link>
              <Nav.Link
                onClick={() => setPage("ViewOrders")}
                className={`dashboard__sidebar-link ${
                  page === "ViewOrders" ? "dashboard__sidebar-link--active" : ""
                }`}
              >
                View Orders
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

export default TouristDashboard;