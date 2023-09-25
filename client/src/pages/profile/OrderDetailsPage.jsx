import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Card,
  Image,
  ListGroup,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import Spinner from "../../components/Spinner/Spinner";
import moment from "moment";
import {
  FaRegClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCommentDots,
} from "react-icons/fa";
import "../../styles/order-details-page.css";
import Button from "react-bootstrap/Button";
import Contact from "../../shared/Contact";
import { useGlobalContext } from "../../context/AuthContext";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function OrderDetailsPage() {
  const { user } = useGlobalContext();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/v1/orders/${orderId}`)
      .then((response) => {
        const orderData = response.data.order;
        setOrder(orderData);

        const tourId = orderData.orderItems[0].tour;

        axios
          .get(`/api/v1/tours/${tourId}`)
          .then((tourResponse) => {
            const tourData = tourResponse.data.tour;
            setOrder((prevOrder) => ({
              ...prevOrder,
              orderItems: [
                {
                  ...prevOrder.orderItems[0],
                  meetingLocation: tourData.meetingPoint,
                },
              ],
            }));
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching tour data: ", error);
            setError("Failed to fetch tour data");
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching order data: ", error);
        setError("Failed to fetch order data");
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!order) {
    return <Alert variant="danger">Order not found</Alert>;
  }

  const { orderItems, createdAt, status } = order;
  const { name, image, price, description, date, timeSlots } = orderItems[0];

  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${orderItems[0].meetingLocation}`;

  return (
    <Container className="order-details my-5 pt-5">
      <h2>Order Details</h2>
      <Row>
        <Col md={8}>
          <Card className="order-card">
            <Card.Header as="h5">
              Order ID: {order._id.$oid} {"  "}
              <Badge variant={status === "Active" ? "success" : "danger"}>
                {status}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Image
                    src={image}
                    fluid
                    rounded
                    className="order-image mb-4"
                  />
                </Col>
                <Col md={6}>
                  <Card.Title className="order-title mb-4">{name}</Card.Title>
                  <Card.Text className="mb-4">{description}</Card.Text>
                </Col>
              </Row>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FaInfoCircle className="info-icon" /> Price: ${price}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaCalendarAlt className="info-icon" /> Date: {date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaRegClock className="info-icon" /> Time Slot:{" "}
                  {timeSlots[0].start} - {timeSlots[0].end}
                </ListGroup.Item>
                <ListGroup.Item>
                  Order Created At:{" "}
                  {moment(createdAt.$date).format("MMMM Do YYYY, h:mm:ss a")}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer className="text-center">
              {user && user?.role === "vendor" && (
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="chat-btn my-3"
                  onClick={() =>
                    navigate("/chat", {
                      state: { otherUser: order.user, current_User: user },
                    })
                  }
                >
                  <FaCommentDots /> Chat with Tourist
                </Button>
              )}
              {user && user?.role === "tourist" && (
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="chat-btn my-3"
                  onClick={() =>
                    navigate("/chat", {
                      state: { otherUser: order.orderItems[0].vendor },
                    })
                  }
                >
                  <FaCommentDots /> Chat with Tour Vendor
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="order-card location-card">
            <Card.Header as="h5">
              <FaMapMarkerAlt className="info-icon" /> Meeting Location
            </Card.Header>
            <Card.Body>
              <p>{orderItems[0].meetingLocation}</p>
              <div className="map-container">
                <iframe
                  title="Google Maps"
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Contact />
    </Container>
  );
}

export default OrderDetailsPage;
