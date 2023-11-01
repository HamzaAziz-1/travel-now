import TourCard from "../../shared/TourCard";
import { Col } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import useFetch from '../../hooks/useFetch'
import { BASE_URL } from "../../utils/config";
const FeaturedTourList = () => {
 
  const {
    data,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTours`);
  
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {error && <h4>{error}</h4>}
      {!loading &&
        !error &&
        data?.tours?.map((tour) => (
          <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))}
    </>
  );
};

export default FeaturedTourList;
