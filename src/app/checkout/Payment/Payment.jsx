"use client";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import CheckoutForm from "./CheckoutForm";
import "./commonCss.css";

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

const AccordionSummary = styled((props) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
    },
  ],
};

export default function Payment() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [cardType, setCardType] = useState(null);

  return (
    <div>
      <h4 className="text-xl font-semibold mt-7 mb-1 ">Payment</h4>
      <p className="mb-2">All transactions are secure and encrypted.</p>
      <div className="flex justify-start items-center px-2 py-3 gap-2 mb-4 bg-red-50 rounded-md">
        <MdErrorOutline className="text-red-400 text-3xl" />
        <p className="text-sm">Your card was declined. Try again or use a different payment method.</p>
      </div>
      <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} className="!bg-[#f5f5f5]">
        <AccordionSummary className="!bg-[white]" aria-controls="panel1d-content" id="panel1d-header">
          <div className="w-full flex justify-between items-center">
            <Typography className="font-semibold">Credit card</Typography>
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
            <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
              {/* calling checkout form */}
              <CheckoutForm data={{ cardType, setCardType }} />
            </Elements>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")} className="!bg-[#f5f5f5]">
        <AccordionSummary className="!bg-[white]" aria-controls="panel2d-content" id="panel2d-header">
          <div className="w-full flex justify-between items-center">
            <Typography className="font-semibold">PayPal</Typography>
            <img src={"https://i.ibb.co/smfbCX7/paypal.png"} alt="PayPal Icon" className="w-20 px-[2px] py-[1px] bg-white " />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="px-3 text-center">After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
