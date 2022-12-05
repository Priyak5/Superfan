import React, { useState, useEffect } from "react";
import Box from "./atoms/box.atom";
import logo from "../logo.png";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { ResizableButton } from "../styled_components";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../api";
import { toast } from "react-toastify";

const SearchNavbar = () => {
  const [searchList, setSearchList] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  const getSearchList = (k) => {
    axiosInstance
      .get(`user/search/?q=${k}`)
      .then(function (response) {
        const message = response.data.message;
        if (message === "Successfully retrieved users") {
          const list = response.data.payload;
          const updatedList = [];
          list.forEach((element) => {
            const x = { ...element, label: element.name };
            updatedList.push(x);
          });
          setSearchList(updatedList);
        } else {
          toast.error(response.data.error_msg, {
            toastId: "search_failed",
            style: {
              background: "#FBF6F7",
              border: "1px solid #EF4F5F",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#EF4F5F",
            },
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.message, {
          toastId: "search_failed",
          style: {
            background: "#FBF6F7",
            border: "1px solid #EF4F5F",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#EF4F5F",
          },
        });
      });
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const isSelf = user_id === window.localStorage.getItem("user_id");

  const redirectToHome = (name) => {
    if (name !== "")
      window.open(`http://localhost:3001/superfan/mainpage`, "_self");
  };
  const redirectToSelf = () => {
    window.open(
      `http://localhost:3001/superfan/profile?user_id=${window.localStorage.getItem(
        "user_id"
      )}`,
      "_self"
    );
  };
  const redirectToProfile = (currentlySelected) => {
    window.open(
      `http://localhost:3001/superfan/profile?user_id=${currentlySelected}`,
      "_self"
    );
  };

  const [currentlySelected, setSelected] = useState("");

  useEffect(() => {
    if (currentlySelected) {
      redirectToProfile(currentlySelected.user_id);
    }
  }, [currentlySelected]);

  useEffect(() => {
    if (currentInput != "") getSearchList(currentInput);
  }, [currentInput]);

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
          options={searchList}
          inputValue={currentInput}
          onInputChange={(event, newInputValue) => {
            setCurrentInput(newInputValue);
          }}
          sx={{
            width: 600,
            borderRadius: "8px",
            borderColor: "#6d5cd3",
            background: "#fff",
          }}
          renderInput={(params) => <TextField {...params} label="Creators" />}
        />
      </Box>
      {!isSelf && (
        <Box pt="30px" pl="10px">
          <ResizableButton
            width="178px"
            borderRadius="20px"
            color="#fff"
            bgColor="#6D5CD3"
            border="1px solid 
          #6D5CD3"
            height="64px"
            onClick={redirectToSelf}
          >
            <Box fontSize="16px" fontWeight="600">
              {"Go to profile"}
            </Box>
          </ResizableButton>
        </Box>
      )}
    </Box>
  );
};

export default SearchNavbar;
