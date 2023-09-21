import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/esm/Button';
const Error = () => {
  return (
    <Container className='mt-5 pt-5' >
      <div className='text-center'>
        <h1>404</h1>
        <h4>Page Not Found</h4>
        <Link to='/home' className='btn'>
          <Button variant='info'>
            Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Error;
