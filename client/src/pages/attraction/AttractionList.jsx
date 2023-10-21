import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import axios from "axios";
import {
  Container,
  Form,
  FormGroup,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./AttractionList.module.css";
import heroImg from "../../assets/images/hero.jpg";
import heroImg02 from "../../assets/images/hero1.jpg";
import "../../styles/home.css";
import Subtitle from "../../shared/Subtitle";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const AttractionList = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {});

  const handlePlacesChanged = async () => {
    if (!searchBoxRef.current) {
      return;
    }

    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const addressComponents = places[0].address_components;
      let cityName = "";
      let provinceName = "";
      let countryName = "";

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          provinceName = component.long_name;
        }
        if (component.types.includes("country")) {
          countryName = component.long_name;
        }
      }

      const fullAddress = `${cityName}, ${provinceName}, ${countryName}`;

      if (cityName) {
        setQuery(cityName);
        console.log(cityName);

        // Use the Geocoding API to get the bounding box of the city
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address: fullAddress,
              key: "AIzaSyD2HrxZqzn7dVRWyIK7UIv66zWB8UBy-zw",
            },
          }
        );

        const results = response.data.results;
        console.log(results);
        if (results.length > 0) {
          setLatitude(results[0].geometry.location.lat);
          setLongitude(results[0].geometry.location.lng);
        }
      }
    } else {
      console.log("City not found");
    }
  };

  const search = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://travel-advisor.p.rapidapi.com/locations/search",
        {
          headers: {
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "X-RapidAPI-Key":
              "97b7f0b28amsh44b2bb367d6a8dcp19c700jsnbc7fd72bc53c",
          },
          params: {
            query,
          },
        }
      );
      const locationId = response.data.data[0].result_object.location_id;
      const placesResponse = await axios.get(
        "https://travel-advisor.p.rapidapi.com/attractions/list",
        {
          headers: {
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "X-RapidAPI-Key":
              "97b7f0b28amsh44b2bb367d6a8dcp19c700jsnbc7fd72bc53c",
          },
          params: {
            location_id: locationId,
            count: 30,
          },
        }
      );
      const restaurantsResponse = await axios.get(
        "https://travel-advisor.p.rapidapi.com/restaurants/list",
        {
          headers: {
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "X-RapidAPI-Key":
              "97b7f0b28amsh44b2bb367d6a8dcp19c700jsnbc7fd72bc53c",
          },
          params: {
            location_id: locationId,
            count: 30,
          },
        }
      );

      const options = {
        method: "GET",
        url: "https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng",
        params: {
          latitude: latitude,
          longitude: longitude,
          limit: "30",
        },
        headers: {
          "X-RapidAPI-Key":
            "97b7f0b28amsh44b2bb367d6a8dcp19c700jsnbc7fd72bc53c",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      };
      try {
        const hotelsResponse = await axios.request(options);
        console.log(hotelsResponse);
        const filteredHotels = hotelsResponse.data.data.filter(
          (result) =>
            result.name && result.photo && result.photo.images.large.url
        );
        setHotels(filteredHotels);
      } catch (error) {
        console.log(error);
      }
      const filteredResults = placesResponse.data.data.filter(
        (result) => result.name && result.photo && result.photo.images.large.url
      );

      const filteredRestaurants = restaurantsResponse.data.data.filter(
        (result) => result.name && result.photo && result.photo.images.large.url
      );
      setResults(filteredResults);

      setRestaurants(filteredRestaurants);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const searchBoxOptions = {
    types: ["(cities)"],
  };

  const renderCards = (items, place) =>
    items.map((item) => (
      <div className={styles.cardWrapper} key={item.location_id}>
        <Card className={`${styles.card} mb-4`}>
          {item.photo && (
            <Card.Img
              variant="top"
              src={item.photo.images.large.url}
              alt={item.name}
              className={styles.cardImg}
            />
          )}
          <Card.Body>
            <Card.Title className="card-title text-center">
              {item.name}
            </Card.Title>
            <Link to={`/${place}/${item.location_id}`} target="_blank">
              <div className="text-center">
                <Button
                  variant="outline-secondary"
                  className="custom-button my-2"
                >
                  Explore More <i className="fas fa-arrow-right"></i>
                </Button>
              </div>
            </Link>
          </Card.Body>
        </Card>
      </div>
    ));

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <section>
          <Container>
            <Row>
              <Col lg="6">
                <div className="hero__content">
                  <div className="hero__subtitle d-flex align-items-center ">
                    <Subtitle subtitle={"Discover Before You Visit"} />
                  </div>
                  <h1>
                    Find the
                    <span className="highlight"> Top Attractive Spots </span>
                    that you must visit
                  </h1>
                  <p>
                    Explore the best attractions with Tour Explorer. Our page
                    features the top must-visit spots, including historical
                    landmarks, natural wonders, and cultural hotspots. Plan your
                    adventure today!
                  </p>
                </div>
              </Col>

              <Col lg="3" className="mt-5">
                <div className="hero__img-box mt-5 pt-5">
                  <img src={heroImg} alt="" />
                </div>
              </Col>

              <Col lg="3">
                <div className="hero__img-box mt-5">
                  <img src={heroImg02} alt="" />
                </div>
              </Col>

              <Col lg="12">
                <div className="search__bar text-center">
                  <Form className="d-flex align-items-center gap-4">
                    <FormGroup
                      className="d-flex gap-7 form__group form__group-fast text-center align-items-center justify-content-center"
                      style={{ width: "320px" }}
                    >
                      <span>
                        <i className="ri-map-pin-line"></i>
                      </span>
                      <div className="text-center">
                        <h6>Location</h6>
                        <StandaloneSearchBox
                          ref={searchBoxRef}
                          onLoad={(ref) => (searchBoxRef.current = ref)}
                          onPlacesChanged={handlePlacesChanged}
                          options={searchBoxOptions}
                        >
                          <input
                            type="text"
                            className="text-center"
                            placeholder="Search for a city"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </StandaloneSearchBox>
                      </div>
                    </FormGroup>
                    <span
                      className="search__icon"
                      type="submit"
                      onClick={search}
                    >
                      <i className="ri-search-line"></i>
                    </span>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </LoadScript>

      {loading ? (
        <Spinner />
      ) : (
        <Container>
          <Row className="mt-2 ml-3 mr-3">
            {results.length > 0 && (
              <Col>
                <h2 className="text-center mb-3">Attractions</h2>
                <Carousel
                  className="ml-3 mr-3"
                  responsive={responsive}
                  infinite={true}
                >
                  {renderCards(results, "attractions")}
                </Carousel>
              </Col>
            )}
          </Row>
          <Row className="mt-2">
            {hotels.length > 0 && (
              <Col>
                <h2 className="text-center mb-3">Hotels</h2>
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  className={styles.carousel}
                >
                  {renderCards(hotels, "hotels")}
                </Carousel>
              </Col>
            )}
          </Row>
          <Row className="mt-2">
            {restaurants.length > 0 && (
              <Col>
                <h2 className="text-center mb-3">Restaurants</h2>
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  className={styles.carousel}
                >
                  {renderCards(restaurants, "restaurants")}
                </Carousel>
              </Col>
            )}
          </Row>
        </Container>
      )}
    </>
  );
};

export default AttractionList;
