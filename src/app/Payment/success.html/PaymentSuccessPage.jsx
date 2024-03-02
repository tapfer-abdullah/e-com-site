"use client";
import React, { useEffect } from "react";

const PaymentSuccessPage = () => {
  console.log(window.location?.search);
  const urlParams = new URLSearchParams(window.location?.search);
  const payment_intent = urlParams.get("payment_intent");
  const payment_intent_client_secret = urlParams.get("payment_intent_client_secret");

  console.log(payment_intent);

  return (
    <div>
      <h3>Payment successful</h3>
      <p>Transaction ID: {payment_intent}</p>
    </div>
  );
};

export default PaymentSuccessPage;
