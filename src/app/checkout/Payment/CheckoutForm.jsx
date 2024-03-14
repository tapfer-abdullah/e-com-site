"use client";
import { OrderStateProvider } from "@/Components/State/OrderState";
import { axiosHttp } from "@/app/helper/axiosHttp";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useContext } from "react";
import Swal from "sweetalert2";

export default function CheckoutForm({ cusInfo }) {
  const { customer, setCustomer } = useContext(OrderStateProvider);
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // console.log({ cusInfo });

  const { address, apartment, city, country, discountCode, email, firstName, lastName, phoneNumber, postalCode, shipping, tips } = cusInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !apartment || !city || !country || !email || !firstName || !lastName || !postalCode) {
      Swal.fire({
        title: "Form is incomplete!",
        text: "Please the provide delivery info before payment",
        icon: "warning",
      });
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://odbhootstore.vercel.app/Payment/success.html?orderNumber=${customer?.orderNumber}&email=${customer?.email}`,
        // return_url: `https://odbhootstore.vercel.app/Payment/success.html?orderNumber=${customer?.orderNumber}&email=${customer?.email}`,
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
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
