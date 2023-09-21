import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useState , useEffect} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/thank-you.css";

const ThankYou = () => {
  // const [order, setOrder] = useState([]);
  // const [paymentIntentId, setPaymentInTentId] = useState("");
  const location = useLocation();
    const navigate = useNavigate();
   useEffect(() => {

     const { order, paymentIntentId } = location.state;  
     console.log(order);
     console.log(paymentIntentId);
     
     const updateOrder = async () => {
       
       const id = order?._id;
       console.log(paymentIntentId);
       const res = axios.patch(`/api/v1/orders/${id}`, {
        paymentIntentId
       }
       );
       const result = await res.data;
       console.log(result)
     }

     updateOrder();
   }, [location.state]);
  
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i class="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold">Thank You</h1>
              <h3 className="mb-4">your tour is booked.</h3>

              <Button className="btn primary__btn w-25">
                <Link to="/home">Back to Home</Link>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;
