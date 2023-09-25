import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Container, Row, Col,Form } from "react-bootstrap";
import TourCard from "../../shared/TourCard";
import '../../styles/update-profile.css'
import avatar from "../../assets/images/user.png";

const TourVendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const { data } = await axios.get(`/api/v1/users/${id}`);
        setVendor(data.user);
      } catch (error) {
        console.error("Failed to fetch user data: ", error);
      }
    };

  const fetchVendorTours = async () => {
    try {
      const { data } = await axios.get(`/api/v1/tours/vendor/${id}`);
      const verifiedTours = data.tours.filter((tour) => tour.verified);
      setTours(verifiedTours);
    } catch (error) {
      console.error("Failed to fetch tours data: ", error);
    }
  };


    fetchVendorDetails();
    fetchVendorTours();
  }, [id]);

  if (!vendor) {
      return (
        <Container className="mt-5 pt-5">
          <Row className="mt-5 justify-content-center">
            <Col xs={12} className="text-center">
              <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Col>
          </Row>
        </Container>
      );
  }

    return (
      <>
        <Container className="mt-5 pt-5 d-flex flex-column align-items-center text-center">
          {vendor.role === "vendor" && (
            <h2 className="header">Vendor Profile</h2>
          )}
          {vendor.role === "tourist" && (
            <h2 className="header">Tourist Profile</h2>
          )}
          <div className="profile-form">
            <Form.Group
              controlId="formBasicImage"
              className="text-center image-container"
            >
              <Form.Label>
                <strong>Profile Picture</strong>
              </Form.Label>
              <div>
                <img
                 
                  src={avatar}
                  alt="user profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = avatar;
                  }}
                  // eslint-disable-next-line react/no-unknown-property
                  roundedCircle
                  className="profile-image"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formBasicName" className="field-group">
              <Form.Label>
                <strong>Name</strong>
              </Form.Label>
              <Row className="field-row">
                <Col>{vendor.name}</Col>
              </Row>
            </Form.Group>

            <Form.Group className="field-group">
              <Form.Label>
                <strong>Phone Number</strong>
              </Form.Label>
              <Row>
                <Col>{vendor.phoneNo}</Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formBasicCountry" className="field-group">
              <Form.Label>
                <strong>Country</strong>
              </Form.Label>
              <Row>
                <Col>{vendor.country}</Col>
              </Row>
            </Form.Group>
          </div>
        </Container>
        <Container>
          {vendor.role === "vendor" && (
            <div>
              <h2 className="header text-center mt-5">Tours Created</h2>

              {tours.length > 0 ? (
                <Row>
                  {tours.map((tour) => (
                    <Col md={3} key={tour._id}>
                      <TourCard tour={tour} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No tours found for this vendor.</p>
              )}
            </div>
          )}
        </Container>
      </>
    );
};

export default TourVendorDetails;
