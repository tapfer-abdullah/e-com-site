"use client";
import React, { useEffect, useState } from "react";

const BuyXGetX = ({ data }) => {
  const [allCartData, setAllCartData] = useState([]);

  const {
    cartData,
    setDiscountedProductCount,
    discountedProductCount,
    approvedGetArray,
    discountCode,
    approvedBuyCount,
    approvedGetCount,
    CusBuyAmount,
    CusGetAmount,
    discountType,
    BxGyType,
    discountTypeValue,
  } = data;

  //   useEffect(() => {
  //     let dataArray = [];
  //     // ?.sort((a, b) => b.price - a.price)
  //     cartData?.forEach((sp) => {
  //       console.log(sp?.quantity);
  //       if (sp?.quantity > 1) {
  //         for (let i = 0; i < sp?.quantity; i++) {
  //           let obj = sp;
  //           obj.quantity = 1;
  //           dataArray.push(obj);
  //         }
  //       } else {
  //         dataArray.push(sp);
  //       }
  //     });
  //     setAllCartData(dataArray);
  //   }, [cartData, discountCode]);
  //   setAllCartData(cartData?.sort((a, b) => b.price - a.price))
  console.log(allCartData);
  return (
    <div>
      <div>
        {cartData?.map((sp, index) => (
          <div key={index} className={`relative flex justify-between items-center space-x-4 my-4`}>
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
              </div>
            </div>
            <p className="">€ {sp?.price * sp?.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyXGetX;
