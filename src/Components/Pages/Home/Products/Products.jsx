"use client";
import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import ProductCard1 from "@/Components/CustomComponents/ProductCard1";
import SectionTitle from "@/Components/CustomComponents/SectionTitle/SectionTitle";
import { FreeMode, Navigation, Pagination } from "swiper/modules";

import Loader from "@/Hooks/Loader/Loader";
import { axiosHttp } from "@/app/helper/axiosHttp";
import "react-tabs/style/react-tabs.css";

import { OrderStateProvider } from "@/Components/State/OrderState";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import Image from "next/image";

const Products = () => {
  const [allProductsData, setAllProductsData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { category } = useContext(OrderStateProvider);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    axiosHttp.get(`/products?category=${category?.[value]?.title || ""}&status=Active`).then((res) => {
      setAllProductsData(res.data);
      setLoading(false);
    });
  }, [category, value]);

  return (
    <>
      <div className="products-cart-main-container max-w-7xl mx-auto mt-5">
        <SectionTitle title={"Shop By Category"} subTitle={"Browse the huge variety of our products"}></SectionTitle>

        <TabContext value={value}>
          <div className="flex justify-center -mt-6">
            <TabList onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
              {category?.map((sc, index) => (
                <Tab key={index} label={sc?.title} value={index} />
              ))}
            </TabList>
          </div>
          {isLoading && <Loader className="my-10" />}
          {!isLoading && allProductsData.length == 0 && (
            <div className="col-span-3 flex flex-col items-center">
              <Image src="https://i.ibb.co/Nmm2QxV/empty-cart.png" alt="no product" height={256} width={265} className="w-64 h-64" />
              <p className="text-red-600 font-semibold">No product found in this category</p>
            </div>
          )}
          {category?.map((sc, index) => (
            <TabPanel key={index} value={index}>
              <Swiper
                navigation={true}
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                  clickable: true,
                }}
                modules={[FreeMode, Pagination, Navigation]}
                className="mySwiper"
              >
                {allProductsData.length > 0 &&
                  allProductsData?.map((singleProduct) => (
                    <SwiperSlide key={singleProduct?._id}>
                      <ProductCard1 singleProduct={singleProduct}></ProductCard1>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </TabPanel>
          ))}
        </TabContext>
      </div>
    </>
  );
};

export default Products;
