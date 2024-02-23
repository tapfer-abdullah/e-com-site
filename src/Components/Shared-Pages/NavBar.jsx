"use client";
import { axiosHttp } from "@/app/helper/axiosHttp";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineShopping } from "react-icons/ai";
import { IoIosArrowForward, IoIosSearch } from "react-icons/io";
import ShoppingCart from "../CustomComponents/ShoppingCart/ShoppingCart";
import { OrderStateProvider } from "../State/OrderState";

const NavBar = () => {
  const [positionInfo, setPositionInfo] = useState({ right: "-right-[2000px]", customOpacity: 0 });
  const [type, setType] = useState([]);
  const [navLinks, setNavLinks] = useState([]);

  const { cartData } = useContext(OrderStateProvider);

  useEffect(() => {
    axiosHttp.get("/nav-links").then((res) => {
      setNavLinks(res.data);
    });
  }, []);

  useEffect(() => {
    axiosHttp.get("/types").then((res) => {
      setType(res.data);
    });
  }, []);

  return (
    <div>
      <div className="mobile lg:hidden">mobile</div>
      <div className="hidden md:block md:fixed top-0 left-0 z-50 w-screen">
        <div className="bg-[#31a3a3] text-white font-sans font-semibold flex justify-around py-4 text-xl">
          <Link href="/" className="text-3xl font-semibold uppercase">
            OdbhootStore
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/">Home</Link>

            <ul className="flex space-x-4  items-center">
              {type?.length > 0 &&
                type?.map((t) => (
                  <li key={t?._id} className="relative group">
                    <Link href={`/Collections${t?.url}`}>{t?.title}</Link>
                    <ul className="bg-[#31a3a3] z-40 absolute hidden mt-0 space-y-2 py-2 pl-1 pr-3 rounded group-hover:block">
                      {t?.collections?.map((c, index) => (
                        <li key={index} className="hover:text-pink-500 cursor-pointer flex items-center gap-1">
                          <IoIosArrowForward /> <Link href={`/Collections/${c.toLowerCase()}`}>{c}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
            <ul className="flex space-x-4  items-center">
              {navLinks?.length > 0 &&
                navLinks?.map((n, index) => (
                  <li key={index}>
                    <Link href={n?.url}>{n?.title}</Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="flex gap-2 ">
            <Link href="">
              <IoIosSearch className="text-4xl" />
            </Link>
            <button className="relative">
              <span className="absolute -top-3 -right-3 bg-red-500 rounded-full py-[2px] px-[8px] text-sm">{cartData?.length || 0}</span>
              <AiOutlineShopping
                onClick={() => {
                  setPositionInfo({ right: "right-0", customOpacity: 70 });
                }}
                className="text-3xl"
              />
            </button>
          </div>
        </div>
      </div>
      <ShoppingCart positionInfo={positionInfo} setPositionInfo={setPositionInfo} />
    </div>
  );
};

export default NavBar;
