/* eslint-disable react/no-unescaped-entities */
"use client";

import { axiosHttp } from "@/app/helper/axiosHttp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useContext, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
// import CheckoutForm from "./CheckoutForm";
import "./commonCss.css";

import { OrderStateProvider } from "@/Components/State/OrderState";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckoutForm";

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  //   borderTopRightRadius: "5px",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => {
  const { children, expandIcon, collapseIcon, ...other } = props;
  const isExpanded = props["aria-expanded"];

  return (
    <MuiAccordionSummary className="relative" {...other}>
      {children}
    </MuiAccordionSummary>
  );
})(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
    "& > *": {
      display: "none", // Hide the default icon when custom icon is used
    },
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
    },
  ],
};

const Payment = ({ cusInfo, total }) => {
  const { dataForBxGy, cartData } = useContext(OrderStateProvider);
  const router = useRouter();
  // const [expanded, setExpanded] = React.useState("panel2");
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { address, apartment, city, country, discountCode, email, firstName, lastName, phoneNumber, postalCode, shipping, tips } = cusInfo;

  const [cardType, setCardType] = useState(null);
  const [clientSecret, setClientSecret] = React.useState("");

  //-----------------------------------
  //          stripe payment          |
  // ----------------------------------
  React.useEffect(() => {
    if (expanded == "panel1") {
      if (!address || !apartment || !city || !country || !email || !firstName || !lastName || !postalCode) {
        setExpanded("");
        Swal.fire({
          title: "Form is incomplete!",
          text: "Please the provide delivery info before payment",
          icon: "warning",
        });
        return;
      }

      axiosHttp.post("/payment/stripe-payment-intent", { cart: dataForBxGy, personalInfo: cusInfo, amount: total }).then((data) => {
        setClientSecret(data.data.clientSecret);
      });
    }
  }, [expanded, dataForBxGy, discountCode, total, address, apartment, city, country, email, firstName, lastName, postalCode, cusInfo]);

  React.useEffect(() => {
    setExpanded("");
    setClientSecret("");
  }, [total]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  //-----------------------------------
  //          PayPal payment          |
  // ----------------------------------

  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [paypalOrderID, setPaypalOrderID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createOrder = (data, actions) => {
    let cartArray = [];

    dataForBxGy.forEach((item) => {
      data = {
        reference_id: item.sku,
        description: item.name,
        amount: {
          currency_code: "USD",
          value: item.price + 10.0,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: item.price,
            },
            shipping: {
              currency_code: "USD",
              value: "10.00",
            },
            discount: {
              currency_code: "USD",
              value: "0.00",
            },
            handling: {
              currency_code: "USD",
              value: "0.00", // Handling fee (tips)
            },
          },
        },
        address: {
          address_line_1: "123 Shipping St",
          admin_area_2: "City",
          admin_area_1: "State",
          postal_code: "12345",
          country_code: "US",
        },
      };
      cartArray.push(data);
    });

    return actions.order
      .create({
        purchase_units: cartArray,
        //   shipping_preference: "NO_SHIPPING", // Use this to hide shipping information
        application_context: {
          shipping_preference: "GET_FROM_FILE",
          user_action: "PAY_NOW",
          brand_name: "ODBHOOTSTORE",
          return_url: `http://localhost:3000/Payment/success.html?orderNumber=${paypalOrderID}`,
          cancel_url: "https://example.com/cancel",
        },
      })
      .then((orderID) => {
        console.log({ orderID });
        setPaypalOrderID(orderID);
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const { payer, id } = details;
      console.log({ payer, details });
      setPaypalSuccess(true);
      // router.push(`http://localhost:3000/Payment/success.html?payment_intent=${id}&email=${payer?.email_address}`);
      router.push(`https://odbhootstore.vercel.app/Payment/success.html?payment_intent=${id}&email=${payer?.email_address}`);
    });
  };

  // const createOrder = async (data, actions) => {
  //   console.log("create...", { actions });
  //   // Order is created on the server and the order id is returned
  //   return fetch("http://localhost:3000/api/payment/paypal/create-paypal-order", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // use the "body" param to optionally pass additional order information
  //     // like product skus and quantities
  //     body: JSON.stringify({
  //       cart: [
  //         {
  //           sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
  //           quantity: "YOUR_PRODUCT_QUANTITY",
  //         },
  //       ],
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((order) => {
  //       console.log({ order });
  //       return order.id;
  //     });
  // };
  // const onApprove = async (data, actions) => {
  //   console.log("capture...");
  //   // Order is captured on the server and the response is returned to the browser
  //   return fetch("http://localhost:3000/api/payment/paypal/capture-paypal-order", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       orderID: data.orderID,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((details) => {
  //       const { payer } = details;
  //       console.log({ payer, details });
  //       setPaypalSuccess(true);
  //     });
  // };

  const initialOptions = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className=" mb-5">
      <h4 className="text-xl font-semibold mt-7 mb-1 ">Payment</h4>
      <p className="mb-2">All transactions are secure and encrypted.</p>
      <div className="flex justify-start items-center px-2 py-3 gap-2 mb-4 bg-red-50 rounded-md">
        <MdErrorOutline className="text-red-400 text-3xl" />
        <p className="text-sm">Your card was declined. Try again or use a different payment method.</p>
      </div>
      <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} className="!bg-[#f5f5f5]">
        <AccordionSummary className="!bg-[white]" aria-controls="panel1d-content" id="panel1d-header">
          <div className="w-full flex justify-between items-center">
            <Typography className="font-semibold">
              {expanded === "panel1" ? (
                <RadioButtonCheckedIcon sx={{ fontSize: "1rem" }} className="text-blue-500 mr-1" />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: "1rem" }} className="text-blue-500 mr-1" />
              )}
              Credit card
            </Typography>
            {cardType ? (
              <>
                <div className="flex items-center gap-1">
                  <img src={"https://i.ibb.co/mBxkzz4/visa.png"} alt="Visa Icon" className={`w-10 h-auto px-[2px] py-[1px] bg-white ${cardType === "visa" ? "opacity-100" : "opacity-40"}`} />
                  <img
                    src={"https://i.ibb.co/QprC3LG/master.webp"}
                    alt="Master Icon"
                    className={`w-10 h-auto px-[2px] py-[1px] bg-white ${cardType === "mastercard" ? "opacity-100" : "opacity-40"}`}
                  />
                  <img
                    src={"https://i.ibb.co/2kCgmpH/amex5.png"}
                    alt="Amex Icon"
                    className={`w-10 h-auto px-[2px] py-[1px] bg-white rounded-md ${cardType === "amex" ? "opacity-100" : "opacity-40"}`}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <img src={"https://i.ibb.co/mBxkzz4/visa.png"} alt="Visa Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white " />
                <img src={"https://i.ibb.co/QprC3LG/master.webp"} alt="Master Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white " />
                <img src={"https://i.ibb.co/2kCgmpH/amex5.png"} alt="Amex Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white rounded-md" />
              </div>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="AppWrapper">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} cusInfo={cusInfo} data={{ cardType, setCardType }} />
              </Elements>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")} className="!bg-[#f5f5f5]">
        <AccordionSummary className="!bg-[white]" aria-controls="panel2d-content" id="panel2d-header">
          <div className="w-full flex justify-between items-center">
            <Typography className="font-semibold">
              {expanded === "panel2" ? (
                <RadioButtonCheckedIcon sx={{ fontSize: "1rem" }} className="text-blue-500 mr-1" />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: "1rem" }} className="text-blue-500 mr-1" />
              )}
              PayPal
            </Typography>
            <img src={"https://i.ibb.co/smfbCX7/paypal.png"} alt="PayPal Icon" className="w-20 px-[2px] py-[1px] bg-white " />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="px-3 text-center">After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.</Typography>
        </AccordionDetails>
      </Accordion>
      {expanded === "panel2" && (
        <div className="py-5 border-t">
          <PayPalScriptProvider options={initialOptions} className="!z-[1]">
            <PayPalButtons
              style={{
                color: "blue",
                layout: "horizontal",
                label: "pay",
                height: 40,
                tagline: false,
              }}
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default Payment;
