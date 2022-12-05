import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProfileDetails from "../ProfileDetails";
import Tabs from "../Tags";
import PostGrid from "../PostGrid";
import SearchNavbar from "./SearchNavbar";
import { useSearchParams } from "react-router-dom";
import Box from "./atoms/box.atom";
import { axiosInstance } from "../api";
import { CircularProgress } from "@mui/material";
import { ResizableButton } from "../styled_components";
const ProfileWrapper = styled.div`
  background-color: #000;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }
`;

function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const [profileData, setData] = useState({});
  const valid = !(user_id === null);

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = () => {
    setIsLoading(true);
    setIsError(false);
    axiosInstance
      .get(`user/profile/${user_id}`)
      .then(function (response) {
        setIsLoading(false);
        setIsError(false);

        const message = response.data.message;
        if (message === "Successfully retrieved data") {
          const profile = response.data.payload;
          setData(profile);
        } else {
          setIsLoading(false);
          setIsError(true);
          //toast
        }
      })
      .catch(function (error) {
        console.log(error);

        setIsLoading(false);
        setIsError(true);
      });
  };

  const onReload = () => {
    getProfileData();
  };

  const isSelf = user_id === profileData.userId;

  if (isLoading) {
    return (
      <Box
        borderTop="1px solid #d6d6d6"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="500px"
        width="578px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <ProfileWrapper>
        <SearchNavbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Box
            borderTop="1px solid #d6d6d6"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="500px"
            width="578px"
          >
            {"Something went wrong, try again!"}
          </Box>
          <ResizableButton
            borderRadius="20px"
            color="#fff"
            bgColor="#6D5CD3"
            border="1px solid #3820e9"
            height="54px"
            onClick={onReload}
            width="200px"
          >
            <Box fontSize="16px" fontWeight="600">
              {"Retry"}
            </Box>
          </ResizableButton>
        </Box>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <SearchNavbar />
      {valid ? (
        <>
          <ProfileDetails
            profileData={profileData}
            isSelf={isSelf}
            setData={setData}
          />
          {/* <Tabs />
          <PostGrid posts={profileData.posts} /> */}
        </>
      ) : (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="50px"
          fontWeight="500"
        >
          {"Invalid user :("}
        </Box>
      )}
    </ProfileWrapper>
  );
}

export default Profile;
