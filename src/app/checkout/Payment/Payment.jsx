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
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckoutForm";

import ReactHtmlParser from "react-html-parser";

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

const Payment = ({ cusInfo, total, discountCode }) => {
  const { dataForBxGy, cartData, finalCartData, customer, setCustomer } = useContext(OrderStateProvider);
  const router = useRouter();
  // const [expanded, setExpanded] = React.useState("panel2");
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setErrorMessage("");
    setExpanded(newExpanded ? panel : false);
  };

  const { address, apartment, city, country, email, firstName, lastName, phoneNumber, postalCode, shipping, tips } = cusInfo;
  console.log({ discountedAmount: cusInfo.discountedAmount });

  const [errorMessage, setErrorMessage] = useState("");
  const [cardType, setCardType] = useState(null);
  const [clientSecret, setClientSecret] = React.useState("");

  //-----------------------------------
  //          stripe payment          |
  // ----------------------------------
  console.log({ expanded });
  React.useEffect(() => {
    if (expanded == "panel1" || expanded == "panel2") {
      if (!address || !apartment || !city || !country || !email || !firstName || !lastName || !postalCode) {
        setExpanded("");
        setErrorMessage("Please the provide delivery info before payment");
        Swal.fire({
          title: "Form is incomplete!",
          text: "Please the provide delivery info before payment",
          icon: "warning",
        });
        return;
      }

      // console.log({ expanded });
      if (expanded !== "panel1") {
        // console.log({ expanded }, " inside if..");
        return;
      }

      // update customer info and card data
      axiosHttp.post("/checkout/abandoned", { cusInfo, cart: finalCartData, discountCode }).then((res) => {
        // console.log(res.data, res.data?.data?.result1?._id);
        // console.log(res.data);

        cusInfo.orderID = res?.data?.data?.orderIDOfDB;
        localStorage.setItem("obs-card-id", res.data?.data?.result1?._id);
        setCustomer({ ...customer, email: email, orderID: res?.data?.data?.orderIDOfDB });
      });

      axiosHttp
        .post("/payment/stripe-payment-intent", { customer, personalInfo: cusInfo, dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } })
        .then((data) => {
          setClientSecret(data.data.clientSecret);
          // console.log(data.data.clientSecret);
        })
        .catch((error) => {
          console.log({ error });
          setErrorMessage(error?.message || "Error occur during payment!");
        });
    }
  }, [expanded, dataForBxGy, discountCode, total, address, apartment, city, country, email, firstName, lastName, postalCode, cusInfo]);

  React.useEffect(() => {
    setExpanded("");
    setClientSecret("");
  }, [discountCode, errorMessage]);

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

  const createOrder = async (data, actions) => {
    console.log("paypal.....");
    // console.log({ dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } });

    axiosHttp.post("/checkout/abandoned", { cusInfo, cart: finalCartData, discountCode }).then((res) => {
      // console.log(res.data, res.data?.data?.result1?._id);
      console.log(res.data);

      cusInfo.orderID = res?.data?.data?.orderIDOfDB;
      localStorage.setItem("obs-card-id", res.data?.data?.result1?._id);
      setCustomer({ ...customer, email: email, orderID: res?.data?.data?.orderIDOfDB });
    });

    return fetch("https://osthirchoice.vercel.app/api/payment/paypal/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } }),
    })
      .then((response) => response.json())
      .then((order) => {
        console.log({ order });
        return order.id;
      })
      .catch((error) => {
        console.log({ error });
        setErrorMessage(error?.message || "Error occur during payment!");
      });

    // axiosHttp.post("/payment/paypal/create-paypal-order", { dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } }).then((response) => {
    //   console.log({ order: response.data });
    //   return response?.data?.id;
    // });
  };

  const onApprove = async (data, actions) => {
    return fetch("https://osthirchoice.vercel.app/api/payment/paypal/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((response) => response.json())
      .then((details) => {
        const { payer, id } = details;
        // console.log({ payer, details });

        if (details?.status == "COMPLETED") {
          toast.success("Payment Successful.");
          setPaypalSuccess(true);
          let cardID = localStorage.getItem("obs-card-id");

          axiosHttp
            .patch(`/payment/success`, { email, orderID: customer?.orderID, cardID, payment_method: "PayPal" })
            .then((response) => {
              console.log(response.data);

              axiosHttp.post("/confirmationMail", { cardID, orderID: customer?.orderID }).then((res) => {
                toast.success("Order confirmation mail has been sended!");
                console.log(res.data);
              });

              localStorage.setItem("obs-card-id", "undefined");
              router.push(`https://osthirchoice.vercel.app/Payment/success.html?payment_intent=${id}&email=${payer?.email_address}`);

              // axiosHttp.post("/confirmationMail", { dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } }).then((res) => {
              //   console.log(res.data);
              // });
            })
            .catch((error) => {
              console.error("Error fetching payment details from Stripe:", error);
            });

          // axiosHttp.post("/confirmationMail", { dataForBxGy, shipping, tips, discountCode }).then((res) => {
          // axiosHttp.post("/confirmationMail", { dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } }).then((res) => {
          //   console.log(res.data);
          // });
        }

        // router.push(`https://osthirchoice.vercel.app/Payment/success.html?payment_intent=${id}&email=${payer?.email_address}`);
      })
      .catch((error) => {
        console.log({ error });
        setErrorMessage(error?.message || "Error occur during payment!");
      });
  };

  const initialOptions = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const [mailData, setMailData] = useState("");
  const sendMail = async () => {
    const response = await axiosHttp.post("/confirmationMail", { dataForBxGy, shipping, tips, discountCode, email, selectedCountry: { label: country } });

    setMailData(response.data?.htmlDataForMail);
    console.log(response.data);
  };

  return (
    <>
      <div className=" mb-5">
        <h4 className="text-xl font-semibold mt-7 mb-1 ">Payment</h4>
        <p className="mb-2">All transactions are secure and encrypted.</p>
        {errorMessage && (
          <div className="flex justify-start items-center px-2 py-3 gap-2 mb-4 bg-red-50 rounded-md">
            <MdErrorOutline className="text-red-400 text-3xl" />
            {/* <p className="text-sm">Your card was declined. Try again or use a different payment method.</p> */}
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
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
      {/* <div>
          <button onClick={sendMail} className="bg-green-500 p-3 rounded-lg">
            Send Mail
          </button>
        </div>
      <div className="border-2 p-3">{ReactHtmlParser(mailData)}</div> */}
    </>
  );
};

export default Payment;
