import { CardCvcElement, CardExpiryElement, CardNumberElement, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#87bbfd",
      },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

const CardField = () => {
  const stripe = useStripe();
  const [cardError, setCardError] = useState(null);
  const [cardType, setCardType] = useState(null);
  console.log({ cardType });

  const handleCardChange = (e) => {
    setCardError(e.error ? e.error.message : null);

    // Detect card type
    if (e.complete && e.brand) {
      setCardType(e.brand);
    }
  };

  useEffect(() => {
    const cardNumberElement = stripe?.elements().getElement("cardNumber");

    // Attach event listener to update card type
    const handleCardTypeChange = (event) => {
      setCardType(event.brand);
    };

    if (cardNumberElement) {
      cardNumberElement.on("change", handleCardTypeChange);

      return () => {
        cardNumberElement.off("change", handleCardTypeChange);
      };
    }
  }, [stripe]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="cardNumber" className="text-sm text-gray-600">
          Card Number
        </label>
        <CardNumberElement options={CARD_OPTIONS} onChange={handleCardChange} id="cardNumber" className="mt-1 p-2 border rounded" />
        {cardError && <p className="text-red-500 text-xs mt-1">{cardError}</p>}
        {cardType && (
          <div id="card-type" className="mt-1">
            {/* Display card icon based on cardType */}
            {cardType === "visa" && <img src="/visa-icon.png" alt="Visa Icon" className="w-6 h-6" />}
            {cardType === "mastercard" && <img src="/mastercard-icon.png" alt="Mastercard Icon" className="w-6 h-6" />}
            {cardType === "amex" && <img src="/mastercard-icon.png" alt="Mastercard Icon" className="w-6 h-6" />}
            {cardType === "discover" && <img src="/mastercard-icon.png" alt="Mastercard Icon" className="w-6 h-6" />}
            {/* Add more card types as needed */}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="cardName" className="text-sm text-gray-600">
          Cardholder Name
        </label>
        <input id="cardName" className="mt-1 p-2 border rounded" type="text" placeholder="John Doe" required autoComplete="cardholder" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="cardExpiry" className="text-sm text-gray-600">
          Expiration Date
        </label>
        <CardExpiryElement options={CARD_OPTIONS.style} onChange={handleCardChange} id="cardExpiry" className="mt-1 p-2 border rounded" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="cardCvc" className="text-sm text-gray-600">
          CVC
        </label>
        <CardCvcElement options={CARD_OPTIONS.style} onChange={handleCardChange} id="cardCvc" className="mt-1 p-2 border rounded" />
      </div>
    </div>
  );
};

export default CardField;
