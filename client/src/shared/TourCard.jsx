/* eslint-disable react/prop-types */
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";
import { useNavigate } from "react-router-dom";

const TourCard = ({ tour }) => {
  const navigate = useNavigate()
  const {
    _id,
    title,
    city,
    images,
    price,
    featured,
    vendor,
    averageRating,
    numOfReviews,
  } = tour;
    
 

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={images[0]} alt="tour" />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <div className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city}
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-end pt-2">
                <span className="tour__rating d-flex align-items-center gap-1">
                  <i className="ri-star-s-fill"></i>
                  {averageRating === 0 ? null : averageRating}
                  {numOfReviews === 0 ? "(0)" : <span>({numOfReviews})</span>}
                </span>
              </div>
              <span>
                <img
                  className="vendor-img"
                  src={vendor?.image}
                  onClick={() => navigate(`/users/${vendor._id}`)}
                  alt=""
                />
              </span>
            </div>
          </div>

          <span className="tour__title ">
       
            <Link className="tour-link" to={`/tours/${_id}`}>{title}</Link>

      
          </span>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              Rs {price} <span> /per person</span>
            </h5>

            <button className="btn booking__btn">
              <Link to={`/tours/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
