import { useState, useEffect } from "react";
import CommonSection from "./../shared/CommonSection";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import TourCard from "./../shared/TourCard";
import { BASE_URL } from "../utils/config";
const SearchResultList = () => {
  const location = useLocation();
  const { data, totalCount, query, maxGroupSize } = location.state || {};
  const [page, setPage] = useState(1);
  const [toursPerPage] = useState(8);
  const [currentTours, setCurrentTours] = useState([]);
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalCount / toursPerPage);

  useEffect(() => {
    // Fetch data from the backend when the page changes
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/tours/search/getTourBySearch?city=${query}&maxGroupSize=${maxGroupSize}&page=${page}`
        );

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const result = await res.json();

        setCurrentTours(result.data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchData();
  }, [page, query, maxGroupSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      navigate(
        `/tours/search?city=${query}&maxGroupSize=${maxGroupSize}&page=${newPage}`,
        {
          state: { data, totalCount, query, maxGroupSize },
        }
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Container>
          <Row>
            {!currentTours.length ? (
              <h4 className="text-center">No tours found</h4>
            ) : (
              currentTours.map((tour) => (
                <Col lg="3" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
          {totalPages > 1 && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-warning mx-1"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                &lt; Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
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
                disabled={page === totalPages}
              >
                Next &gt;
              </button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default SearchResultList;
