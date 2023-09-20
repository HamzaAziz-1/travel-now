import { Row, Col } from "react-bootstrap";
const Spinner = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={12} className="text-center">
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Col>
    </Row>
  );
};
export default Spinner;
