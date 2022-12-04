import Box from "./components/atoms/box.atom";

export const Footer = () => {
  return (
    <Box
      height="100px"
      fontSize="16px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      background="#121316"
      color="#fff"
    >
      {"All rights reserved."}
    </Box>
  );
};
