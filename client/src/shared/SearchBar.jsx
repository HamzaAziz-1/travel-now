import { useRef, useState } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
import { BASE_URL } from "../utils/config";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchBar = () => {
  const maxGroupSizeRef = useRef(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);
  const searchBoxOptions = {
    types: ["(cities)"],
  };
 const { isLoaded } = useLoadScript({
   googleMapsApiKey: apiKey,
   libraries: ["places"],
 });
  const searchHandler = async () => {
    const maxGroupSize = maxGroupSizeRef.current.value;

   const cityPattern = /^[A-Za-z\s]+$/;

    if (query === "" || maxGroupSize === "") {
      return toast.error("All fields are required!");
    }
    if (!cityPattern.test(query) || query.length<4) {
      return toast.error("Enter a valid city name");
    }
    if (maxGroupSize <= 0 || maxGroupSize > 4) {
      return toast.error("Group size should be between 1 and 4");
    }

    const res = await fetch(
      `${BASE_URL}/tours/search/getTourBySearch?city=${query}&maxGroupSize=${maxGroupSize}`
    );

    if (!res.ok) {
      return toast.error(res.data.msg ? res.data.msg : "Something went wrong");
    }

    const result = await res.json();

    navigate(`/tours/search?city=${query}&maxGroupSize=${maxGroupSize}`, {
      state: {
        data: result.data,
        totalCount: result.totalCount,
        maxGroupSize: maxGroupSize,
        query: query,
      },
    });
  };

  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) {
      return;
    }

    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const addressComponents = places[0].address_components;
      let cityName = "";

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
      }

      if (cityName) {
        setQuery(cityName);
      }
    }
  };
  if (!isLoaded) {
    return <Spinner/>
  }

  return (
    // <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <Col lg="12">
        <div className="search__bar mx-auto">
          <Form className="d-flex align-items-center gap-2">
            <FormGroup className="d-flex gap-2 form__group">
              <span>
                <i className="ri-map-pin-line"></i>
              </span>
              <div className="flex-grow-1">
                <h6 className="text-center">Location</h6>
                <StandaloneSearchBox
                  ref={searchBoxRef}
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlacesChanged}
                  options={searchBoxOptions}
                >
                  <input
                    type="text"
                    className="form-control text-center shadow-none"
                    placeholder="Search for a city"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </StandaloneSearchBox>
              </div>
            </FormGroup>

            <FormGroup className="d-flex gap-2 form__group">
              <span>
                <i className="ri-group-line"></i>
              </span>
              <div className="flex-grow-1">
                <h6>Max People</h6>
                <input
                  type="number"
                  className="form-control shadow-none"
                  placeholder="0"
                  ref={maxGroupSizeRef}
                />
              </div>
            </FormGroup>

            <span className="search__icon" onClick={searchHandler}>
              <i className="ri-search-line"></i>
            </span>
          </Form>
        </div>
      </Col>
    // </LoadScript>
  );
};

export default SearchBar;
