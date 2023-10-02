import "../styles/home.css";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import heroImg from "../assets/images/hero-img01.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import heroImg02 from "../assets/images/hero-img02.jpg";
import experienceImg from "../assets/images/hero11.jpg";
import Button from "react-bootstrap/Button";
import Subtitle from "./../shared/Subtitle";

import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from "../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";


const Home = () => {
  
  return (
    <>
      {/* ========== hero section start =========== */}
      <section>
        <Container>
          <Row>
            <Col lg="6" >
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center ">
                  <Subtitle subtitle={"Discover Before You GO"} />
                </div>
                <h1>
                  Unleash the Magic of 
                  <span className="highlight"> Unforgettable </span>
                  Tours
                </h1>
                <p>
                  We help travelers to discover the best attractions of their
                  destination and plan tours with ease. We offer
                  comprehensive tour packages, and our user-friendly booking
                  system allows customers to quickly book a tour package led by
                  experienced vendors.
                </p>
              </div>
              <div className="search-top-attractions text-center">
                <h3>Looking for Top Attractions?</h3>
                <p>Discover the best attractions in your destination.</p>
                <Link to={"/search/spots"}>
                  <Button
                    style={{ color: "white", backgroundColor: "#f87613" }}
                    className="text-center"
                    variant="warning"
                  >
                    Explore Now
                  </Button>
                </Link>
              </div>
            </Col>

            <Col className="mt-5 pt-3" lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>
            <Col lg="2" className="mt-5 pt-3">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls />
              </div>
            </Col>
            <Col lg="2" className="mt-5 pt-3">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>
            <div className="search-guided-tours mt-3">
              <h3>Search for Tour Packages</h3>
            </div>
            <SearchBar />
          </Row>
        </Container>
      </section>
      {/* ========== hero section start =========== */}
      <section>
        <Container>
          <Row>
            <Col lg="3" className="my-auto">
              <h5 className="services__subtitle">Our Services</h5>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* ============ featured tour section start ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>
      {/* ============ featured tour section end ============ */}

      {/* ============ experience section start ============= */}
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Experience"} />
                <h2>
                  Discover Unforgettable Experiences <br /> Tailored Just for
                  You
                </h2>
                <p>
                  At our travel agency, we are dedicated to curating
                  extraordinary experiences that will leave you spellbound. With
                  our extensive knowledge and passion for travel, we have
                  crafted a diverse range of tours that cater to every
                  traveler a unique preferences. Whether you crave thrilling
                  adventures, cultural immersions, or serene retreats, our
                  expert tour companies will take you on a journey of a lifetime.
                  We meticulously handpick the top attractions of each
                  destination, ensuring that you uncover hidden gems and create
                  cherished memories.
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5 ">
                <div className="counter__box ">
                  <span>3+</span>
                  <h6>Years experience</h6>
                </div>
                <div className="counter__box ">
                  <span>100+</span>
                  <h6>Professional Tour Vendors</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ============ experience section end ============= */}

      {/* ============ gallery section start =============== */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      {/* ============ gallery section end =============== */}

      {/* ============ testimonial section start ========== */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Fans Love"} />
              <h2 className="testimonial__title">Testimonials</h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
      {/* ============ testimonial section end ========== */}
      <Newsletter />
    </>
  );
};

export default Home;
