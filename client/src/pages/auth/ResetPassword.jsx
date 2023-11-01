import { useState,  } from 'react';
import { useLocation, useNavigate,  } from 'react-router-dom';
import { Row, Col, Form,Container,Button } from "react-bootstrap";
import "../../styles/login.css";
import loginImg from "../../assets/images/login.png";
import userIcon from "../../assets/images/user.png";
import axios from "axios";
import useLocalState from "../../utils/localState";
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { alert, loading, setLoading, setSuccess } = useLocalState();

  const query = useQuery();

  const handleChange = async (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!password) {
      toast.error("Please Enter Password");
      setLoading(false);
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const { data } = await axios.post(`${BASE_URL}/auth/reset-password`, {
        password,
        token: query.get("token"),
        email: query.get("email"),
      },{withCredentials:true});
      setLoading(false);
      setSuccess(true);
      toast.success("Success, redirecting to login page shortly");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(
        error?.response?.data?.msg
          ? error?.response?.data?.msg
          : "There was an Error"
      );
      setLoading(false);
    }
  };
  return (
    <section>
      <Container className="mt-5 pt-5">
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
                <h2> Forgot Password</h2>
                {alert.show && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                  </div>
                )}
                <Form
                  className={loading ? "form form-loading" : "form"}
                  onSubmit={handleSubmit}
                >
                  <h5 className="mb-3">Enter new Password</h5>
                  {/* single form row */}
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  {/* end of single form row */}
                  <div className="text-center mt-3">
                    <Button
                      variant="dark"
                      type="submit"
                      className="btn btn-block"
                      disabled={loading}
                    >
                      {loading ? "Please Wait..." : "Submit"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ResetPasswordForm;
