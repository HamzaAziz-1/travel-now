import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../../styles/login.css";
import loginImg from "../../assets/images/login.png";
import userIcon from "../../assets/images/user.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useLocalState from "../../utils/localState";
import { useGlobalContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";
const Login = () => {
  const { saveUser } = useGlobalContext();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { alert, loading, setLoading } = useLocalState();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = values;
    const loginUser = { email, password };
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, loginUser,{withCredentials:true});
      setValues({ email: "", password: "" });
      toast.info(`Welcome, ${data.user.name}`);
      setLoading(false);
      saveUser(data.user);
      if (data?.user?.role) {
        navigate(`/${data.user.role}/dashboard`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : "An Error Occurred"
      );
      setLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="9" className="m-auto pt-5">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2 className="mt-4">Login</h2>
                {alert.show && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                  </div>
                )}
                <Form
                  className={loading ? "form form-loading" : "form"}
                  onSubmit={onSubmit}
                >
                  <Form.Group controlId="email" className="mt-2 mb-3">
                    <Form.Control
                      type="email"
                      className="shadow-none"
                      placeholder="Enter your Email"
                      required
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Control
                      type="password"
                      placeholder="Enter your Password"
                      required
                      className="shadow-none"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </Form>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Don't have an account?
                  <Link to="/register" className="register-link">
                    Register
                  </Link>
                </p>
                <p>
                  Forgot your password?{" "}
                  <Link to="/forgot-password" className="reset-link">
                    Reset Password
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
