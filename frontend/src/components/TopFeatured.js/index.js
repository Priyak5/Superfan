import React from "react";
import Box from "../atoms/box.atom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VideoViewer from "../VideoViewer";

const TopFeatured = () => {
  const videoUrls = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  ];
  return (
    <Box background="#000" height="500px" width="100%">
      <Box color="#fff" pb="35px" fontSize="36px" fontWeight="800">
        {"Top featured"}
      </Box>
      <Swiper
        slidesPerView={1}
        spaceBetween={2}
        navigation={true}
        modules={[Navigation]}
        className="creators"
        autoplay={{
          delay: 10,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {videoUrls.map((video, index) => {
          return (
            <SwiperSlide key={index}>
              <Box width="100%" display="flex" justifyContent="center">
                <VideoViewer url={video} />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default TopFeatured;
