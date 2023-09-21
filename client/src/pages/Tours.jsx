import { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import Spinner from "../components/Spinner/Spinner";
import "../styles/tour.css";
import TourCard from "./../shared/TourCard";
import SearchBar from "./../shared/SearchBar";
import Newsletter from "./../shared/Newsletter";
import { Container, Row, Col } from "react-bootstrap";
import { useGlobalContext } from "../context/AuthContext";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useGlobalContext();
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch(url);

          if (!res.ok) {
            setError("failed to fetch");
          }
          const result = await res.json();
          console.log(result.tours);

          setData(result.tours);
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

  const {
    data: tours,
    loading,
    error,
  } = useFetch(`/api/v1/tours/verified?page=${page}`);
  const { data: tourCount } = useFetch(`/api/v1/tours/search/getTourCount`);

  useEffect(() => {
    const pages = Math.ceil(tourCount / 8);
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [page, tourCount, tours]);

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
            <Row>
              {tours?.map((tour) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} tourVendor={tour.vendor} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Tours;
