import React from "react";
import Box from "./components/atoms/box.atom";
import Navbar from "./components/Navbar";
import Image from "./components/Image";
import TopCreators from "./components/TopCreators.js";
import TopFeatured from "./components/TopFeatured.js";
import mainImage from "./mainpage2.png";
import image2 from "./mainpage22.png";

const MainLayout = () => {
  return (
    <Box background="#000" height="5000px" width="100%" overflow="scroll">
      <Navbar />
      <Image />
      <Box display="flex" alignItems="center" height="800px" p="20px">
        <img src={image2} alt="hi" width="100%" />
      </Box>
      <TopCreators />
      <TopFeatured />
      <Box fontSize="56px" fontWeight="800" color="#fff">
        {"NEXT GENERATION"}
      </Box>
      <Box fontSize="56px" fontWeight="900" color="#9E6DEE" py="12px">
        {"WEB3 SOCIAL MEDIA PLATFORM"}
      </Box>
      <Box fontSize="36px" fontWeight="500" color="#fff" pt="14px">
        {
          "Communities without borders. A social network owned and operated by its users."
        }
      </Box>
    </Box>
  );
};

export default MainLayout;
