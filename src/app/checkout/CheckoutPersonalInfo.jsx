"use client";
import TextField from "@mui/material/TextField";
// import Select from "react-select";
import "./Checkout.css";

import { OrderStateProvider } from "@/Components/State/OrderState";
import { Autocomplete, Avatar, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, { useContext, useEffect, useState } from "react";
import { MdOutlineEuroSymbol } from "react-icons/md";
import Payment from "./Payment/Payment";

// import PreviewPage from "./Payment/Payment2";

const CheckoutPersonalInfo = ({ setTips, subTotal, selectedCountry, setSelectedCountry, setEmail, email }) => {
  const { allCountryData } = useContext(OrderStateProvider);
  const [tip, setTip] = useState(null);
  const [tipValue, setTipValue] = useState(null);

  const handleTips = (event, newTip) => {
    setTip(newTip);
    setTips((subTotal * newTip) / 100);
    setTipValue("");
  };

  const handleCustomTips = () => {
    if (tipValue > 0) {
      setTip(null);
      setTips(parseFloat(tipValue));
    }
  };

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
  };

  // const handleCustomTips = (e) => {
  //   // e.preventDefault();
  //   // const tip = e.target.customTip.value || 0;
  //   setTips(parseFloat(tip));
  // };

  return (
    <form className="px-8 overflow-y-scroll max-h-[100vh] no-scrollbar">
      {/* <form className="px-8 "> */}
      <div className="space-y-2">
        <div className="flex justify-between items-center my-2">
          <h4 className="text-xl font-semibold">Contact</h4>
          <div className="flex items-center gap-1">
            <p>Have an account?</p>
            <p className="underline text-blue-500">Login</p>
          </div>
        </div>

        <div className="relative">
          <TextField
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            type="email"
            name="email"
            id="email"
            className="rounded-md w-full border-2 h-auto"
            // label={!email && "Email"}
            placeholder="Email"
          />
          {email && <p className="absolute -top-[10px] left-4 px-1 text-sm bg-white text-gray-500">Email *</p>}
        </div>
        <div className="flex items-center gap-2">
          <input defaultChecked={true} type="checkbox" name="checkedEmail" id="checkedEmail" />
          <label htmlFor="checkedEmail">Email me with news and offers</label>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <h4 className="text-xl font-semibold">Delivery Information</h4>
        <div className="relative checkout-country-div">
          <Autocomplete
            options={allCountryData}
            getOptionLabel={(option) => option.label}
            style={{ width: "100%" }}
            value={selectedCountry}
            onChange={handleCountryChange}
            renderInput={(params) => <TextField {...params} label="Country / Region" variant="outlined" />}
            renderOption={(props, option) => (
              <MenuItem key={option?.id} {...props}>
                <Avatar src={option.imageUrl} alt={option.label} />
                <span style={{ marginLeft: "8px" }}>{option.label}</span>
              </MenuItem>
            )}
          />
          {selectedCountry && <img src={selectedCountry?.imageUrl} alt="country-img" className="absolute top-4 left-2 w-10" />}
        </div>

        <div className="flex items-center gap-2">
          <TextField required type="text" name="firstName" id="firstName" className="rounded-md w-full border-2 " label="First name" />
          <TextField required type="text" name="lastName" id="lastName" className="rounded-md w-full border-2 " label="Last name" />
        </div>
        <TextField required type="text" name="address" id="address" className="rounded-md w-full border-2" label="Address" />
        <TextField required type="text" name="apartment" id="apartment" className="rounded-md w-full border-2" label="Apartment / suite / etc." />
        <div className="flex items-center gap-2">
          <TextField required type="text" name="postalCode" id="postalCode" className="rounded-md w-full border-2 " label="Postal code" />
          <TextField required type="text" name="city" id="city" className="rounded-md w-full border-2 " label="City" />
        </div>
        <TextField type="text" name="address" id="address" className="rounded-md w-full border-2" label="Phone number" />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" name="saveInfo" id="saveInfo" />
        <label htmlFor="saveInfo">Save this information for next time</label>
      </div>
      <h4 className="text-xl font-semibold mt-7 mb-2 ">Shipping method</h4>
      <div className="flex justify-between items-center p-3 bg-[#d3e3fd] rounded-md">
        <p>Standard</p>
        <p>Free</p>
      </div>

      <Payment />

      <h4 className="text-xl font-semibold mt-7 mb-2 ">Add tip</h4>
      <div className="border border-[#d0d0d0] rounded-md ">
        <p className="p-3 border-b border-[#d0d0d0]">Show your support for the team at ODBHOOTSTORE</p>
        <div className="bg-[#f5f5f5] p-4 space-y-3">
          <ToggleButtonGroup value={tip} exclusive onChange={handleTips} aria-label="tips" className="w-full mx-auto font-semibold">
            <ToggleButton className={`${tip == 5 ? "!bg-black !text-white" : ""} w-1/4 !text-lg !font-medium !text-black`} value="5" aria-label="tip5">
              5%
            </ToggleButton>
            <ToggleButton className={`${tip == 10 ? "!bg-black !text-white" : ""} w-1/4 !text-lg !font-medium !text-black`} value="10" aria-label="tip10">
              10%
            </ToggleButton>
            <ToggleButton className={`${tip == 15 ? "!bg-black !text-white" : ""} w-1/4 !text-lg !font-medium !text-black`} value="15" aria-label="tip15">
              15%
            </ToggleButton>
            <ToggleButton className={`${tip == 0 ? "!bg-black !text-white" : ""} w-1/4 !text-lg !font-medium !text-black`} value="0" aria-label="tip0">
              None
            </ToggleButton>
          </ToggleButtonGroup>

          <div className="relative mt-7">
            <MdOutlineEuroSymbol className="absolute left-2 top-[13px]" />
            <input
              onChange={(e) => setTipValue(e.target.value || 0)}
              value={tipValue}
              min={1}
              type="number"
              name="customTip"
              id=""
              placeholder="Custom tip"
              className="border-2 border-[#e7e7e7] p-2 pl-7 pr-20 w-full outline-[#e7e7e7] outline-4"
            />
            <button
              type="button"
              onClick={handleCustomTips}
              className="absolute top-0 right-0 bg-[#d0d0d0] hover:bg-opacity-90 transition-all duration-300 text-black font-semibold p-2 border-2 border-[#d0d0d0]"
            >
              Add tip
            </button>
          </div>

          <p>Thank you, we appreciate it.</p>
        </div>
      </div>
      <button className="text-xl text-white font-semibold p-2 my-5 w-full bg-black rounded-md hover:bg-opacity-70 transition-all duration-300">Pay Now</button>
    </form>
  );
};

export default CheckoutPersonalInfo;
