import React from "react";
import Box from "./atoms/box.atom";
import mainImage from "../mainpage2.png";

const Image = () => {
  return (
    <Box display="flex" alignItems="center" height="800px" p="20px">
      <img src={mainImage} alt="hi" width="100%" />
    </Box>
  );
};

export default Image;
