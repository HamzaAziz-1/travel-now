import { useEffect, useState } from "react";
import "../../styles/tour-details.css";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import calculateAvgRating from "../../utils/avgRating";
import Newsletter from "../../shared/Newsletter";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const TourDetailsAdmin = () => {
  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch(url);

          if (!res.ok) {
            setError("failed to fetch");
          }
          const result = await res.json();

          setData(result.tour);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchData();
    }, [url]);

    return {
      data,
      error,
      loading,
    };
  };

  const [tourVendor, setTourVendor] = useState(null);
  const { id } = useParams();

  // const { user } = useGlobalContext();

  // fetch data from database
  const { data: tour, loading, error } = useFetch(`tours/${id}`);

  // destructure properties from tour object
  const {
    images,
    name,
    description,
    price,
    reviews,
    city,
    duration,
    availableDays,
    timeSlots,
    vendor,
  } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTourVendor = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${vendor}`);
        setTourVendor(response.data);
      } catch (error) {
        console.error("Error fetching tour vendor data:", error);
      }
    };
    fetchTourVendor();
  }, [tour, vendor]);

  return (
    <>
      <section>
        <Container className="mt-5 pt-2">
          {loading && <Spinner />}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row className="justify-content-center">
              <Col lg="8">
                <div className="tour__content">
                  <Carousel>
                    {images?.map((photo, index) => (
                      <Carousel.Item key={index}>
                        <img alt="tour" className="tour-image" src={photo} />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  <div className="tour__info">
                    <h2>{name}</h2>

                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i
                          className="ri-star-s-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>
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
                        <i className="ri-map-pin-2-line"></i> {city}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i> Rs{" "}
                        {price} /per person
                      </span>
                      <span>
                        <i className="ri-map-pin-time-line"></i> {duration} days
                      </span>
                      <span>
                        <i className="ri-group-line"></i>
                        {tourVendor && (
                          <Link
                            to={`/users/${tourVendor.user._id}`}
                            className="custom-link"
                          >
                            {tourVendor.user.name}
                          </Link>
                        )}
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{description}</p>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetailsAdmin;
