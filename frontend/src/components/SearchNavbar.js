import React, { useState, useEffect } from "react";
import Box from "./atoms/box.atom";
import logo from "../logo.png";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { background } from "styled-system";

const SearchNavbar = () => {
  const influencerList = [
    "addison",
    "khaby00",
    "hello123",
    "raul12",
    "kimk",
    "kyliej",
    "kimberly.loaiza",
    "loganpaul",
    "emmachamberlain",
    "zachking",
    "carlinhosmaiao",
    "bretmanrock",
    "carryminati",
    "bellapoarch",
    "domelipa",
    "loren",
    "duaLipa",
    "leeminho",
    "chaEun",
    "btsv",
    "btssuga",
  ];

  const redirectToProfile = (userId) => {
    if (userId !== "")
      window.open(
        `http://localhost:3000/superfan/profile?user_id=${userId}`,
        "_self"
      );
  };
  const redirectToHome = (name) => {
    if (name !== "")
      window.open(`http://localhost:3000/superfan/mainpage`, "_self");
  };

  const [currentlySelected, setSelected] = useState("");
  useEffect(() => {
    redirectToProfile(currentlySelected);
  }, [currentlySelected]);
  return (
    <Box
      width="100%"
      height="max-content"
      display="flex"
      justifyContent="space-between"
      background="#000"
      p="16px"
      borderBottom="1px solid #6d5cd3"
    >
      <Box
        pt="30px"
        pl="100px"
        onClick={redirectToHome}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="logo" width="260px" />
      </Box>
      <Box
        pr="200px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box fontSize="14px" pb="8px" fontWeight="500" color="#ebebeb">
          {"Search for your favourite content creators"}
        </Box>
        <Autocomplete
          disablePortal
          onChange={(event, value) => setSelected(value)}
          id="combo-box-demo"
          options={influencerList}
          sx={{
            width: 600,
            borderRadius: "8px",
            borderColor: "#6d5cd3",
            background: "#fff",
          }}
          renderInput={(params) => <TextField {...params} label="Creators" />}
        />
      </Box>
    </Box>
  );
};

export default SearchNavbar;
