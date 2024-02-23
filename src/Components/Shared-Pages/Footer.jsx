"use client";
import { axiosHttp } from "@/app/helper/axiosHttp";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaLocationDot, FaPhone, FaRegCopyright } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { SiAmericanexpress } from "react-icons/si";

const Footer = () => {
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    axiosHttp.get("/footer-links").then((res) => {
      setFooterLinks(res.data);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-10 xl:px-5 flex flex-col xl:flex-row justify-between gap-6 pt-10 pb-2">
        <div className="flex flex-col space-y-2 w-1/4">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          {footerLinks.length > 0 &&
            footerLinks?.map((l) => {
              if (l?.column == "1") {
                return (
                  <Link key={l?._id} href={`${l?.url}`} className="hover:underline">
                    {l?.title}
                  </Link>
                );
              }
            })}
        </div>
        <div className="flex flex-col space-y-2 w-1/4">
          <h4 className="text-lg font-semibold">Important Info</h4>
          {footerLinks.length > 0 &&
            footerLinks?.map((l) => {
              if (l?.column == "2") {
                return (
                  <Link key={l?._id} href={`${l?.url}`} className="hover:underline">
                    {l?.title}
                  </Link>
                );
              }
            })}
        </div>
        <div className="flex flex-col space-y-2 w-1/4">
          <h1 className="text-lg font-semibold">Contact Info</h1>
          {footerLinks.length > 0 &&
            footerLinks?.map((l) => {
              if (l?.column == "3") {
                return (
                  <Link key={l?._id} href={`${l?.url}`} className="hover:underline">
                    {l?.title}
                  </Link>
                );
              }
            })}
          <p className="flex gap-2 items-start">
            <FaLocationDot className="mt-1" />
            <span>2 FREDERICK STREETKINGS CROSS, LONDON WC1X 0ND</span>
          </p>
          <p className="flex gap-2 items-center">
            <FaPhone />
            <span>+447888886977</span>
          </p>
          <p className="flex gap-2 items-center">
            <MdEmail />
            <span>odbhootstore@gmail.com</span>
          </p>
          <FaInstagram className="text-3xl" />
        </div>
        <div className="flex flex-col space-y-2 w-1/4">
          <h4 className="text-lg font-semibold">Sing Up Save</h4>
          <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals</p>
          <form className="relative">
            <input type="email" name="email" id="" className="w-full border border-black rounded-md px-2 py-2" placeholder="Subscribe to our offer" />
            <span className="absolute right-0 top-0 px-2 py-2 bg-black text-white rounded-e-md cursor-pointer">Sing UP</span>
          </form>
        </div>
      </div>
      <div className="py-3 flex justify-between items-center">
        <p className="flex gap-2 items-center">
          <FaRegCopyright />
          <span> 2023 Odbhootstore</span>
        </p>
        <div className="flex gap-2 items-center text-3xl text-black">
          {/* <FaCcPaypal />
          <FaCcVisa />
          <FaCcMastercard />
          <SiAmericanexpress /> */}
          <img src={"https://i.ibb.co/smfbCX7/paypal.png"} alt="PayPal Icon" className="w-20 px-[2px] py-[1px] bg-white " />
          <img src={"https://i.ibb.co/mBxkzz4/visa.png"} alt="Visa Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white " />
          <img src={"https://i.ibb.co/QprC3LG/master.webp"} alt="Master Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white " />
          <img src={"https://i.ibb.co/2kCgmpH/amex5.png"} alt="Amex Icon" className="w-10 h-auto px-[2px] py-[1px] bg-white rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
