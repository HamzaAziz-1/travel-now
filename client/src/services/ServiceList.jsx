import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";

const servicesData = [
  {
    imgUrl: weatherImg,
    title: "View Top Attractions",
    desc: "Get top attractions in your destination.",
  },
  {
    imgUrl: guideImg,
    title: "Tour Packages",
    desc: "Get best Tour Vendors for your tour.",
  },
  {
    imgUrl: customizationImg,
    title: "Online Payment",
    desc: "Pay online and secure your payments.",
  },
];

const ServiceList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
