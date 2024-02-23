"use client";
import { MdDiscount } from "react-icons/md";

const BxGyCart = ({ data }) => {
  const { sp } = data;
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

          {sp?.discountCode && (
            <div className="flex justify-start items-center gap-1 text-base font-normal text-green-600">
              <MdDiscount />
              <span className="font-semibold uppercase">{sp?.discountCode} </span>
              {sp?.reducedAmount !== sp?.price ? <span>(- €{sp?.reducedAmount})</span> : <span>(Free)</span>}
            </div>
          )}
        </div>
      </div>
      {sp?.discountCode ? (
        <div className="text-right">
          <p className="line-through text-lg text-red-700 font-semibold">€ {sp?.price}</p>
          <p>{sp?.reducedAmount !== sp?.price ? <span>€ {sp?.price - sp?.reducedAmount}</span> : <span className="text-green-600">Free</span>}</p>
        </div>
      ) : (
        <p className="text-right">€ {sp?.price}</p>
      )}
    </div>
  );
};

export default BxGyCart;
