import "../../styles/tour-details.css";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import Spinner from "../../components/Spinner/Spinner";
import { BASE_URL } from "../../utils/config";
const TourDetails = () => {
  const { id } = useParams(); 

  // fetch data from database
  const { data, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const tour = data?.tour;
  console.log(tour);

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
    vendor
  } = tour;
  return (
    <>
      <section>
        <Container className="mt-5 pt-2">
          {loading && <Spinner />}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row className="align-items-center justify-content-center">
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

                    <div className="d-flex gap-5 tour-detail-icons">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <FaStar style={{ color: "var(--secondary-color)" }} />
                        {averageRating === 0 ? null : averageRating}
                        {averageRating === 0 ? (
                          "Not rated"
                        ) : (
                          <span>({reviews?.length})</span>
                        )}
                      </span>

                      <span className="tour__availability d-flex gap-5">
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
                          <Link
                            className="tour-link"
                            to={`/users/${vendor._id}`}
                          >
                            {vendor.name}
                          </Link>
                      
                      </span>
                    </div>
                    <h5 className="mt-4">Description</h5>
                    <p>{description}</p>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default TourDetails;
