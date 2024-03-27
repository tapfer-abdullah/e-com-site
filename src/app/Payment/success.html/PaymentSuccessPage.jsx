"use client";
import { OrderStateProvider } from "@/Components/State/OrderState";
import { axiosHttp } from "@/app/helper/axiosHttp";
// import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
  const { customer, setCustomer } = useContext(OrderStateProvider);
  const [payment_intent, setPayment_intent] = useState("");
  // const router = useRouter();
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [orderID, setOrderID] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(window.location?.search);
      const urlParams = new URLSearchParams(window.location?.search);
      const payment_intent = urlParams.get("payment_intent");
      const payment_intent_client_secret = urlParams.get("payment_intent_client_secret");
      setPayment_intent(payment_intent);
      setEmail(urlParams.get("email"));
      setOrderID(urlParams.get("orderID"));

      const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
      let cardID = localStorage.getItem("obs-card-id");

      // console.log({ clientSecret, email, orderID });

      if (clientSecret && email && orderID) {
        setPaymentIntentClientSecret(clientSecret);
        axiosHttp
          .post(`/payment/success?client_secret=${payment_intent}`, { email, orderID, cardID, payment_method: "Card" })
          .then((response) => {
            console.log(response.data);

            axiosHttp.post("/confirmationMail", { cardID, orderID: customer?.orderID }).then((res) => {
              toast.success("Order confirmation mail has been sended!");
              console.log(res.data);
            });

            localStorage.setItem("obs-card-id", "undefined");
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
  }, [orderID, email]);

  //   console.log(payment_intent);

  return (
    <div>
      <h3>Payment successful</h3>
      <p>Transaction ID: {payment_intent}</p>
      <p>Order Number: {orderID}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default PaymentSuccessPage;
