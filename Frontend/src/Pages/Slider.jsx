import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";

const Slider = ({ links }) => {
  const swiperRef = useRef();
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.navigation.init();
      swiperRef.current.swiper.navigation.update();
    }
  }, []);
  return (
    <>
      <div className="lg:block md:block hidden w-full h-[90%] px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <motion.div
              key={index}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="shadow-lg shadow-black/10 flex flex-col items-end rounded-lg p-6 h-full bg-gradient-to-tr from-gray-400/10 to-black/80">
                <h2 className="text-xl w-full sm:text-2xl font-semibold text-white">
                  {link.name}
                </h2>
                <p className="h-2/2 text-gray-400 text-sm sm:text-base">
                  {link.desc}
                </p>
                <Link
                  to={link.link}
                  className="hover:scale-[1.03] transition-all duration-150 bg-[#ffffff] text-[#000000] text-sm font-bold tracking-wide px-6 py-2 rounded-full"
                >
                  {link.btnText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="lg:hidden md:hidden w-full h-[90%] overflow-hidden relative px-4">
        <div className="absolute right-[50%] top-[45%] z-10 px-2">
          <div className="swiper-btn-prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-arrow-left"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 12H8" />
              <path d="m12 8-4 4 4 4" />
            </svg>
          </div>
        </div>
        <Swiper
          className="w-full"
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={14}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-btn-prev",
            nextEl: ".swiper-btn-next",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {links.map((link, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="shadow-lg flex flex-col items-end rounded-lg p-6  h-full bg-gradient-to-tr from-gray-100/10 to-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <h2 className="text-xl w-full sm:text-2xl font-semibold text-white">
                  {link.name}
                </h2>
                <p className="h-2/2 text-gray-400 text-sm sm:text-base">
                  {link.desc}
                </p>
                <Link
                  to={link.link}
                  className="bg-[#ffffff] text-[#000000] text-sm font-bold tracking-wide px-6 py-2 rounded-full transition"
                >
                  Launch IDE
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute left-[50%] px-2 top-[45%] z-10 ">
          <div className="swiper-btn-next">
            <svg
              className="text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-arrow-right"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="m12 16 4-4-4-4" />
            </svg>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
