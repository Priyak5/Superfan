import React from "react";
import styled from "styled-components";
import ProfileDetails from "../ProfileDetails";
import Tabs from "../Tags";
import PostGrid from "../PostGrid";
import SearchNavbar from "./SearchNavbar";
import { useSearchParams } from "react-router-dom";

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
  console.log(searchParams.get("ticker"));
  const ticker = searchParams.get("ticker");
  const name = searchParams.get("name");
  const cost = searchParams.get("cost");

  const profileData = {
    profile_picture: "https://picsum.photos/200/300",
    name: name,
    ticker: ticker,
    reward: cost,
    posts: "100",
    followers: "33.5K",
    following: "345",
    total_earnings: "1000 CCN",
    media: [],
  };

  return (
    <ProfileWrapper>
      <SearchNavbar />
      {/* <TopNav /> */}
      <ProfileDetails profileData={profileData} />
      <Tabs />
      <PostGrid profileData={profileData} />
    </ProfileWrapper>
  );
}

export default Profile;
