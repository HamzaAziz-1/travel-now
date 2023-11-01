import { useRef, useState } from "react";
import "../styles/tour-details.css";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row, Col, ListGroup } from "reactstrap";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Booking from "../components/Booking/Booking";
import Newsletter from "./../shared/Newsletter";
import useFetch from "../hooks/useFetch";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./../context/AuthContext";
import {
  FaStar,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import Spinner from "../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/config";
const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const { user } = useGlobalContext();
  const reviewTitleRef = useRef("");

  const { data, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const tour = data?.tour;

  if (loading) {
    return <Spinner />;
  }

  const {
    images,
    title,
    description,
    price,
    city,
    duration,
    availableDays,
    timeSlots,
    averageRating,
    reviews,
    vendor,
  } = tour;

  const options = { day: "numeric", month: "long", year: "numeric" };

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    const reviewTitle = reviewTitleRef.current.value;

    if (!user) {
      toast.error("Please log in to leave a review");
      return;
    }

    const reviewObj = {
      tour: id,
      user: user.userId,
      rating: tourRating,
      title: reviewTitle,
      comment: reviewText,
    };

    try {
      const res = await axios.post(`${BASE_URL}/reviews`, reviewObj,{withCredentials:true});
      if (!res.data) {
        throw new Error("Failed to post review");
      }

      toast.info("Review submitted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.msg);
    }
  };

  return (
    <>
      <section>
        <Container className="mt-5 pt-2">
          {loading && <Spinner />}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <Carousel>
                    {images?.map((photo, index) => (
                      <Carousel.Item key={index}>
                        <img alt="tour" className="tour-image" src={photo} />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  <div className="tour__info text-center">
                    <h2>{title}</h2>

                    <div className="tour-detail-icons">
                      <span className="tour__rating align-items-center gap-1">
                        <FaStar style={{ color: "var(--secondary-color)" }} />
                        {averageRating === 0 ? null : averageRating}
                        {averageRating === 0 ? (
                          "Not rated"
                        ) : (
                          <span>({reviews?.length})</span>
                        )}
                      </span>

                      <span className="tour__availability">
                        Available days:{" "}
                        {availableDays &&
                          availableDays.map((day, index) => (
                            <span key={index}>
                              {day}
                              {index < availableDays.length - 1 ? ", " : ""}
                            </span>
                          ))}
                      </span>

                      <span className="tour__timeslots">
                        Time slots:{" "}
                        {timeSlots &&
                          timeSlots.map((slot, index) => (
                            <span key={index}>
                              {slot.start}-{slot.end}
                              {index < timeSlots.length - 1 ? ", " : ""}
                            </span>
                          ))}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span>
                        <FaMapMarkedAlt className="tour-icon" /> {city}
                      </span>
                      <span>
                        <FaMoneyBillWave className="tour-icon" /> Rs {price}{" "}
                        /per person
                      </span>
                      <span>
                        <FaClock className="tour-icon" /> {duration} days
                      </span>
                      <span>
                        <FaUsers className="tour-icon" />
                        <Link className="tour-link" to={`/users/${vendor._id}`}>
                          {vendor.name}
                        </Link>
                      </span>
                    </div>
                    <h5 className="mt-3">Description</h5>
                    <p>{description}</p>
                  </div>

                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    <Form
                      onSubmit={submitHandler}
                      className="review-form d-flex flex-column"
                    >
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <span
                            key={rating}
                            onClick={() => setTourRating(rating)}
                            className={`${
                              tourRating >= rating ? "active" : ""
                            }`}
                          >
                            {rating} <i className="ri-star-s-fill"></i>
                          </span>
                        ))}
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          className="title-input"
                          ref={reviewTitleRef}
                          placeholder="Title for your review"
                          required
                         
                        />
                      </div>

                      <div className="review__input d-flex">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="Share your thoughts"
                          className="msg__input"
                          required
                        />
                        <button
                          className="btn primary__btn text-white"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className="user__reviews">
                      {reviews?.map((review, index) => (
                        <div className="review__item" key={index}>
                          <div className="text-center">
                            <img
                              className="review_box review_box_img"
                              src={review?.user?.image}
                              alt=""
                            />
                            <p className="review_box">{review?.user?.name}</p>
                          </div>

                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.title}</h5>
                                <p>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", options)}
                                </p>
                              </div>
                              <span className="d-flex align-items-center">
                                {[...Array(5)].map((star, i) => (
                                  <i
                                    key={i}
                                    className={
                                      i < review.rating
                                        ? "ri-star-s-fill"
                                        : "ri-star-line"
                                    }
                                  ></i>
                                ))}
                              </span>
                            </div>

                            <h6>{review.comment}</h6>
                          </div>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </Col>

              <Col lg="4">
                <Booking tour={tour} avgRating={tour.averageRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;
