import React from "react";
import styled from "styled-components";
import ProfileDetails from "../ProfileDetails";
import Tabs from "../Tags";
import PostGrid from "../PostGrid";
import SearchNavbar from "./SearchNavbar";
import { useSearchParams } from "react-router-dom";
import Box from "./atoms/box.atom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  const valid = !(user_id === null);
  console.log(user_id, valid);

  const profileData = {
    profile_picture: "",
    name: "priya",
    ticker: "hello",
    reward: "100",
    posts: "100",
    followers: "33.5K",
    following: "345",
    total_earnings: "1000 CCN",
    media: [],
  };

  const isSelf = user_id === profileData.userId;

  return (
    <ProfileWrapper>
      <SearchNavbar />
      {valid ? (
        <>
          <ProfileDetails profileData={profileData} isSelf={isSelf} />
          <Tabs />
          <PostGrid profileData={profileData} />
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
