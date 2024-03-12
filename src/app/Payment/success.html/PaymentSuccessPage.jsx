"use client";
import { OrderStateProvider } from "@/Components/State/OrderState";
import { axiosHttp } from "@/app/helper/axiosHttp";
// import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const PaymentSuccessPage = () => {
  const { customer, setCustomer } = useContext(OrderStateProvider);
  const [payment_intent, setPayment_intent] = useState("");
  // const router = useRouter();
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(window.location?.search);
      const urlParams = new URLSearchParams(window.location?.search);
      const payment_intent = urlParams.get("payment_intent");
      const payment_intent_client_secret = urlParams.get("payment_intent_client_secret");
      setPayment_intent(payment_intent);
      setEmail(urlParams.get("email"));
      setOrderNumber(urlParams.get("orderNumber"));

      const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

      if (clientSecret && email && orderNumber) {
        setPaymentIntentClientSecret(clientSecret);
        axiosHttp
          // .get(`/payment/get-payment-details?client_secret=${payment_intent}`)
          .post(`/payment/success?client_secret=${payment_intent}`, { email, orderNumber })
          .then((response) => {
            console.log(response.data);
            // Send payment details to your server
          })
          .catch((error) => {
            console.error("Error fetching payment details from Stripe:", error);
          });
      }
      // else {
      //   console.error("Payment intent client secret not found in URL.");
      //   router.push("/"); // Redirect to home or an error page
      // }
    }
  }, [orderNumber, email]);

  //   console.log(payment_intent);

  return (
    <div>
      <h3>Payment successful</h3>
      <p>Transaction ID: {payment_intent}</p>
      <p>Order Number: {orderNumber}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default PaymentSuccessPage;
