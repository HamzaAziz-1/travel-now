import { useRef, useState } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];
const SearchBar = () => {
  const maxGroupSizeRef = useRef(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);
  const searchBoxOptions = {
    types: ["(cities)"],
  };

  const searchHandler = async () => {
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (query === "" || maxGroupSize === "") {
      return alert("All fields are required!");
    }

    const res = await fetch(
      `/api/v1/tours/search/getTourBySearch?city=${query}&maxGroupSize=${maxGroupSize}`
    );

    if (!res.ok) alert("Something went wrong");

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

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <Col lg="12">
          <div className="search__bar mx-auto">
            <Form className="d-flex align-items-center gap-2">
              <FormGroup className="d-flex gap-3 form__group form__group-fast">
                <span>
                  <i className="ri-map-pin-line"></i>
                </span>
                <div>
                  <h6 className="text-center">Location</h6>

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

              <FormGroup className="d-flex gap-3 form__group form__group-last">
                <span>
                  <i className="ri-group-line"></i>
                </span>
                <div>
                  <h6>Max People</h6>
                  <input type="number" placeholder="0" ref={maxGroupSizeRef} />
                </div>
              </FormGroup>

              <span
                className="search__icon"
                type="submit"
                onClick={searchHandler}
              >
                <i className="ri-search-line"></i>
              </span>
            </Form>
          </div>
        </Col>
      </LoadScript>
    </>
  );
};

export default SearchBar;
