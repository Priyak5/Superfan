import React from "react";
import Box from "./components/atoms/box.atom";
import Navbar from "./components/Navbar";

const MainLayout = () => {
  return (
    <Box background="#000" height="100%" width="100%" overflow="scroll">
      <Navbar />
    </Box>
  );
};

export default MainLayout;
