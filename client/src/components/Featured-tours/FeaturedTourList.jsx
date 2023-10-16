import { useEffect, useState } from "react";
import TourCard from "../../shared/TourCard";
import { Col } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";

const FeaturedTourList = () => {
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
    data: featuredTours,
    loading,
    error,
  } = useFetch(`/tours/search/getFeaturedTours`);

  return (
    <>
      {loading && <Spinner />}
      {error && <h4>{error}</h4>}
      {!loading &&
        !error &&
        featuredTours?.map((tour) => (
          <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))}
    </>
  );
};

export default FeaturedTourList;
