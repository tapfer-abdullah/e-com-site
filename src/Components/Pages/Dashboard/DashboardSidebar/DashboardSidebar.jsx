"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillTags } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { HiInboxIn } from "react-icons/hi";
import { TbDiscount2 } from "react-icons/tb";

import { FaCaretDown, FaCaretUp, FaUsers } from "react-icons/fa6";
import logo from "../../../../Assects/obs.png";

const DashboardSidebar = () => {
  const [productBtn, setProductsBtn] = useState(false);
  const [themeBtn, setThemeBtn] = useState(false);
  return (
    <div className="py-5 px-2 fixed">
      <div className="flex items-center justify-center gap-1 text-white">
        <Image src={logo} alt="logo" width={50} height={50} className="bg-white rounded-full p-[1px]" />
        <Link href={"/"} className="text-lg font-semibold uppercase">
          ODBHOOTSTORE
        </Link>
      </div>
      <div className="py-5 pl-1">
        <div className="space-y-2">
          <Link href={"/dashboard"} className="flex items-center gap-1 text-xl font-semibold text-white">
            <FaHome className="text-3xl" />
            <p>Home</p>
          </Link>
          <Link href={"/"} className="flex items-center gap-1 text-xl font-semibold text-white">
            <HiInboxIn className="text-3xl" />
            <p>Orders</p>
          </Link>

          <div>
            <Link href="/dashboard/products" onClick={() => setProductsBtn(!productBtn)} className="flex items-center gap-1 text-xl font-semibold text-white">
              <AiFillTags className="text-3xl" />
              <p>Products</p>
              <FaCaretDown className={`${productBtn ? "hidden" : "block"} dashboard-icon`} />
              <FaCaretUp className={`${productBtn ? "block" : "hidden"} dashboard-icon`} />
            </Link>
            <ul className={`${productBtn ? "block" : "hidden"} text-xl font-semibold text-white pl-8 space-y-1`}>
              <li>
                <Link href="/dashboard/products/types" className="">
                  Types
                </Link>
              </li>
              <li>
                <Link href="/dashboard/products/collections" className="">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/dashboard/products" className="">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/products/add" className="">
                  Add new product
                </Link>
              </li>
            </ul>
          </div>

          <Link href={"/"} className="flex items-center gap-1 text-xl font-semibold text-white">
            <FaUsers className="text-3xl" />
            <p>Customers</p>
          </Link>
          <Link href={"/dashboard/discount"} className="flex items-center gap-1 text-xl font-semibold text-white">
            <TbDiscount2 className="text-3xl" />
            <p>Discounts</p>
          </Link>

          <div>
            <button onClick={() => setThemeBtn(!themeBtn)} className="flex items-center gap-1 text-xl font-semibold text-white">
              <AiFillTags className="text-3xl" />
              <p>Theme</p>
              <FaCaretDown className={`${themeBtn ? "hidden" : "block"} dashboard-icon`} />
              <FaCaretUp className={`${themeBtn ? "block" : "hidden"} dashboard-icon`} />
            </button>
            <ul className={`${themeBtn ? "block" : "hidden"} text-xl font-semibold text-white pl-8 space-y-1`}>
              <li>
                <Link href="/dashboard/theme/pages" className="">
                  Pages
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
