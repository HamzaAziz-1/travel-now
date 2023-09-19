const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const capturePayment = async (paymentIntentId) => {
    console.log(paymentIntentId,"id:  ")
    try {
    // Use the Stripe API to capture the payment
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId); 
      return paymentIntent;
  } catch (error) {
    // Handle any errors that occur during payment capture
    console.error("Payment capture error:", error);
    throw error;
  }
};

module.exports = capturePayment ;
