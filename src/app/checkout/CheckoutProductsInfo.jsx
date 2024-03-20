"use client";
import { OrderStateProvider } from "@/Components/State/OrderState";
import { default as React, useContext, useEffect, useState } from "react";
import { FiMinus } from "react-icons/fi";
import { MdDiscount, MdOutlineEuroSymbol } from "react-icons/md";
import CheckoutPageShoppingCart from "./CheckoutCardComponent/CheckoutPageShoppingCart";

const CheckoutProductsInfo = ({
  discountedAmount,
  // finalCartData,

  setMinusAmount,
  discountType,

  tip,
  subTotal,

  handleDiscountCode,
  disError,

  discountCode,
  disAdditionalType,

  discountInput,
  setDiscountInput,
  isLoading,
  setLoading,
  shipping,
  shippingAmount,
  shippingReqAmount,
  total,
  setTotal,
}) => {
  const { cartData, finalCartData } = useContext(OrderStateProvider);

  console.log({ finalCartData });

  return (
    <div className="bg-[#f5f5f5] -mt-5 p-10 border-l-2">
      {finalCartData.length > 0 ? finalCartData.map((sp, index) => <CheckoutPageShoppingCart key={sp.sku + index} disError={disError} sp={sp} discountCode={discountCode} />) : <div>Empty cart!</div>}
      <div className="relative mt-7">
        <input
          onChange={(e) => {
            setDiscountInput(e.target.value);
          }}
          value={discountInput}
          type="text"
          name="discount-code"
          id=""
          placeholder="Discount code"
          className={`border-2 p-2 w-full outline-[#e7e7e7] outline-4 ${disError ? "border-red-600" : "border-[#e7e7e7]"}`}
        />
        <button
          onClick={() => {
            handleDiscountCode(discountInput);
          }}
          className={`absolute top-0 right-0 bg-[#d0d0d0] hover:bg-opacity-90 transition-all duration-300 text-black font-semibold p-2 border-2 border-[#d0d0d0]`}
        >
          {isLoading ? "Apply.." : "Apply"}
        </button>
        {disError && <p className="text-red-600 text-sm py-1">{disError}</p>}
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex justify-between items-center text-base font-normal">
          <span>SUBTOTAL:</span>
          <p className="flex justify-end items-center gap-1">
            <MdOutlineEuroSymbol />
            <span>{subTotal}</span>
          </p>
        </div>
        <div className="flex justify-between items-start text-base font-normal">
          <span>Shipping:</span>
          <div>
            {disAdditionalType == "FS" && !disError ? (
              <div>
                <p className="line-through text-red-700 font-semibold">€ {shippingAmount}</p>
                <p className="text-green-600 font-semibold">Free</p>
              </div>
            ) : (
              <p>€ {shippingAmount}</p>
            )}
          </div>
        </div>

        {tip > 0 && (
          <div className="flex justify-between items-center text-base font-normal">
            <span>Tip:</span>
            <p className="flex justify-end items-center gap-1">
              <MdOutlineEuroSymbol />
              <span>{tip}</span>
            </p>
          </div>
        )}

        {discountCode && !disError && (
          <div className="flex justify-between items-center text-base font-normal text-green-600">
            <div className="flex items-center gap-1">
              <MdDiscount />
              <span className="font-semibold uppercase">{discountCode}:</span>
            </div>
            <p className="flex justify-end items-center gap-1">
              <FiMinus /> <MdOutlineEuroSymbol />
              {disAdditionalType == "FS" && !disError ? <span>{shippingAmount}</span> : <span>{discountedAmount}</span>}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <p className="flex justify-end items-center gap-1">
            <MdOutlineEuroSymbol />
            {disAdditionalType == "FS" ? subTotal - discountedAmount + tip : subTotal - discountedAmount + tip + shippingAmount}
          </p>
        </div>
      </div>
    </div>
  );
  s;
};

export default CheckoutProductsInfo;
