import React from "react";
import Box from "../atoms/box.atom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VideoViewer from "../VideoViewer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorsharp from "../../colorsharp.png";

const TopFeatured = () => {
  const videoUrls = [
    "https://drive.google.com/uc?id=1eQ2k3T5EhHTL4d2ieNBOpiauGiLeIwOo",
    "https://drive.google.com/uc?id=1DzrG23QSm3PvW8NJFkxh4qyyoZKPpy3m",
    "https://drive.google.com/uc?id=1OoMLEu5EFDNf0thi9_-1iaRB3ulCiTSQ",
    "https://drive.google.com/uc?id=1LG0BoQOJUrRt4GkGTCiwKHJSY_OefAH3",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  ];
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <Box
      style={{
        backgroundImage: `url(${colorsharp})`,
        backgroundSize: "cover",
      }}
      height="700px"
      width="100%"
      py="100px"
    >
      <Box color="#fff" pb="35px" fontSize="36px" fontWeight="800">
        {"Top featured"}
      </Box>
      <Carousel
        responsive={responsive}
        infinite={true}
        className="owl-carousel owl-theme skill-slider"
      >
        {videoUrls.map((video, index) => {
          return (
            <Box width="100%" display="flex" justifyContent="center">
              <VideoViewer url={video} />
            </Box>
          );
        })}
      </Carousel>
    </Box>
  );
};

export default TopFeatured;
