import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    // console.log({ clientSecret });

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          {
            console.log({ success: paymentIntent });
            setMessage("Payment succeeded!");
          }
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  // console.log({ elements });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      payment_method: {
        billing_details: {
          name: "John Doe", // Replace with the actual name
          email: "john.doe@example.com", // Replace with the actual email
          address: {
            line1: "123 Main St", // Replace with the actual address
            city: "City", // Replace with the actual city
            postal_code: "12345", // Replace with the actual postal code
            country: "US", // Replace with the actual country code
          },
          phone: "+1234567890", // Replace with the actual phone number
        },
      },
      confirmParams: {
        // return_url: `http://localhost:3000/Payment/success.html`,
        return_url: `https://odbhootstore.vercel.app/Payment/success.html`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // console.log({ success: paymentIntent });
      setMessage("Payment succeeded!");
    } else {
      setMessage("Something went wrong.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
