"use client";
import Link from "next/link";
// import { Slide } from "react-awesome-reveal";
import "../Home.css";

const HomeBannerContent = ({ title, destination, bgImg }) => {
  return (
    <div style={{ backgroundImage: `url('${bgImg}')` }} className="bgBannerImg text-white bg-[black]">
      <div className="w-full h-full bg-[black] bg-opacity-50">
        <div className=" px-5 md:px-24 pt-24 pb-5 md:pb-32 md:pt-56 space-y-3 flex flex-col justify-center text-center md:w-1/2 mx-auto">
          <h3 className="aaa text-3xl font-semibold">{title}</h3>
          <p>{destination}</p>
          <Link href={"/Collections"} className="bg-black rounded-xl px-4 py-2 text-white font-semibold w-fit mx-auto">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBannerContent;
