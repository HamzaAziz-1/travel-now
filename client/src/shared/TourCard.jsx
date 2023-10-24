/* eslint-disable react/prop-types */
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";


const TourCard = ({ tour }) => {
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
          <img src={images[0]}  alt="tour" />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-s-fill"></i>
              {console.log(title,numOfReviews)}
              {averageRating === 0 ? null : averageRating}
              {numOfReviews === 0 ? (
                "Not rated"
              ) : (
                <span>({numOfReviews})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`}>{title}</Link>
          </h5>

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
