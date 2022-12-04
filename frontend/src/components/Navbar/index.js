import React, { useRef, useState } from "react";
import { ResizableButton } from "../../styled_components";
import Box from "../atoms/box.atom";
import logo from "../../logo.png";
import { ethers } from "ethers";
import axios from "axios";
import noop from "lodash-es/noop";
import tick from "../../tick.png";

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
  const [isConnected, setIsConnceted] = useState(false);
  const isUserLoggedin =
    window.localStorage.getItem("user_id") === "" ||
    window.localStorage.getItem("user_id") === undefined;

  const redirectToSignup = () => {
    window.open("http://localhost:3000/superfan/signup", "_self");
  };

  const loginUser = (address, hash) => {
    const payload = {
      ethereum_address: address,
      signature_hash: hash,
    };
    axios
      .post("/user/login", payload)
      .then(function (response) {
        console.log(response);
        const userExists = !(response.data.payload.name === "");
        const userId = response.data.payload.user_id;

        const isError = response.data.error_msg;
        if (isError === "") {
          const accessToken = response.data.payload.jwt_credentials.access;
          window.localStorage.setItem("Authorization", `JWT ${accessToken}`);
          window.localStorage.setItem("user_id", `JWT ${userId}`);
          if (userExists) {
            redirectToProfile();
          } else {
            redirectToSignup();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSign = async (e) => {
    const sig = signMessage({
      setError,
      message: "You are signing into XFans.",
    });
    await sig;
    setSignatures([...signatures, sig]);
    setIsConnceted(true);
    loginUser();
  };
  const redirectToProfile = () => {
    window.open(
      `http://localhost:3000/superfan/profile?user_id=${window.localStorage.getItem(
        "user_id"
      )}`,
      "_self"
    );
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
        pr="180px"
        onClick={isConnected ? noop : handleSign}
      >
        {isConnected ? (
          <>
            <Box
              width="178px"
              borderRadius="20px"
              color="#fff"
              bgColor="#6D5CD3"
              height="64px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box fontSize="16px" fontWeight="600">
                {"Wallet connected"}
              </Box>
            </Box>
          </>
        ) : (
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
        )}
        {isUserLoggedin && (
          <Box pl="10px">
            <ResizableButton
              width="178px"
              borderRadius="20px"
              color="#fff"
              bgColor="#6D5CD3"
              border="1px solid 
          #6D5CD3"
              height="64px"
              onClick={redirectToProfile}
            >
              <Box fontSize="16px" fontWeight="600">
                {"Go to profile"}
              </Box>
            </ResizableButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
