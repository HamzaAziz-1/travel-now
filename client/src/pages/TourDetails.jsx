import { useEffect, useRef, useState } from "react";
import "../styles/tour-details.css";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row, Col, ListGroup } from "reactstrap";
import { Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import calculateAvgRating from "./../utils/avgRating";
import Booking from "../components/Booking/Booking";
import Newsletter from "./../shared/Newsletter";
import { Alert } from "react-bootstrap";
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

const TourDetails = () => {
  const [tourVendor, setTourVendor] = useState(null);
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const { user } = useGlobalContext();
  const [reviews, setReviews] = useState([]);
  const reviewTitleRef = useRef("");

  // fetch data from database
  const { data, loading, error } = useFetch(`/api/v1/tours/${id}`);
  const tour= data?.tour
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

 useEffect(() => {
   window.scrollTo(0, 0);

   const fetchTourVendor = async () => {
     if (tour && tour?.vendor) {
       try {
         const response = await axios.get(`/api/v1/users/${tour.vendor}`);
         setTourVendor(response.data);
       } catch (error) {
         console.error("Error fetching tour vendor data:", error);
       }
     }
   };
   fetchTourVendor();
 }, [tour]);


  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/v1/reviews/tour/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };
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
  } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  // format date
  const options = { day: "numeric", month: "long", year: "numeric" };

  // submit request to the server

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    const reviewTitle = reviewTitleRef.current.value;

    if (!user) {
      return <Alert variant="warning">Please Login!</Alert>;
    }

    const reviewObj = {
      tour: id, // tour ID
      user: user.userId, // user ID
      rating: tourRating, // rating
      title: reviewTitle, // title of review
      comment: reviewText, // comment text
    };

    try {
      const res = await axios.post(`/api/v1/reviews`, reviewObj);
      if (!res.data) {
        throw new Error("Failed to post review");
      }

      // Show some message to user
      alert("Review submitted successfully");

      // Refresh the reviews
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response.data.msg);
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

                    <div className="d-flex align-items-center gap-5 tour-detail-icons">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <FaStar style={{ color: "var(--secondary-color)" }} />
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? (
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
                        {tourVendor && (
                          <Link
                            className="tour-link"
                            to={`/users/${tourVendor.user._id}`}
                          >
                            {tourVendor.user.name}
                          </Link>
                        )}
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{description}</p>
                  </div>

                  {/* ========== tour reviews section =========== */}
                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    <Form onSubmit={submitHandler} className="review-form">
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        <span
                          onClick={() => setTourRating(1)}
                          className={tourRating >= 1 ? "active" : ""}
                        >
                          1 <i className="ri-star-s-fill"></i>
                        </span>
                        <span
                          onClick={() => setTourRating(2)}
                          className={tourRating >= 2 ? "active" : ""}
                        >
                          2 <i className="ri-star-s-fill"></i>
                        </span>
                        <span
                          onClick={() => setTourRating(3)}
                          className={tourRating >= 3 ? "active" : ""}
                        >
                          3 <i className="ri-star-s-fill"></i>
                        </span>
                        <span
                          onClick={() => setTourRating(4)}
                          className={tourRating >= 4 ? "active" : ""}
                        >
                          4 <i className="ri-star-s-fill"></i>
                        </span>
                        <span
                          onClick={() => setTourRating(5)}
                          className={tourRating >= 5 ? "active" : ""}
                        >
                          5 <i className="ri-star-s-fill"></i>
                        </span>
                      </div>

                      <div className="review__input" style={{ width: "50%" }}>
                        <input
                          type="text"
                          ref={reviewTitleRef}
                          placeholder="Title for your review"
                          required
                        />
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="share your thoughts"
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
                            {" "}
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
                                {[...Array(5)].map((star, i) => {
                                  return (
                                    <i
                                      key={i}
                                      className={
                                        i < review.rating
                                          ? "ri-star-s-fill"
                                          : "ri-star-line"
                                      }
                                    ></i>
                                  );
                                })}
                              </span>
                            </div>

                            <h6>{review.comment}</h6>
                          </div>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                  {/* ========== tour reviews section end =========== */}
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
