/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Container, Image } from "react-bootstrap";
import useLocalState from "../../utils/localState";
import axios from "axios";
import "../../styles/CreateTour.css";
import { useGlobalContext } from "../../context/AuthContext";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const DayNamePicker = ({ selectedDays, onDayChange }) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      onDayChange(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      onDayChange([...selectedDays, day]);
    }
  };

  return (
    <div className="create-tour-day-name-picker">
      {days.map((day) => (
        <div
          key={day}
          className={
            selectedDays.includes(day)
              ? "create-tour-day-name selected"
              : "create-tour-day-name"
          }
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

const UpdateTour = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const searchBoxRef = useRef(null);
  const [tour, setTour] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([{ start: "", end: "" }]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [duration, setDuration] = useState(1);
  const [images, setImages] = useState([]);
  const [imgValue, setImgValue] = useState([]);
  const [formValidated, setFormValidated] = useState(false);
  const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();
  const navigate = useNavigate();
  const tourId = useParams().id;
  
  const searchBoxMeetingPointRef = useRef(null);
  const [meetingPoint, setMeetingPoint] = useState("");

  const { user } = useGlobalContext();
  useEffect(() => {
    if (user && user.role !== "tourist") {
      const fetchTour = async () => {
        try {
          const response = await axios.get(`/api/v1/tours/${tourId}`);
          const {
            title,
            price,
            description,
            city,
            duration,
            images,
            availableDays,
            timeSlots,
            meetingPoint,
          } = response.data.tour;
          setTitle(title);
          setPrice(price);
          setDescription(description);
          setCity(city);
          setDuration(duration);
          setImgValue(images);
          setAvailableDays(availableDays);
          setTimeSlots(timeSlots);
          setMeetingPoint(meetingPoint);
          setTour(response.data.tour);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTour();
    }
  }, [tourId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    hideAlert();
    setLoading(true);
    const form = e.currentTarget;
    if (form.checkValidity()) {
      // Form is valid, continue with form submission
      if (price < 500) {
        showAlert({ text: "Price must be greater than 500" });
        setLoading(false);
        return;
      }
      if (duration <= 0 || duration >= 5) {
        showAlert({ text: "Duration must be greater than 0 and less than 5" });
        setLoading(false);
        return;
      }

      let updatedImageValue = imgValue; // Use the previous image value by default

      if (images && images !== imgValue) {
        // If the new image is different from the previous one, upload the new image
        const formData = new FormData();
        formData.append("images", images);

        try {
          const {
            data: {
              image: { src },
            },
          } = await axios.post("/api/v1/tours/uploadImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          updatedImageValue = src; // Use the uploaded image URL
        } catch (error) {
          showAlert({ text: error.response.data.msg });
          setLoading(false);
          return;
        }
      }

      // Update the tour with the new data
      const tourData = {
        title,
        price,
        description,
        city,
        duration,
        images: updatedImageValue, // Use the updated image URL
        availableDays,
        meetingPoint,
        timeSlots,
      };

      try {
        await axios.patch(`/api/v1/tours/${tourId}`, tourData);
        showAlert({
          text: `Tour updated successfully!`,
          type: "success",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/tours");
        }, 2000);
      } catch (error) {
        showAlert({ text: error.response.data.msg });
        setLoading(false);
      }
    } else {
      // Form is invalid, mark it as validated to show error messages
      setFormValidated(true);
      setLoading(false);
    }
  };

  const handlePlacesChanged = async () => {
    if (!searchBoxRef.current) {
      return;
    }

    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const addressComponents = places[0].address_components;
      let cityName = "";
      let provinceName = "";
      let countryName = "";

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          provinceName = component.long_name;
        }
        if (component.types.includes("country")) {
          countryName = component.long_name;
        }
      }

      const fullAddress = `${cityName}, ${provinceName}, ${countryName}`;

      if (cityName) {
        setCity(cityName);
        // Use the Geocoding API to get the bounding box of the city
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address: fullAddress,
              key: "AIzaSyD2HrxZqzn7dVRWyIK7UIv66zWB8UBy-zw",
            },
          }
        );

        const results = response.data.results;
        console.log(results);
        if (results.length > 0) {
          setLatitude(results[0].geometry.location.lat);
          setLongitude(results[0].geometry.location.lng);
        }
      }
    } else {
      console.log("City not found");
    }
  };
  const handleMeetingPointPlacesChanged = () => {
    if (!searchBoxMeetingPointRef.current) {
      return;
    }

    const places = searchBoxMeetingPointRef.current.getPlaces();
    if (places && places.length > 0) {
      const fullAddress = places[0].formatted_address;
      setMeetingPoint(fullAddress);
    } else {
      console.log("Meeting point not found");
    }
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  // Add this function to handle adding new time slots
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: "", end: "" }]);
  };

  // Add this function to handle removing a time slot
  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <Container className="create-tour-container mt-5 pt-5">
          <div className="create-tour-heading text-center mb-5">
            <h2>Update this Tour Package</h2>
          </div>
          <Row>
            <Col lg="8" className="m-auto">
              {alert.show && (
                <div
                  className={`create-tour-alert text-center alert alert-${alert.type}`}
                >
                  {alert.text}
                </div>
              )}
              <Form
                onSubmit={handleSubmit}
                noValidate
                validated={formValidated}
                className={
                  loading ? "create-tour-form form-loading" : "create-tour-form"
                }
              >
                <Form.Group
                  controlId="title"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a title for your tour package"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a title.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="price"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Price:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a price.
                  </Form.Control.Feedback>
                  {formValidated && price <= 500 && (
                    <Form.Text className="text-danger">
                      Price must be greater than 500.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group
                  controlId="description"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a description.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="city"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>City:</Form.Label>
                  <StandaloneSearchBox
                    ref={searchBoxRef}
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Form.Control
                      type="text"
                      className=""
                      placeholder="Search for a city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </StandaloneSearchBox>
                </Form.Group>
                <Form.Group
                  controlId="duration"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Duration:</Form.Label>
                  <Form.Control
                    type="number"
                    value={duration}
                    placeholder="Enter duration of the tour"
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a duration.
                  </Form.Control.Feedback>
                  {formValidated && (duration <= 0 || duration >= 5) && (
                    <Form.Text className="text-danger">
                      Duration must be greater than 0 and less than 5.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group
                  controlId="meetingPoint"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Meeting Point:</Form.Label>
                  <StandaloneSearchBox
                    ref={searchBoxMeetingPointRef}
                    onLoad={(ref) => (searchBoxMeetingPointRef.current = ref)}
                    onPlacesChanged={handleMeetingPointPlacesChanged}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search for a meeting point"
                      value={meetingPoint}
                      onChange={(e) => setMeetingPoint(e.target.value)}
                    />
                  </StandaloneSearchBox>
                </Form.Group>

                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>
                    <b>Images:</b>
                  </Form.Label>
                  {imgValue && (
                    <Image
                      src={imgValue}
                      style={{ width: "50vw", height: "80vh" }}
                      alt="Tour"
                      thumbnail
                    />
                  )}
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.target.files[0])}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an image.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="availableDays"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Available Days:</Form.Label>
                  <div>
                    <DayNamePicker
                      selectedDays={availableDays}
                      onDayChange={(newDays) => setAvailableDays(newDays)}
                    />
                  </div>
                </Form.Group>

                <Form.Group
                  controlId="timeSlots"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Time Slots:</Form.Label>
                  {timeSlots.map((slot, index) => (
                    <Row key={index} className="create-tour-time-slot mb-2">
                      <Col>
                        <Form.Control
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            handleTimeSlotChange(index, "start", e.target.value)
                          }
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a start time.
                        </Form.Control.Feedback>
                      </Col>
                      <Col>
                        <div className="text-center">
                          <p>To</p>
                        </div>
                      </Col>
                      <Col>
                        <Form.Control
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            handleTimeSlotChange(index, "end", e.target.value)
                          }
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide an end time.
                        </Form.Control.Feedback>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="danger"
                          onClick={() => removeTimeSlot(index)}
                          className="create-tour-remove-time-slot"
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={addTimeSlot}
                    className="mt-3 create-tour-add-time-slot"
                  >
                    Add Time Slot
                  </Button>
                </Form.Group>
                <div className="text-center my-4">
                  <Button
                    variant="outline-dark"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Update"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </LoadScript>
    </>
  );
};

export default UpdateTour;
