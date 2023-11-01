import { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import {Container,Row,Col} from "react-bootstrap";
import { BASE_URL } from "../../utils/config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Verify = () => {
  const [error, setError] = useState(false);
  const query = useQuery();

  const verifyToken = async () => {
    
    try {
      // eslint-disable-next-line
      const { data } = await axios.post(`${BASE_URL}/auth/verify-email`, {
        verificationToken: query.get('token'),
        email: query.get('email'),
      },{withCredentials:true});
    } catch (error) {

      setError(true);
    }
   
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line
  }, []);


  if (error) {
    return (
      <Container className='page'>
        <h4>There was an error, please double check your verification link </h4>
      </Container>
    );
  }

  return (
    <section>
      <Container className='mt-5 pt-5'>
        <Row>
          <Col>
            <h2 className='mt-5 pt-5'>Account Confirmed</h2>
            {console.log(query.get('email'))}
      <Link to='/login' className='btn'>
        Please login
            </Link>
            <Navigate to={'/login'}/>
          </Col>
        </Row>
    </Container>
    </section>
  );
};


export default Verify;
