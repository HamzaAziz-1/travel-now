import TourCard from "../../shared/TourCard";
import { Col } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import useFetch from '../../hooks/useFetch'

const FeaturedTourList = () => {
 
  const {
    data: featuredTours,
    loading,
    error,
  } = useFetch(`/api/v1/tours/search/getFeaturedTours`);
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
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
