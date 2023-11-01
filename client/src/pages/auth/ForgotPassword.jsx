import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form } from "react-bootstrap";
import "../../styles/login.css";
import loginImg from "../../assets/images/login.png";
import userIcon from "../../assets/images/user.png";
import axios from 'axios';
import useLocalState from '../../utils/localState';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const {
    alert,
    loading,
    setLoading,
    hideAlert,
  } = useLocalState();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    hideAlert();
    if (!email) {
      toast.error("Please provide an email");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email,
      });
      toast.success(data?.msg);
    } catch (error) {
      toast.error(error?.response?.data?.msg? error?.response?.data?.msg:"Something went wrong, please try again");
    }
    setLoading(false);
  };
  return (
    <section>
      <Container className='mt-5 pt-5'>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2 className='mt-3'>Forgot Password</h2>
                {alert.show && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                  </div>
                )}
                <Form
                  className={loading ? "form form-loading" : "form"}
                  onSubmit={handleSubmit}
                >
                  <Form.Group controlId="email" className='mt-5 pt-2 mb-3'>
                    <Form.Control
                      type="email"
                      placeholder="Enter your Email"
                      required
                      name="email"
                      value={email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button
                      className="text-center mt-2"
                      type="submit"
                      variant="dark"
                      disabled={loading}
                    >
                      {loading ? "Please Wait..." : "Submit"}
                    </Button>
                  </div>
                  <p>
                    Already have an account?
                    <Link to="/login" className="login-link">
                      Log In
                    </Link>
                  </p>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ForgotPassword;
