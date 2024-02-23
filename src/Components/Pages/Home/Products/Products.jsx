"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const Products = () => {
  const [allProductsData, setAllProductsData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosHttp.get("/products").then((res) => {
      setAllProductsData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="products-cart-main-container max-w-7xl mx-auto mt-5">
        <SectionTitle title={"Shop By Category"} subTitle={"Browse the huge variety of our products"}></SectionTitle>
        {isLoading && <Loader className="my-10" />}

        <Tabs>
          <TabList className={"font-semibold text-lg"}>
            <Tab>Clothings</Tab>
            <Tab>Jewelry</Tab>
          </TabList>

          <TabPanel>
            <>
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
            </>
          </TabPanel>
          <TabPanel>
            <>
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
            </>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default Products;
