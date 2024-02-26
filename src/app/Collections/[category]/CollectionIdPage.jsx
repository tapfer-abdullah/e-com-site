"use client";
import ProductCard1 from "@/Components/CustomComponents/ProductCard1";
import Loader from "@/Hooks/Loader/Loader";
import { axiosHttp } from "@/app/helper/axiosHttp";
import Link from "next/link";
import React from "react";

import { Backdrop, Pagination } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import MistyBox from "./MistyBox";

const CollectionIdPage = () => {
  const pathname = usePathname();
  const category = pathname.replace("/Collections/", "");
  const [allProductsData, setAllProductsData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [isImgURL, setImgURL] = useState({});

  const [inStock, setInStock] = useState("Active");
  const [inStockChecked, setInStockChecked] = useState(false);
  const [outOfStockChecked, setOutOfStockChecked] = useState(false);
  const [heightSelling, setHeightSelling] = useState(false);
  const [priceState, setPriceState] = useState("");
  const [newToOld, setNewToOld] = useState(false);
  const [oldToNew, setOldToNew] = useState(false);
  const [filterOnTime, setFilterOnTime] = useState("newToOld");

  const [totalPage, setTotalPage] = useState(0);
  const [productPerPage, setProductPerPage] = useState(3);
  const [page, setPage] = useState(1);

  // console.log({ inStock, inStockChecked, outOfStockChecked, heightSelling, priceState });

  const handleInStockChange = () => {
    setInStock("Active");
    setInStockChecked(!inStockChecked);
    if (outOfStockChecked) {
      setOutOfStockChecked(false);
    }
  };

  const handleOutOfStockChange = () => {
    if (!outOfStockChecked) {
      setOutOfStockChecked(true);
      setInStockChecked(false);
      setInStock("OutOfStock");
    } else {
      setOutOfStockChecked(false);
      setInStock("Active");
    }
  };

  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // handleOpen();
  useEffect(() => {
    setLoading2(true);
    axiosHttp.get(`/collections?imgUrl=${category}`).then((res) => {
      setImgURL(res.data);
      handleClose();
      setLoading2(false);
    });
  }, [category]);

  useEffect(() => {
    setLoading(true);
    let timeData = oldToNew ? "1" : "-1";
    axiosHttp.get(`/products?category=${category}&status=${inStock}&priceLevel=${priceState}&highestSelling=${heightSelling}&time=${timeData}`).then((res) => {
      setAllProductsData(res.data);
      setTotalPage(Math.ceil(res?.data?.length / productPerPage));
      handleClose();
      setLoading(false);
    });
  }, [category, inStock, priceState, heightSelling, oldToNew, productPerPage]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  // console.log({ page });

  // if (isLoading) {
  //   return (
  //     <div className="pt-[68px] mt-20">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="pt-[68px] bg-[#ededed]">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <Loader />
      </Backdrop>
      <div className="h-[30vh] w-full overflow-hidden flex items-center justify-center relative">
        <Image src={isImgURL?.[0]?.img} alt="product not found" layout="fill" className="object-cover" />
        <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-black opacity-40"></div>
        <h3 className="absolute font-bold text-2xl text-white">{category.toUpperCase()}</h3>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 my-10">
        {/* filter */}
        <div className="h=full">
          <div className="bg-[#f9f9f9] mt-4 pb-10 max-h-[70vh]">
            <div className="text-lg font-semibold flex items-center space-x-1 -mt-2 p-2 bg-[#e9e9e9] ">
              <Link href={"/"}>Home</Link>
              <IoIosArrowForward />
              <Link href={"/Collections"}>Collections</Link>
              <IoIosArrowForward />
              <Link href={`/Collections/${category.toLowerCase()}`}>{category.toUpperCase()}</Link>
            </div>
            <div>
              <div className="space-y-2 px-5">
                <h3 className="text-xl font-semibold text-center mt-3 mb-1">Filter items</h3>
                <div className="border-b-2"></div>
                <div className="text-lg space-x-2">
                  <input type="checkbox" name="in-stock" id="in-stock" checked={inStockChecked} onChange={handleInStockChange} />
                  <label htmlFor="in-stock" className="cursor-pointer">
                    In Stock
                  </label>
                </div>

                <div className="text-lg space-x-2">
                  <input type="checkbox" name="out-stock" id="out-stock" checked={outOfStockChecked} onChange={handleOutOfStockChange} />
                  <label htmlFor="out-stock" className="cursor-pointer">
                    Out of Stock
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input
                    type="checkbox"
                    name="newToOld"
                    id="newToOld"
                    checked={newToOld}
                    onChange={() => {
                      setNewToOld(!newToOld);
                      setOldToNew(false);
                    }}
                  />
                  <label htmlFor="newToOld" className="cursor-pointer">
                    New to old
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input
                    type="checkbox"
                    name="oldToNew"
                    id="oldToNew"
                    checked={oldToNew}
                    onChange={() => {
                      setOldToNew(!oldToNew);
                      setNewToOld(false);
                    }}
                  />
                  <label htmlFor="oldToNew" className="cursor-pointer">
                    Old to new
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input type="checkbox" name="height-selling" id="height-selling" checked={heightSelling} onChange={() => setHeightSelling(!heightSelling)} />
                  <label htmlFor="height-selling" className="cursor-pointer">
                    Height Selling
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input type="radio" name="price-range" id="heigh-low" onChange={() => setPriceState("desc")} />
                  <label htmlFor="heigh-low" className="cursor-pointer">
                    Price heigh to low
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input type="radio" name="price-range" id="low-heigh" onChange={() => setPriceState("asc")} />
                  <label htmlFor="low-heigh" className="cursor-pointer">
                    Price low to heigh
                  </label>
                </div>
                <div className="text-lg space-x-2">
                  <input type="radio" name="price-range" id="default-price" onChange={() => setPriceState("")} />
                  <label htmlFor="default-price" className="cursor-pointer">
                    Clear price
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* misty box */}
          <div className="my-5">
            <MistyBox />
          </div>
          <div className="my-5">
            <MistyBox />
          </div>
        </div>

        {/* products container */}
        <div className="relative lg:col-span-3 lg:grid lg:grid-cols-3 gap-4 mx-auto" style={{ height: "fit-content" }}>
          {isLoading && !isLoading2 && (
            <div className="col-span-3 absolute top-5 left-1/2 right-1/2 z-[7]">
              <Loader style={"bg-white"} />
            </div>
          )}
          {!isLoading && allProductsData.length == 0 && (
            <div className="col-span-3 flex flex-col items-center">
              <Image src="https://i.ibb.co/Nmm2QxV/empty-cart.png" alt="no product" height={256} width={265} className="w-64 h-64" />
              <p className="text-red-600 font-semibold">No product found in this category</p>
            </div>
          )}

          {/* showing products with pagination*/}
          {allProductsData?.slice((page - 1) * productPerPage, (page - 1) * productPerPage + productPerPage).map((singleProduct) => (
            <ProductCard1 key={singleProduct?._id} singleProduct={singleProduct}></ProductCard1>
          ))}
          {allProductsData?.length > 0 && (
            <div className="col-span-3 flex flex-col justify-center items-center">
              <Pagination count={totalPage} color="primary" page={page} onChange={handleChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionIdPage;
