"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import HomeBannerContent from "./HomeBannerContent";

export default function Banner() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div className="pt-18">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        <SwiperSlide>
          <HomeBannerContent title={"OdbhootStore"} subTitle="Enjoy the moment" bgImg={"https://i.ibb.co/g6z3QwZ/image.png"} destination={"Treat your-self"}></HomeBannerContent>
        </SwiperSlide>
        <SwiperSlide>
          <HomeBannerContent title={"OdbhootStore"} subTitle="Enjoy the moment" bgImg={"https://i.ibb.co/g6z3QwZ/image.png"} destination={"Treat your-self"}></HomeBannerContent>
        </SwiperSlide>
        <SwiperSlide>
          <HomeBannerContent title={"OdbhootStore"} subTitle="Enjoy the moment" bgImg={"https://i.ibb.co/g6z3QwZ/image.png"} destination={"Treat your-self"}></HomeBannerContent>
        </SwiperSlide>

        <div className="autoplay-progress hidden" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}></svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </div>
  );
}
