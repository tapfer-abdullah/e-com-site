"use client";
import { OrderStateProvider } from "@/Components/State/OrderState";
import { Autocomplete, Avatar, Box, MenuItem, Modal, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { axiosHttp } from "../helper/axiosHttp";
import CheckoutPersonalInfo from "./CheckoutPersonalInfo";
import CheckoutProductsInfo from "./CheckoutProductsInfo";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CheckoutPage = () => {
  const { customer, cartData, setCustomer, dataForBxGy, promoCode, setPromoCode, allCountryData, finalCartData, setFinalCartData } = useContext(OrderStateProvider);
  const [tip, setTip] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [disError, setDisError] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  const [discountType, setDiscountType] = useState("");
  const [disAdditionalType, setDisAdditionalType] = useState("");
  // buy x get y
  const [BxGyCartArray, setBxGyCartArray] = useState([]);

  const [discountInput, setDiscountInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [shipping, setShipping] = useState("");
  const [shippingAmount, setShippingAmount] = useState(10);
  const [shippingReqAmount, setShippingReqAmount] = useState(0);

  // customer info..................
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [email, setEmail] = useState("");
  const [cusInfo, setCusInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    phoneNumber: "",
    email: "",
    country: null,
    discountCode,
    shipping: shippingAmount,
    tips: tip,
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [discountedAmount, setDiscountedAmount] = useState(0);
  // const [finalCartData, setFinalCartData] = useState(cartData || []);

  useEffect(() => {
    let sum = 0;
    let discount = 0;
    let quantity = 0;

    if (finalCartData.length > 0) {
      for (let i = 0; i < finalCartData.length; i++) {
        sum += finalCartData[i].price * finalCartData[i].quantity;
        discount += finalCartData[i].discount * finalCartData[i].quantity;
        quantity += finalCartData[i].quantity;
      }
      // setFinalCartData(cartData);
    } else {
      setFinalCartData(cartData);
      for (let i = 0; i < cartData.length; i++) {
        sum += cartData[i].price * cartData[i].quantity;
        discount += cartData[i].discount * cartData[i].quantity;
        quantity += cartData[i].quantity;
      }
    }

    setSubtotal(sum);
    setQuantity(quantity);
    if (disAdditionalType !== "AOffO") {
      setDiscountedAmount(discount);
    }
    console.log({ discountedAmount, finalCartData });
  }, [isLoading, disError, finalCartData.length, cartData, discountCode, tip, shippingAmount, setSubtotal, setQuantity, disAdditionalType, discountedAmount, finalCartData]);

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
  };

  const handleDiscountCode = (code) => {
    setPromoCode("");
    setLoading(true);

    if (!code) {
      setDiscountCode("");
      setCusInfo.discountCode = "";
      setDisError("Discount field is empty!");
      setDisAdditionalType("");
      setFinalCartData(cartData);
      setLoading(false);
      return;
    }

    // setFinalCartData([]);
    axiosHttp.patch(`/discount`, { dataForBxGy, shipping, tip, discountCode: code, email, selectedCountry }).then(async (res) => {
      const response = res.data;
      // console.log({ response });

      if (response.issue == "invalid") {
        toast.error(response?.message);
        setDisError(response?.message);
        setDiscountCode("");
        setCusInfo.discountCode = "";
        setFinalCartData(cartData);
        return;
      }

      setDiscountCode(code);
      setCusInfo.discountCode = code;
      setDisAdditionalType(response?.discountType);
      switch (response?.discountType) {
        case "BxGy": {
          if (response?.issue == "passed") {
            setDiscountCode(code);
            setCusInfo.discountCode = code;
            setDisError("");
            setDiscountInput("");
            setFinalCartData(response.data);
            toast.success("Discount code applied successfully");
          } else {
            toast.error(response?.message);
            setDisError(response?.message);
            setDiscountCode(code);
            setCusInfo.discountCode = code;
            setFinalCartData(cartData);
          }
          break;
        }
        case "AOffP": {
          if (response?.issue == "passed") {
            setFinalCartData(response.data);
            toast.success("Discount code applied successfully");
            setDiscountCode(code);
            setCusInfo.discountCode = code;
            setDisError("");
            setDiscountInput("");
          } else {
            toast.error(response?.message);
            setDisError(response?.message);
            setDiscountCode(code);
            setCusInfo.discountCode = code;
            setFinalCartData(cartData);
          }
          break;
        }
        case "AOffO": {
          if (response?.issue == "passed") {
            setFinalCartData(cartData);
            // console.log({ data: response.data });
            if (response.data.type == "Percentage") {
              let moneyToBeSubtract = subTotal * (parseInt(response.data.amount) / 100);
              setDiscountedAmount(moneyToBeSubtract);
              toast.success("Discount code applied successfully");
              setDiscountCode(code);
              setCusInfo.discountCode = code;
              setDisError("");
              setDiscountInput("");
            } else if (response.data.type == "Fixed") {
              setDiscountedAmount(parseInt(response.data.amount));
              toast.success("Discount code applied successfully");
              setDiscountCode(code);
              setCusInfo.discountCode = code;
              setDisError("");
              setDiscountInput("");
            } else {
              toast.error(response?.message);
              setDisError(response?.message);
              setDiscountCode(code);
              setCusInfo.discountCode = code;
            }
          }
          break;
        }
        case "FS": {
          setFinalCartData(cartData);
          if (response?.issue == "passed") {
            toast.success("Discount code applied successfully");
            setDiscountCode(code);
            setCusInfo.discountCode = code;
            setDisError("");
            setDiscountInput("");
            // setShippingAmount(0);
          } else if (response?.issue == "failed") {
            setDisError(response.message);
            Swal.fire({
              title: "Failed",
              text: response?.message,
              icon: "error",
            });
          } else if (response?.issue == "!country") {
            setDisError(response.message);
            return Swal.fire({
              title: "Country require!",
              text: response.message,
              icon: "error",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Enter country?",
            }).then(async (result2) => {
              // console.log({ result2 });
              if (result2.isConfirmed) {
                handleOpen();
              } else {
                setDiscountCode(code);
                setCusInfo.discountCode = code;
              }
            });
          }
          break;
        }
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (promoCode) {
      handleDiscountCode(promoCode);
      setDiscountCode(promoCode);
      setDiscountInput(promoCode);
    }
  }, [promoCode]);

  // abandoned order
  useEffect(() => {
    function isValidEmail(email) {
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
      return emailPattern.test(email);
    }

    let cardID = localStorage.getItem("obs-card-id");
    // console.log({ cardID });

    if (isValidEmail(cusInfo?.email)) {
      cusInfo.discountCode = discountCode;
      cusInfo.cardID = cardID || "";
      axiosHttp.post("/checkout/abandoned", { cusInfo, cart: dataForBxGy, discountCode, amount: total }).then((res) => {
        // console.log(res.data, res.data?.data?.result1?._id);
        localStorage.setItem("obs-card-id", res.data?.data?.result1?._id);
        setCustomer({ ...customer, email: email, orderNumber: res?.data?.data?.orderNumberOfDB });
      });
    }
  }, [cusInfo, dataForBxGy, discountCode, total]);

  // console.log({ customer });

  return (
    <>
      <div>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <h3 className="text-lg font-semibold text-center mb-3">Enter country: </h3>
            <Autocomplete
              options={allCountryData}
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              value={selectedCountry}
              onChange={handleCountryChange}
              renderInput={(params) => <TextField {...params} label="Country / Region" variant="outlined" />}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option?.id}>
                  <Avatar src={option.imageUrl} alt={option.label} />
                  <span style={{ marginLeft: "8px" }}>{option.label}</span>
                </MenuItem>
              )}
            />
            <div className="flex justify-center">
              <button
                onClick={() => {
                  handleClose();
                  Swal.fire({
                    title: `Entered country: ${selectedCountry?.label}`,
                    text: "Use the discount code again!",
                    icon: "success",
                  });
                }}
                className="px-4 py-1 mt-3 uppercase font-semibold text-white bg-blue-600 rounded-md hover:bg-opacity-80"
              >
                Okay
              </button>
            </div>
          </Box>
        </Modal>
      </div>

      <div className="grid grid-cols-12 mx-auto mt-20">
        <div className="col-start-2 col-span-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CheckoutPersonalInfo
            cusInfo={cusInfo}
            setCusInfo={setCusInfo}
            setTips={setTip}
            subTotal={subTotal}
            email={email}
            setEmail={setEmail}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            total={total}
            setTotal={setTotal}
            discountCode={discountCode}
          />
          <CheckoutProductsInfo
            // finalCartData={finalCartData}
            discountedAmount={discountedAmount}
            total={total}
            setTotal={setTotal}
            email={email}
            selectedCountry={selectedCountry}
            handleDiscountCode={handleDiscountCode}
            tip={tip}
            subTotal={subTotal}
            setSubtotal={setSubtotal}
            setQuantity={setQuantity}
            disError={disError}
            discountCode={discountCode}
            discountType={discountType}
            disAdditionalType={disAdditionalType}
            discountInput={discountInput}
            setDiscountInput={setDiscountInput}
            isLoading={isLoading}
            setLoading={setLoading}
            shipping={shipping}
            shippingAmount={shippingAmount}
            shippingReqAmount={shippingReqAmount}
          />
        </div>
        <div className="bg-[#f5f5f5] -mt-5"></div>
      </div>
    </>
  );
};

export default CheckoutPage;
