import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/PlaceDetails.css";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faClock,
  faGlobe,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../../components/Spinner/Spinner";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const PlaceDetails = () => {
  const { id, type } = useParams();
  const [details, setDetails] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          url: `https://travel-advisor.p.rapidapi.com/${type}/get-details`,
          params: {
            location_id: id,
            currency: "USD",
            lang: "en_US",
          },
          headers: {
            "X-RapidAPI-Key":
              "93b1e5603amsh59ea7a85e9e7b36p16b210jsn35af5aa8750e",
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
        const response = await axios(options);
        if (type === "hotels") {
          setDetails(response.data.data[0]);
        } else {
          setDetails(response.data);
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    const fetchPhotos = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/photos/list",
          params: {
            location_id: id,
            limit: "20",
          },
          headers: {
            "X-RapidAPI-Key":
              "93b1e5603amsh59ea7a85e9e7b36p16b210jsn35af5aa8750e",
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
        const response = await axios(options);
        console.log(response);
        setPhotos(response.data.data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchData();
    fetchPhotos();
  }, [id, type]);

  if (!details)
    return (
      <Container className="mt-5 pt-5">
        <Spinner />
      </Container>
    );
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${details.address}`;
  const descriptions = {
    attractions:
      "This attraction is a must-visit for tourists and locals alike. It offers a unique experience that you won't find anywhere else. Whether you're seeking adventure, history, or simply a stunning view, this place has it all. Not only does it provide a taste of the local culture and heritage, but it also presents a great opportunity for memorable photographs.",

    hotels:
      "This hotel offers top-notch accommodations, providing guests with comfort and convenience during their stay. From its stylish and comfortable rooms to its world-class amenities, every detail is designed with the guest in mind. Whether you're here for business or leisure, you'll find everything you need for a relaxing and enjoyable stay. The hotel staff is known for their friendly service and are always ready to cater to your needs.",

    restaurants:
      "This restaurant is renowned for its delightful culinary experience. The dishes are crafted with care and passion, promising a meal to remember. The menu is a blend of traditional flavors and innovative ideas, ensuring a diverse selection that will satisfy all palates. The ambiance is warm and welcoming, making it a perfect place for any occasion, be it a family dinner, a date, or a celebration with friends. The service is attentive and efficient, adding to the overall exceptional dining experience.",
  };

  const fullDescription = `${details.description} ${descriptions[type]}`;

  return (
    <div className="place-details container-fluid py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <Carousel>
            {photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="place-img img-fluid "
                  src={photo?.images?.large?.url}
                  alt="Slide"
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <h1 className="place-title mt-4">{details.name}</h1>
          <p className="place-address mt-3">
            <FontAwesomeIcon className="px-2" icon={faMapMarkerAlt} />{" "}
            {details.address}
          </p>
          <p className="place-desc mt-3">{fullDescription}</p>
          <p className="place-phone mt-3">
            <FontAwesomeIcon icon={faPhone} /> {details.phone}
          </p>
          <p
            className="open-now-text mt-3"
            style={{
              color: details.open_now_text === "Open Now" ? "green" : "red",
            }}
          >
            <FontAwesomeIcon icon={faClock} /> {details.open_now_text}
          </p>
          <a className="btn btn-outline-secondary mt-3" href={details.website}>
            <FontAwesomeIcon icon={faGlobe} /> Visit Website
          </a>
        </div>
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-10 text-center">
          <iframe
            title="Google Maps"
            src={googleMapsUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
