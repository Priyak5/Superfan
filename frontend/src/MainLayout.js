import React from "react";
import Box from "./components/atoms/box.atom";
import Navbar from "./components/Navbar";
import TopFeatured from "./components/TopFeatured.js";
import image2 from "./mainpage22.png";
import { Banner } from "./TopBanner";
import { Banner2 } from "./TopBanner2";
import { CreatorContent } from "./Creator";
import { Banner3 } from "./TopBanner3";
import { Footer } from "./Footer";

const MainLayout = () => {
  return (
    <Box background="#000" height="100%" width="100%" overflow="scroll">
      <Navbar />
      <Banner />
      <Banner3 />
      <Banner2 />
      <CreatorContent />
      <TopFeatured />
      <Footer />
    </Box>
  );
};

export default MainLayout;
