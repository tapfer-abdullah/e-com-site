"use client";
import React, { useEffect } from "react";
import { FiMinus } from "react-icons/fi";
import { MdDiscount } from "react-icons/md";

const CheckoutPageShoppingCart = ({ sp, discountCode }) => {
  const price = parseInt(sp?.price);
  const quantity = parseInt(sp?.quantity);
  const discount = parseFloat(sp?.discount);
  const netPrice = price - discount;

  return (
    <>
      <div className={`relative flex justify-between items-center space-x-4 my-4`}>
        <div className="flex justify-start items-center gap-2">
          <div className="relative">
            <img src={sp?.img} alt="product img" className="w-16 h-16 rounded-md" />
            <p className="absolute -top-3 -right-2 text-white text-sm bg-gray-500 rounded-full px-[8px] py-[2px]">{sp?.quantity}</p>
          </div>

          <div>
            <h4 className="text-md">{sp?.name}</h4>
            <p className="text-sm text-gray-500 py-1 capitalize">
              {sp?.color} / {sp?.size}
            </p>

            {discount > 0 && (
              <div className="flex justify-start items-center gap-1 text-base font-normal text-green-600">
                <MdDiscount />
                <span className="font-semibold uppercase">{discountCode} </span>
                {discount !== price ? <span>(- €{discount * sp.quantity.toFixed(2)})</span> : <span>(Free)</span>}
              </div>
            )}
          </div>
        </div>
        {discount > 0 ? (
          <div className="text-right">
            <p className="line-through text-lg text-red-700 font-semibold">€ {price.toFixed(2)}</p>
            <p>{discount !== price ? <span>€ {(netPrice * quantity).toFixed(2)}</span> : <span className="text-green-600">Free</span>}</p>
          </div>
        ) : (
          <p className="text-right">€ {price * quantity}</p>
        )}
      </div>
    </>
  );
};

export default CheckoutPageShoppingCart;
