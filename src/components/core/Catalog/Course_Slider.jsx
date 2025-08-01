import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import CourseCard from "./Course_Card";

function Course_Slider({ Courses }) {
  return (
    <div className="px-4 py-6">
      <div className="container mx-auto">
        {Courses?.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[FreeMode, Pagination, Navigation, Autoplay]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 25,
              },
            }}
            className="relative pb-10"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <CourseCard course={course} Height={"h-[160px]"} />
              </SwiperSlide>
            ))}

            {}
            <div className="swiper-button-prev !text-purple-400 !text-2xl !font-bold after:!text-2xl hover:!text-purple-300 transition-colors"></div>
            <div className="swiper-button-next !text-purple-400 !text-2xl !font-bold after:!text-2xl hover:!text-purple-300 transition-colors"></div>
          </Swiper>
        ) : (
          <p className="text-xl text-gray-500 text-center">No Courses Found</p>
        )}
      </div>
    </div>
  );
}

export default Course_Slider;
