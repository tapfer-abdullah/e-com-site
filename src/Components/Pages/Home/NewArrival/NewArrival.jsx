"use client";
import ProductCard1 from "@/Components/CustomComponents/ProductCard1";
import SectionTitle from "@/Components/CustomComponents/SectionTitle/SectionTitle";
import Loader from "@/Hooks/Loader/Loader";
import { axiosHttp } from "@/app/helper/axiosHttp";
import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Navigation, Pagination } from "swiper/modules";

const NewArrival = () => {
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
    <div>
      <div className="max-w-7xl mx-auto my-6">
        <SectionTitle title={"NEW ARRIVALS"} subTitle={"Browse the huge variety of our products"}></SectionTitle>

        {isLoading && <Loader className="my-10" />}

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
      </div>
    </div>
  );
};

export default NewArrival;
