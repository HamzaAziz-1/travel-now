/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import CommonSection from "../shared/CommonSection";
import Spinner from "../components/Spinner/Spinner";
import "../styles/tour.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import { Container, Row, Col } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import axios from "axios";

const Tours = () => {
  const [page, setPage] = useState(1); 
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the custom hook for fetching data
  const {
    data: tourData,
    loading: tourLoading,
    error: tourError,
  } = useFetch(`/api/v1/tours/verified?page=${page}`);

  useEffect(() => {
    if (tourData) {
      setTours(tourData.tours);
    }
  }, [tourData]);

  // Fetch tourCount only once during initial load
  const tourCountData = useFetch("/api/v1/tours/search/getTourCount");

  // Compute pageCount using useMemo
  const pageCount = useMemo(() => {
    if (tourCountData.data) {
      const count = tourCountData.data.data;
      return Math.ceil(count / 8);
    }
    return 0;
  }, [tourCountData.data]);

  // Fetch data when the page changes
  useEffect(() => {
    if (page > 0 && page <= pageCount) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/v1/tours/verified?page=${page}`
          );
          setTours(response.data.tours);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [page, pageCount]);

 const handlePageChange = (newPage) => {
   if (newPage >= 1 && newPage <= pageCount) {
     setPage(newPage);
     setTimeout(() => {
       window.scrollTo({ top: 250, behavior: "smooth" });
     }, 0); 
   }
 };


  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
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
              {tours.length>0 && (
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
