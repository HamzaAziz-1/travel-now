import { useState, useEffect, useMemo } from "react";
import CommonSection from "../shared/CommonSection";
import Spinner from "../components/Spinner/Spinner";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import { Container, Row, Col } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import "../styles/tour.css";
import { BASE_URL } from "../utils/config";

const Tours = () => {
  const [page, setPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState(""); // State to store sorting option

  const tourDataUrl = `${BASE_URL}/tours/verified?page=${page}&sort=${sortOption}`; // Include sorting option in the URL
  const tourCountUrl = `${BASE_URL}/tours/search/getTourCount`;

  const {
    data: tourData,
    loading: tourLoading,
    error: tourError,
  } = useFetch(tourDataUrl);

  useEffect(() => {
    if (tourData) {
      setTours(tourData.tours);
    }
    setLoading(tourLoading);
  }, [tourData, tourLoading]);

  const { data: tourCountData } = useFetch(tourCountUrl);

  const pageCount = useMemo(() => {
    if (tourCountData) {
      const count = tourCountData.data;
      return Math.ceil(count / 8);
    }
    return 0;
  }, [tourCountData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setPage(newPage);
      setLoading(true); // Set loading to true when changing pages
      window.scrollTo({ top: 50, behavior: "smooth" });
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPage(1); // Reset page to 1 when changing sorting
  };

  useEffect(() => {
    if (tourData || error) {
      setLoading(false);
    }
  }, [tourData, error]);

  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <div className="search-sort d-flex  flex-column align-items-center">
            <div>
              <SearchBar />
            </div>
            <div className="d-flex align-items-center">
              <select
                className="sorting__input mt-4"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="">Sort By</option>
                <option value="rating">Rating</option>
                <option value="city">City</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          {loading && (
            <div className="mt-5">
              <Spinner />
            </div>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <>
              <Row>
                {tours?.map((tour) => (
                  <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                    <TourCard tour={tour} tourVendor={tour.vendor} />
                  </Col>
                ))}
              </Row>
              {!loading && tours.length === 0 && (
                <h2 className="text-center">No tours found.</h2>
              )}
              {/* Pagination */}
              {tours.length > 0 && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-warning mx-1"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    &lt; Prev
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`btn ${
                        page === index + 1
                          ? "btn-warning active__page"
                          : "btn-outline-warning"
                      } mx-1`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-warning mx-1"
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pageCount}
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
};

export default Tours;
