import  { useState, useEffect } from "react";
import CommonSection from "./../shared/CommonSection";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import TourCard from "./../shared/TourCard";

const SearchResultList = () => {
  const location = useLocation();
  const [data] = useState(location.state);
  const [page, setPage] = useState(1);
  const [toursPerPage] = useState(6); 
  const [currentTours, setCurrentTours] = useState([]);

  const totalPages = Math.ceil(data.length / toursPerPage);

  useEffect(() => {
    // Calculate the index range for the current page
    const startIndex = (page - 1) * toursPerPage;
    const endIndex = startIndex + toursPerPage;
    const toursToDisplay = data.slice(startIndex, endIndex);

    setCurrentTours(toursToDisplay);
  }, [data, page, toursPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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
