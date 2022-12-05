import React, { useState } from "react";
import styled from "styled-components";
import Box from "./atoms/box.atom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { ResizableButton } from "../styled_components";
import { ClickAwayListener } from "@mui/base";
import { axiosInstance } from "../api";

function StartEarningBox({ handleClose, ticker, setPrice }) {
  const [cost, setCost] = useState();
  const onUpdateClick = (ticker = "", cost = "") => {
    axiosInstance
      .post("user/profile/", {
        ticker: ticker,
        price: cost,
      })
      .then(function (response) {
        const price = response.data.payload.price ?? "";
        setPrice(price);
      })
      .catch(function (error) {
        console.log(error);
      });
    handleClose();
  };
  console.log(cost);
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        height="300px"
        width="600px"
        background="#000"
        flexDirection="column"
        position="absolute"
        top="20%"
        left="500px"
        border="1px dashed #6D5CD3"
        borderRadius="8px"
        px="30px"
        py="30px"
      >
        <Box py="20px" color="#fff" fontWeight="600" fontSize="20px">
          {"Enter the amount you would like to earn per post"}
        </Box>
        <Box pb="20px" width="500px">
          <form noValidate>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel
                style={{
                  color: "#fff",
                }}
                htmlFor="outlined-adornment-amount"
              ></InputLabel>
              <OutlinedInput
                id="outlined-uncontrolled"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    {" "}
                    <Box color="#fff" fontSize="14px">
                      {"CCN"}
                    </Box>
                  </InputAdornment>
                }
                style={{
                  border: "1px solid #fff",
                  color: "#fff",
                  background: "#000",
                  borderRadius: "8px",
                }}
                label="Amount"
              />
            </FormControl>
          </form>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          onClick={() => cost && onUpdateClick(ticker, cost)}
        >
          <ResizableButton
            borderRadius="20px"
            color="#fff"
            bgColor={cost ? "#6D5CD3" : "#9c9c9c"}
            border={cost ? "1px solid  #6D5CD3" : "1px solid #9c9c9c"}
            hoverColor={cost ? "#6D5CD3" : "#9c9c9c"}
            height="54px"
            width="200px"
          >
            <Box fontSize="16px" fontWeight="600">
              {"Submit"}
            </Box>
          </ResizableButton>
        </Box>
      </Box>
    </ClickAwayListener>
  );
}

export default StartEarningBox;
