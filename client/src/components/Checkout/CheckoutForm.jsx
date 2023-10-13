// CheckoutForm.jsx
import { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  
} from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/checkout-form.css";

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchClientSecret = async () => {
      const { clientSecret, order } = location.state;
      if (!clientSecret) {
        setErrorMessage("Could not fetch client secret.");
        return;
      }
      setClientSecret(clientSecret);
      setOrder(order)
    };

    fetchClientSecret();
  }, [location.state]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setPaymentProcessing(false);
    } else {
      if (result?.paymentIntent) {
        handlePaymentSuccess(result?.paymentIntent?.id);
      }
    }
  };

  const handlePaymentSuccess = (paymentIntentId) => {
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    setTimeout(() => {
      navigate("/thank-you", {
        state: {
          message: "Payment successful! Thank you for your purchase.",
          order: order,
          paymentIntentId,
        },
      });
    }, 2000);
  };

  return (
    <div className="checkout-form mt-5 pt-5 mb-5 pb-5">
      <h1 className="py-3">Checkout</h1>
      <h3>Total: {order.total}{ " "} PKR</h3>
      <form onSubmit={handleSubmit} className="my-3" >
        <CardElement />
        <button className="my-3" disabled={!stripe || paymentProcessing}>
          {paymentProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {paymentSuccess && (
        <div className="success-message">
          Payment successful! Redirecting...
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
