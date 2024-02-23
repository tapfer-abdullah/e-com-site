import React from "react";

import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import "../CustomComponents.css";

import Link from "next/link";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const DetailsModalImage = ({ singleProduct, rightSlider, leftSlider, imgIndex, setImgIndex, handleSku, selectedSize }) => {
  console.log(singleProduct);
  const imageData = singleProduct?.colors;

  return (
    <>
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute left-2 top-[50%]">
            <IoIosArrowDropleft
              className={`${imageData?.length < 2 ? "hidden" : ""} text-white font-semibold text-4xl cursor-pointer hover:text-black hover:bg-white rounded-full transition-all duration-300`}
              onClick={leftSlider}
            />
          </div>
          <div>
            <img src={imageData?.[imgIndex]?.imageUrl} alt="img" className="!max-h-[50vh] !w-full" />
          </div>
          <div className="absolute right-2 top-[50%]">
            <IoIosArrowDropright
              className={`${imageData?.length < 2 ? "hidden" : ""} text-white font-semibold text-4xl cursor-pointer hover:text-black hover:bg-white rounded-full transition-all duration-300`}
              onClick={rightSlider}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {imageData?.map((i, index) => (
            <img
              key={index}
              onClick={() => {
                setImgIndex(index);
                handleSku(selectedSize, index);
              }}
              src={i?.imageUrl}
              alt="slide img"
              className={`w-20 h-20 cursor-pointer border-[3px] p-[1px] ${index == imgIndex ? " border-black" : "border-white"}`}
            />
          ))}
        </div>
      </div>

      <Link href={`/Collections/${singleProduct?.category?.[0]?.label}/${singleProduct?._id}`} className="text-lg font-medium mt-8 flex justify-center items-center gap-2 hover:underline">
        <p>View More Details</p>
        <FaArrowUpRightFromSquare />
      </Link>
    </>
  );
};

export default DetailsModalImage;
