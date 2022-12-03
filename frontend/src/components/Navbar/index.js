import React, { useRef, useState } from "react";
import { ResizableButton } from "../../styled_components";
import Box from "../atoms/box.atom";
import logo from "../../logo.png";
import { ethers } from "ethers";
// import ErrorMessage from "./ErrorMessage";

const signMessage = async ({ setError, message = "sign me up" }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    console.log(message, signature, address);

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    setError(err.message);
  }
};

const Navbar = () => {
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();

  const redirectToSignup = () => {
    window.open("http://localhost:3000/superfan/signup", "_self");
  };

  const handleSign = (e) => {
    const sig = signMessage({
      setError,
      message: "sign me up",
    });
    if (sig) {
      setSignatures([...signatures, sig]);
      redirectToSignup();
    }
  };

  return (
    <Box
      top="0px"
      position="absolute"
      width="100%"
      height="max-content"
      display="flex"
      justifyContent="space-between"
      background="#000"
      p="16px"
    >
      <Box pt="30px" pl="100px">
        <img src={logo} alt="logo" width="260px" />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        pt="15px"
        pl="345px"
        pr="150px"
        onClick={handleSign}
      >
        <ResizableButton
          width="178px"
          borderRadius="20px"
          color="#fff"
          bgColor="#6D5CD3"
          border="1px solid 
          #6D5CD3"
          height="64px"
        >
          <Box fontSize="16px" fontWeight="600">
            {"Connect to wallet"}
          </Box>
        </ResizableButton>
      </Box>
    </Box>
  );
};

export default Navbar;
