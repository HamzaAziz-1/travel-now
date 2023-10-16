/* eslint-disable react/prop-types */
import { useState } from "react";
import "./booking.css";
import { FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const Booking = ({ tour }) => {
  const { price, reviews, name, averageRating } = tour;
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [booking, setBooking] = useState({
    userId: user?.userId,
    userEmail: user?.email,
    tourName: name,
    fullName: user?.name,
    phone: user?.phoneNo,
    guestSize: 1,
    startDate: "",
    endDate: "",
    date: new Date(),
  });
  const [orderItem, setOrderItem] = useState({
    vendor: tour?.vendor,
    duration: tour?.duration,
    price: tour?.price,
    availableDays: [],
    timeSlots: [],
    date: new Date(),
    amount: 1,
    tour: tour?._id,
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    selectedDay: "",
    selectedTimeSlot: "",
    guestSize: "",
  });
  const [isValid, setIsValid] = useState(false);

  // Converts a date to a day of the week (e.g., Monday, Tuesday, etc.)
  const getDayName = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const validateForm = () => {
    const errors = {};

    // Validate each input
    if (booking.fullName === "") {
      errors.fullName = "Full Name is required";
    }
    if (booking.phone === "") {
      errors.phone = "Phone Number is required";
    }
    if (selectedDay === "") {
      errors.selectedDay = "Please select a day";
    }
    if (selectedTimeSlot === "") {
      errors.selectedTimeSlot = "Please select a time slot";
    }
    if (booking.guestSize < 1 || booking.guestSize > 4) {
      errors.guestSize = "Guest size must be between 1 and 4";
    }

    // Set form errors
    setFormErrors(errors);

    // Check if there are no errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    setIsValid(!hasErrors);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "selectedDay") {
      setSelectedDay(value);
      setSelectedDate(null);
      setOrderItem((prev) => ({ ...prev, availableDays: [value] }));
    } else if (id === "selectedTimeSlot") {
      setSelectedTimeSlot(value);
      const [start, end] = value.split("-");
      setOrderItem((prev) => ({
        ...prev,
        timeSlots: [{ start, end }],
      }));
    } else if (id === "guestSize") {
      setOrderItem((prev) => ({ ...prev, amount: parseInt(value) }));
      setBooking((prev) => ({ ...prev, guestSize: parseInt(value) }));
    } else {
      setBooking((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("en-GB");
    setBooking((prev) => ({
      ...prev,
      date: formattedDate,
      startDate: formattedDate,
      endDate: formattedDate,
    }));
    setOrderItem((prev) => ({ ...prev, date: formattedDate }));
  };

  const serviceFee = 500;
  const totalAmount =
    Number(price) * Number(booking.guestSize) + Number(serviceFee);

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate the form
    validateForm();

    if (!user || user === undefined || user === null) {
      toast.error("Please Login!");
      return;
    }

    if (user.role !== "tourist") {
      toast.error("Only Tourists can book a tour");
      return;
    }

    if (!isValid) {
      console.log("Validation failed");
      return;
    }

    try {
      const cartItems = [
        {
          ...orderItem,
          endTime: selectedDate.toLocaleDateString("en-GB"),
        },
      ];

      const res = await axios.post(`/api/v1/orders`, { items: cartItems });

      const result = res.data;

      navigate("/checkout", {
        state: { order: result.order, clientSecret: result.clientSecret },
      });
    } catch (err) {
      const msg = err?.response?.data?.msg;
      toast.error(msg ? msg : "An error occurred");
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          Rs {price} <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center ">
          <FontAwesomeIcon icon={faStar} />
          {typeof averageRating === "number" && !isNaN(averageRating)
            ? averageRating === 0
              ? null
              : averageRating
            : "N/A"}{" "}
          ({reviews?.length})
        </span>
      </div>

      {/* ========== booking form ============= */}
      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <Form.Label>
              <b>Name:</b>
            </Form.Label>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              value={booking.fullName}
              disabled
              onChange={handleChange}
            />
            {formErrors.fullName && (
              <div className="error text-danger">{formErrors.fullName}</div>
            )}
          </FormGroup>
          <Form.Label>
            <b>Phone Number:</b>
          </Form.Label>
          <FormGroup>
            <input
              type="text"
              placeholder="Phone"
              id="phone"
              required
              disabled
              value={booking.phone}
              onChange={handleChange}
            />
            {formErrors.phone && (
              <div className="error text-danger">{formErrors.phone}</div>
            )}
          </FormGroup>
          <FormGroup>
            <Form.Label>
              <b>Choose Tour Day:</b>
            </Form.Label>
            <Form.Select
              id="selectedDay"
              value={selectedDay}
              onChange={handleChange}
              required
            >
              <option value="">Select a day</option>
              {tour.availableDays &&
                tour.availableDays.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
            </Form.Select>
            {formErrors.selectedDay && (
              <div className="error text-danger">{formErrors.selectedDay}</div>
            )}
          </FormGroup>
          <Form.Group>
            <Form.Label>
              <b>Choose Tour Date:</b>
            </Form.Label>

            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              filterDate={(date) => {
                const dayName = getDayName(date);
                return date >= new Date() && selectedDay.includes(dayName);
              }}
              disabled={!selectedDay}
            />
          </Form.Group>

          <FormGroup className="my-3">
            <Form.Label>
              <b>Choose Tour Time Slot:</b>
            </Form.Label>
            <Form.Select
              id="selectedTimeSlot"
              value={selectedTimeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select time slot</option>
              {tour.timeSlots &&
                tour.timeSlots.map((slot, index) => (
                  <option key={index} value={`${slot.start}-${slot.end}`}>
                    {slot.start}-{slot.end}
                  </option>
                ))}
            </Form.Select>
            {formErrors.selectedTimeSlot && (
              <div className="error text-danger">
                {formErrors.selectedTimeSlot}
              </div>
            )}
          </FormGroup>
          <Form.Label>
            <b>Enter the number of people</b>
          </Form.Label>
          <FormGroup>
            <input
              type="number"
              placeholder="Guest"
              id="guestSize"
              minLength={1}
              maxLength={5}
              value={booking.guestSize}
              required
              onChange={handleChange}
            />
            {formErrors.guestSize && (
              <div className="error text-danger">{formErrors.guestSize}</div>
            )}
          </FormGroup>
        </Form>
      </div>
      {/* ========== booking end ============= */}

      {/* ========= booking bottom ============ */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              Rs {price} <FontAwesomeIcon icon={faTimes} /> {booking.guestSize}{" "}
              person
            </h5>

            <span> Rs {price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span> Rs{serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span> Rs{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Booking;
