import CheckoutForm from '../components/Checkout/CheckoutForm';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51LgC7gFqrQedZ2UeBLpm2gOPbhNpI8jCsucul03hNFkdGobn9LZoZA04WbjfaOnjqYu9F6mXl33lCfFkeOCu7e1500Q1mvNB7d"
);

function Checkout() {
    return (
      <div className="mt-5 pt-5 text-center">
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
      </div>
  );
}

export default Checkout;