import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/AuthContext";
import { Form, Button, Container, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../styles/update-profile.css";
import avatar from "../../assets/images/avatar.jpg";

const UpdateProfile = () => {
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingPhoneNo, setEditingPhoneNo] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [loading, setLoading] = useState(true);
   useEffect(() => {
     const fetchUser = async () => {
       try {
         const { data } = await axios.get(`/api/v1/users/showMe`);         
           setUser(data.user);
           setName(data.user.name);
           setPhoneNo(data.user.phoneNo);
           setImage(data.user.image);
           setOriginalImage(data.user.image);
           setCountry(data.user.country);
           setLoading(false);
         } 
        catch (error) {
         console.log("error", error);
       }
     };
     fetchUser();
   }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

      let src = originalImage; // Default value for src

      if (image !== originalImage) {
        // If image has been added or updated, upload the new image
        const formData = new FormData();
        formData.append("image", image);

        const {
          data: {
            image: { src: newSrc },
          },
        } = await axios.post("/api/v1/tours/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        src = newSrc; // Update the src value with the new image URL
      }

      const userData = { name, phoneNo, image: src, country };
         axios
           .put(`/api/v1/users/updateUser`, userData)
           .then((response) => {
             const { data } = response.data;
               // check if data and data.user exist
               setUser(response.data.user);
               setSuccess("Profile updated successfully!");
               setEditingName(false);
               setEditingPhoneNo(false);
               setEditingImage(false);
            
           })
           .catch((error) => {
             setError(error.message);
           });

  };

  return (
    <Container className="py-5 update-profile">
      <h1 className="header text-center pt-3" style={{ color: "#4b6584" }}>
        Update Your Profile
      </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {!loading && (
        <Form onSubmit={handleSubmit} className="profile-form">
          <Form.Group controlId="formBasicImage" className="image-container">
            <Form.Label>
              <strong>Profile Picture</strong>
            </Form.Label>
            {editingImage ? (
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            ) : (
              <div>
                {image ? (
                  <Image
                    src={image}
                    roundedCircle
                    className="profile-image"
                    alt={avatar}
                  />
                ) : (
                  <Image
                    src={avatar}
                    roundedCircle
                    className="profile-image"
                    alt={image}
                  />
                )}
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => setEditingImage(true)}
                  className="edit-icon"
                />
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formBasicName" className="field-group">
            <Form.Label>
              <strong>Name</strong>
            </Form.Label>
            {editingName ? (
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <Row className="field-row">
                <Col>{name}</Col>
                <Col xs="auto" className="edit-icon-col">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => setEditingName(true)}
                    className="edit-icon"
                  />
                </Col>
              </Row>
            )}
          </Form.Group>

          <Form.Group className="field-group">
            <Form.Label>
              <strong>Phone Number</strong>
            </Form.Label>
            {editingPhoneNo ? (
              <PhoneInput
                type="phoneNo"
                name="phoneNo"
                placeholder="Phone Number"
                value={phoneNo}
                onChange={(value) => setPhoneNo(value)}
              />
            ) : (
              <Row>
                <Col>{phoneNo}</Col>
                <Col xs="auto">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => setEditingPhoneNo(true)}
                    className="edit-icon"
                  />
                </Col>
              </Row>
            )}
          </Form.Group>

          <Form.Group controlId="formBasicCountry" className="field-group">
            <Form.Label>
              <strong>Country</strong>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Country"
              value={country}
              disabled
            />
          </Form.Group>

          {(editingName || editingPhoneNo || editingImage) && (
            <Button variant="primary" type="submit" className="submit-btn">
              Save Changes
            </Button>
          )}
        </Form>
      )}
    </Container>
  );
};

export default UpdateProfile;
