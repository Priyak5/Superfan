import React from "react";
import Box from "../atoms/box.atom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import image from "./hi.jpeg";
import image2 from "./check.png";
import image3 from "./hello.jpeg";

const TopCreators = () => {
  const imageUrls = [
    image,
    image2,
    image3,
    image2,
    image,
    image2,
    image,
    image2,
    image,
    image,
    image,
    image,
    image,
  ];
  return (
    <Box background="#000" px="200px" height="400px" width="100%" pt="50px">
      <Box color="#fff" pb="35px" fontSize="36px" fontWeight="800">
        {"Top creators"}
      </Box>
      <Swiper
        slidesPerView={4}
        spaceBetween={1}
        navigation={true}
        modules={[Navigation]}
        className="creators"
        autoplay={{
          delay: 10,
          disableOnInteraction: false,
        }}
      >
        {imageUrls.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <Box
                height="150px"
                width="150px"
                borderRadius="100%"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img src={image} alt="hi" width="100%" />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default TopCreators;
