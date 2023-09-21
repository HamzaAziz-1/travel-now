import "./newsletter.css";
import axios from "axios";
import { useState } from "react";
import {
  Container, Row, Col, InputGroup,
} from "reactstrap";
import {Form, Button} from 'react-bootstrap'
import {
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCommentDots,
} from "react-icons/fa";


const ContactUs = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://send-email-api.netlify.app/.netlify/functions/app/contact",
        {
          firstName,
          lastName,
          email,
          phone,
          message,
        }
      );
      if (response.status === 200) {
        alert("Message sent!");
        // clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
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
              <h2>Contact Us</h2>

              <Form className="contactus__form" onSubmit={handleSubmit}>
                <InputGroup>
                  <FaUserAlt className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaUserAlt className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaEnvelope className="input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <FaPhoneAlt className="input-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Phone No"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <div className="text-center">
                  <Button className="contactus__btn" variant="warning" type="submit">
                    Send Message
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col lg="6">
            <div className="contactus__content text-container">
              <h3>Need Assistance?</h3>
              <p>
                We are here to help and answer any question you might have. We
                look forward to hearing from you 🙂
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactUs;
