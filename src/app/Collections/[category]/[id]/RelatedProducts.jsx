"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import ProductCard1 from "@/Components/CustomComponents/ProductCard1";
import ProductDetailsModal from "@/Components/CustomComponents/ProductModals/ProductDetailsModal";
import SectionTitle from "@/Components/CustomComponents/SectionTitle/SectionTitle";
import { FreeMode, Navigation, Pagination } from "swiper/modules";

const RelatedProducts = ({ title, subTitle, allProductsData }) => {
  return (
    <div className="mt-10">
      <div className="max-w-7xl mx-auto my-6">
        <SectionTitle title={title} subTitle={subTitle}></SectionTitle>

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
      </div>
    </div>
  );
};

export default RelatedProducts;
