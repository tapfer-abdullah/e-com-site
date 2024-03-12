"use client";
import { axiosHttp } from "@/app/helper/axiosHttp";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";

export default function CheckoutForm({ cusInfo }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    console.log({ clientSecret });

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          {
            console.log({ success: paymentIntent });
            setMessage("Payment succeeded!");
            axiosHttp.post("/users/customer", dataForBxGy).then((res) => {
              console.log(res?.data);
            });
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
      confirmParams: {
        // return_url: window.location.href,
        return_url: `http://localhost:3000/Payment/success.html`,
        // return_url: `https://odbhootstore.vercel.app/Payment/success.html`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      axiosHttp.post("/users/customer", { status: "yes" }).then((res) => {
        console.log(res?.data);
      });

      console.log({ success: paymentIntent });
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
      <button disabled={isLoading || !stripe || !elements} id="submit" className="text-xl text-white font-semibold p-2 my-5 w-full bg-black rounded-md hover:bg-opacity-70 transition-all duration-300">
        {isLoading ? "Paying..." : "Pay now"}
      </button>
      {/* <button disabled={isLoading || !stripe || !elements} id="submit" className="text-xl text-white font-semibold p-2 my-5 w-full bg-black rounded-md hover:bg-opacity-70 transition-all duration-300">
        Pay Now
      </button> */}

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
