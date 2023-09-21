import React from "react";
import "./contact.css";
import axios from "axios";
import { useState } from "react";
import { Container, Row, Col, InputGroup } from "reactstrap";
import { Form, Button } from "react-bootstrap";
import { FaUserAlt, FaPhoneAlt, FaTag, FaCommentDots } from "react-icons/fa";
import { useGlobalContext } from "../context/AuthContext";

function Contact() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
    const [message, setMessage] = useState("");
    const { user } = useGlobalContext();
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://send-email-api.netlify.app/.netlify/functions/app/contact",
        {
          fullName,
          phone,
          orderId,
          message,
        }
      );
      if (response.status === 200) {
        alert("Message sent!");
        // clear form
        setFullName("");
        setPhone("");
        setOrderId("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="contactus">
      <Container>
        <Row>
          <Col lg="6">
            <div className="contactus__content">
              <h2>Experiencing trouble with your order?</h2>
              <Form className="contactus__form" onSubmit={handleSubmit}>
                <InputGroup>
                  <FaUserAlt className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={user?.name}
                    disabled
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaPhoneAlt className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    disabled
                    value={user?.phoneNo}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaTag className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaCommentDots className="input-icon" />
                  <Form.Control
                    as="textarea"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </InputGroup>
                <Button
                  className="contactus__btn"
                  variant="warning"
                  type="submit"
                >
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>
          <Col lg="6">
            <div className="contactus__content text-container">
              <h3>Need Assistance?</h3>
              <p>
                We're here to help and answer any question you might have. We
                look forward to hearing from you 🙂
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contact;
