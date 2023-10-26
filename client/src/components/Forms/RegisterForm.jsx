/* eslint-disable react/prop-types */
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/images/register.png";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { validationSchema } from "../../utils/validationSchema";
import { countryList } from "../../utils/countryList";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterForm = ({
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      gender: "",
      phoneNo: "",
      country: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post(`/api/v1/auth/register`, values);
        formik.resetForm(); 
        toast.success("Registration Successful")
        setTimeout(() => {
          navigate('/login');
        }, 2500)
      } catch (error) {
        const { msg } = error.response.data;
        toast.error(msg?msg:"An Error Ocurred")
      }
      setLoading(false);
    },
  });

  return (
    <section>
      <Container>
        <Row>
          <Col lg="9" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img my-auto">
                <img src={registerImg} alt="" />
              </div>
              <div className="login__form">
                <h2>Register</h2>
                {alert.show && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                  </div>
                )}
                  <Form
                    className={loading ? "form form-loading" : "form"}
                    onSubmit={formik.handleSubmit}
                  >
                    <Form.Group controlId="name" className="mt-3 mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="error-message mx-1">
                          {formik.errors.name}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="email" className="mt-3 mb-3">
                      <Form.Control
                        type="email"
                        placeholder="example@domain.com"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="error-message mx-1">
                          {formik.errors.email}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mt-3 mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        {...formik.getFieldProps("password")}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="error-message mx-1">
                          {formik.errors.password}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group
                      md="4"
                      controlId="validationCustom02"
                      className="mt-3 mb-3"
                    >
                      <Form.Control
                        as="select"
                        {...formik.getFieldProps("gender")}
                      >
                        <option>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Control>
                      {formik.touched.gender && formik.errors.gender && (
                        <div className="error-message mx-1">
                          {formik.errors.gender}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mt-3 mb-3">
                      <PhoneInput
                        name="phoneNo"
                        placeholder="Enter your phone number"
                        value={formik.values.phoneNo}
                        onChange={(value) =>
                          formik.setFieldValue("phoneNo", value)
                        }
                      />
                      {formik.touched.phoneNo && formik.errors.phoneNo && (
                        <div className="error-message mx-1">
                          {formik.errors.phoneNo}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group
                      md="4"
                      controlId="validationCustom02"
                      className="mt-3 mb-3"
                    >
                      <Form.Control
                        as="select"
                        {...formik.getFieldProps("role")}
                      >
                        <option>Select Role</option>
                        <option value="tourist">Tourist</option>
                        <option value="vendor">Vendor</option>
                      </Form.Control>
                      {formik.touched.role && formik.errors.role && (
                        <div className="error-message mx-1">
                          {formik.errors.role}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group
                      md="4"
                      controlId="validationCustom02"
                      className="mt-3 mb-3"
                    >
                      <Form.Control
                        as="select"
                        {...formik.getFieldProps("country")}
                      >
                        <option>Select Country</option>
                        {countryList.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </Form.Control>
                      {formik.touched.country && formik.errors.country && (
                        <div className="error-message mx-1">
                          {formik.errors.country}
                        </div>
                      )}
                    </Form.Group>

                    <Button
                      className="btn secondary__btn auth__btn"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Loading..." : "Register"}
                    </Button>
                  </Form>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RegisterForm;
