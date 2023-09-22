import { Row, Col, Container } from "react-bootstrap";
const Spinner = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} className="text-center">
          <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Spinner;
