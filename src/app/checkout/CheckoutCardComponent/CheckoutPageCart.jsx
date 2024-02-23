"use client";
import React, { useEffect } from "react";
import { FiMinus } from "react-icons/fi";
import { MdDiscount } from "react-icons/md";

const CheckoutPageCart = ({ BuyOnOption, BuyOnValue, BxGyType, disAdditionalType, discountCode, setMinusAmount, sp, discountOn, discountOnValue, amountToBeReduce, discountType }) => {
  const price = parseInt(sp?.price);
  const quantity = parseInt(sp?.quantity);

  useEffect(() => {
    switch (disAdditionalType) {
      //AOffO -> amount off on product or category
      case "AOffP": {
        if (discountOn === "products") {
          if (discountOnValue.includes(sp?.id)) {
            if (discountType === "Percentage") {
              const discountedPrice = ((price * amountToBeReduce) / 100) * quantity;
              setMinusAmount((prevAmount) => prevAmount + discountedPrice);
            } else {
              setMinusAmount((prevAmount) => prevAmount + amountToBeReduce * quantity);
            }
          }
        } else if (discountOn === "category") {
          if (discountOnValue.includes(sp?.category?.toLowerCase())) {
            if (discountType === "Percentage") {
              const discountedPrice = ((price * amountToBeReduce) / 100) * quantity;
              setMinusAmount((prevAmount) => prevAmount + discountedPrice);
            } else {
              setMinusAmount((prevAmount) => prevAmount + amountToBeReduce * quantity);
            }
          }
        }
        break;
      }
      case "AOffO": {
        console.log(disAdditionalType, discountType);
        break;
      }
      case "FS": {
        // console.log("Free shipping: ", disAdditionalType, discountType, "AK............");
        break;
      }
    }
  }, [BxGyType, BuyOnOption, BuyOnValue, discountCode, discountType, discountOn, discountOnValue, sp?.id, sp?.category?.toLowerCase(), price, amountToBeReduce, quantity]);

  if (disAdditionalType === "BxGy") {
    return <p className="hidden"></p>;
  } else if (disAdditionalType === "AOffP") {
    if (discountOn === "products") {
      if (discountOnValue.includes(sp?.id)) {
        if (discountType === "Percentage") {
          return (
            <div className={`relative flex justify-between items-center space-x-4 my-4`}>
              <div className="flex justify-start items-center gap-2">
                <div className="relative">
                  <img src={sp?.img} alt="product img" className="w-16 h-16 rounded-md" />
                  <p className="absolute -top-3 -right-2 text-white text-sm bg-gray-500 rounded-full px-[8px] py-[2px]">{sp?.quantity}</p>
                </div>
                <div>
                  <div>
                    <h4 className="text-md">{sp?.name}</h4>
                    <p className="text-sm text-gray-500 py-1 capitalize">
                      {sp?.color} / {sp?.size}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-1 text-base font-normal text-green-600">
                    <div className="flex items-center gap-1">
                      <MdDiscount />
                      <span className="font-semibold uppercase">{discountCode}:</span>
                    </div>
                    <p className="flex items-center gap-1">
                      (- €{parseInt(sp?.quantity)}x{(parseInt(sp?.price) * amountToBeReduce) / 100})
                    </p>
                  </div>
                </div>
              </div>
              <div className="pr-2">
                <p className="line-through text-lg text-red-700 font-semibold">€ {price * quantity}</p>
                <p className="text-right">€{(price - (price * amountToBeReduce) / 100) * quantity}</p>
              </div>
            </div>
          );
        } else if (discountType === "Fixed") {
          return (
            <div className={`relative flex justify-between items-center space-x-4 my-4`}>
              <div className="flex justify-start items-center gap-2">
                <div className="relative">
                  <img src={sp?.img} alt="product img" className="w-16 h-16 rounded-md" />
                  <p className="absolute -top-3 -right-2 text-white text-sm bg-gray-500 rounded-full px-[8px] py-[2px]">{sp?.quantity}</p>
                </div>
                <div>
                  <div>
                    <h4 className="text-md">{sp?.name}</h4>
                    <p className="text-sm text-gray-500 py-1 capitalize">
                      {sp?.color} / {sp?.size}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-1 text-base font-normal text-green-600">
                    <div className="flex items-center gap-1">
                      <MdDiscount />
                      <span className="font-semibold uppercase">{discountCode}:</span>
                    </div>
                    <p className="flex items-center gap-1">
                      (- €{parseInt(sp?.quantity)}x{amountToBeReduce})
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pr-2">
                <div className="">
                  <p className="line-through text-lg text-red-700 font-semibold">€ {price * quantity}</p>
                  <p className="text-right">€{(price - amountToBeReduce) * quantity}</p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
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
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pr-2">
                <p className="text-right">€{price * quantity}</p>
              </div>
            </div>
          );
        }
      } else {
        return (
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
              </div>
            </div>
            <div className="flex justify-end items-center gap-1 pr-2">
              <p className="text-right">€{price * quantity}</p>
            </div>
          </div>
        );
      }
    } else if (discountOn === "category") {
      if (discountOnValue.includes(sp?.category?.toLowerCase())) {
        if (discountType === "Percentage") {
          return (
            <div className={`relative flex justify-between items-center space-x-4 my-4`}>
              <div className="flex justify-start items-center gap-2">
                <div className="relative">
                  <img src={sp?.img} alt="product img" className="w-16 h-16 rounded-md" />
                  <p className="absolute -top-3 -right-2 text-white text-sm bg-gray-500 rounded-full px-[8px] py-[2px]">{sp?.quantity}</p>
                </div>
                <div>
                  <div>
                    <h4 className="text-md">{sp?.name}</h4>
                    <p className="text-sm text-gray-500 py-1 capitalize">
                      {sp?.color} / {sp?.size}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-1 text-base font-normal text-green-600">
                    <div className="flex items-center gap-1">
                      <MdDiscount />
                      <span className="font-semibold uppercase">{discountCode}:</span>
                    </div>
                    <p className="flex items-center gap-1">
                      (- €{parseInt(sp?.quantity)}x{(parseInt(sp?.price) * amountToBeReduce) / 100})
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pr-2">
                <div className="">
                  <p className="line-through text-lg text-red-700 font-semibold">€ {price * quantity}</p>
                  <p className="text-right">€{(price - (price * amountToBeReduce) / 100) * quantity}</p>
                </div>
              </div>
            </div>
          );
        } else if (discountType === "Fixed") {
          return (
            <div className={`relative flex justify-between items-center space-x-4 my-4`}>
              <div className="flex justify-start items-center gap-2">
                <div className="relative">
                  <img src={sp?.img} alt="product img" className="w-16 h-16 rounded-md" />
                  <p className="absolute -top-3 -right-2 text-white text-sm bg-gray-500 rounded-full px-[8px] py-[2px]">{sp?.quantity}</p>
                </div>
                <div>
                  <div>
                    <h4 className="text-md">{sp?.name}</h4>
                    <p className="text-sm text-gray-500 py-1 capitalize">
                      {sp?.color} / {sp?.size}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-1 text-base font-normal text-green-600">
                    <div className="flex items-center gap-1">
                      <MdDiscount />
                      <span className="font-semibold uppercase">{discountCode}:</span>
                    </div>
                    <p className="flex items-center gap-1">
                      (- €{parseInt(sp?.quantity)}x{amountToBeReduce})
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pr-2">
                <div className="">
                  <p className="line-through text-lg text-red-700 font-semibold">€ {price * quantity}</p>
                  <p className="text-right">€{(price - amountToBeReduce) * quantity}</p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
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
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pr-2">
                <p className="text-right">€{price * quantity}</p>
              </div>
            </div>
          );
        }
      } else {
        return (
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
              </div>
            </div>
            <div className="flex justify-end items-center gap-1 pr-2">
              <p className="text-right">€{price * quantity}</p>
            </div>
          </div>
        );
      }
    } else {
      return (
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
            </div>
          </div>
          <div className="flex justify-end items-center gap-1 pr-2">
            <p className="text-right">€{price * quantity}</p>
          </div>
        </div>
      );
    }
  } else {
    return (
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
          </div>
        </div>
        <p className="text-right">€{price * quantity}</p>
      </div>
    );
  }
};

export default CheckoutPageCart;
