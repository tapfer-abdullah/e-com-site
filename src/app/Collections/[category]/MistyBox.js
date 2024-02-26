"use client"
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/modules";

import { Autoplay, Pagination } from "swiper/modules";

const MistyBox = () => {
  return (
    <div className="w-full swiper-medicine">
      <Swiper
        className="w-full bg-red-200"
        spaceBetween={0}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        modules={[Autoplay, Pagination]}
      >
        <SwiperSlide>
          <div className="carousel-item h-96 w-full   relative">
            <div className="absolute top-8 left-16 text-center space-y-2">
              <h1 className="text-red-500 text-xl font-semibold">New Nowosc</h1>
              <h1 className="text-red-500 text-3xl font-bold">MEGA SALE</h1>
              <button type="button" className="text-base font-medium p-1 text-red-500 border rounded bg-transparent hover:bg-my-primary">
                Order Now
              </button>
            </div>
            <img className="w-full h-full" src="https://img.freepik.com/premium-vector/blue-box-with-magic-golden-light-dark-background_88653-185.jpg" alt="" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carousel-item h-96 w-full   relative">
            <div className="absolute top-8 left-16 text-center space-y-2">
              <h1 className="text-red-500 text-xl font-semibold">New Nowosc</h1>
              <h1 className="text-red-500 text-3xl font-bold">MEGA SALE</h1>
              <button type="button" className="text-base font-medium p-1 text-red-500 border rounded bg-transparent hover:bg-my-primary">
                Order Now
              </button>
            </div>
            <img className="w-full h-full" src="https://en.heimplanet.com/cdn/shop/files/Mystery-Box-23-Product-Pic-Slim_1024x1024.jpg?v=1699427492" alt="" />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="carousel-item h-96 w-full  relative">
            <div className="absolute top-8 left-12 text-center space-y-2">
              <h1 className="text-red-500 text-xl font-semibold">Probiocare Complete</h1>
              <h1 className="text-red-500 text-3xl font-bold">MEGA SALE</h1>
              <button type="button" className="text-base font-medium p-1 text-red-500 border rounded bg-transparent hover:bg-my-primary">
                Order Now
              </button>
            </div>
            <img className="w-full h-full" src="https://images.prismic.io/amiparis/65662481531ac2845a25693c_outofstock.png?auto=format,compress" alt="" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MistyBox;
