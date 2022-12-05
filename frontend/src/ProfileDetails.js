import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "./components/atoms/box.atom";
import { ResizableButton } from "./styled_components";
import Modal from "@mui/material/Modal";
import AddImageBox from "./components/AddImageBox";
import get from "lodash-es/get";
import StartEarningBox from "./components/StartEariningBox";
import defaultImage from "../src/components/TopCreators.js/check.png";
import { startPayment } from "../src/funcs";
import ErrorMessage from "./components/ErrorMessage";
import { useSearchParams } from "react-router-dom";
import Tabs from "./Tags";
import PostGrid from "./PostGrid";

const ProfileDetailsWrapper = styled.div`
  align-items: baseline;
  justify-content: center;
  display: flex;
`;

const ProfileImage = styled.img`
  max-width: 200px;
  border: 1px solid #919191;
  border-radius: 100%;
  padding: 4px;
  flex-basis: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileStats = styled.div`
  display: flex;
  justify-content: space-between;
  flex-basis: 60%;
  padding-right: 100px;
  padding-top: 38px;
  width: 100%;
  align-items: center;
`;

const StatsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatsNumber = styled.span`
  font-weight: 600;
  font-size: 17px;
`;

const StatsLabel = styled.span`
  margin-top: 5px;
  text-transform: capitalize;
  letter-spacing: 1px;
  font-size: 18px;
  color: #ebebeb;
`;

const ProfileCategory = styled.span`
  color: #919191;
  font-size: 15px;
  align-items: flex-start;
  display: flex;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ProfileDetails({ profileData, isSelf, setData, getProfileData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const user_id = searchParams.get("user_id");
  const [price, setPrice] = useState();
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [displayPicture, setDisplayPicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState("");
  const [error, setError] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const sendPrice = price * 10 ** 18;

  useEffect(() => {
    if (isSuccess) {
      getProfileData();
    }
  }, [isSuccess]);

  const onSubscribeClick = () => {
    startPayment(
      price,
      setError,
      contractAddress,
      getProfileData,
      setIsSuccess
    );
  };

  const isUsersProfile = user_id == window.localStorage.getItem("user_id");

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProfile, setOpenProfile] = useState(false);
  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const [openCost, setOpenCost] = useState();
  const handleOpenCost = () => {
    setOpenCost(true);
  };
  const handleCloseCost = () => setOpenCost(false);

  useEffect(() => {
    setError("");
    const displayPictureurl = get(profileData, "profile_pic", "");
    setDisplayPicture(displayPictureurl);
    const name = get(profileData, "name", "");
    setName(name);
    const tickerb = get(profileData, "ticker", "");
    setTicker(tickerb);
    const cost = get(profileData, "price", "");
    setPrice(cost);
    const posts = get(profileData, "posts", "");
    setPosts(posts);
    const totalEarnings = get(profileData, "total_earnings", "");
    setTotalEarnings("1000");
    const contractAddress = get(profileData, "contract_address", "");
    setContractAddress(contractAddress);
  }, [profileData]);

  const updatePostList = (currentImage) => {
    const newPosts = [];
    console.log(currentImage.data);
    newPosts.push(currentImage);
    posts.forEach((post) => {
      newPosts.push(post);
    });
    setPosts(newPosts);
  };

  const currentlyEarning = price === "0" || price === undefined;
  const isSubscribed =
    !isUsersProfile && posts && posts[0] && posts[0].media_url !== "";

  return (
    <>
      <Box width="100%" display="flex" flexDirection="horizontal">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py="20px"
          width="30%"
          flexDirection="column"
        >
          <Box
            height="250px"
            width="250px"
            borderRadius="100%"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {displayPicture ? (
              <img src={displayPicture} alt="hi" width="100%" />
            ) : (
              <img src={defaultImage} width="100%" />
            )}
          </Box>
          {isUsersProfile && (
            <Box onClick={handleOpenProfile} width="40%" py="20px">
              <ResizableButton
                borderRadius="20px"
                color="#fff"
                bgColor="#6D5CD3"
                border="1px solid #3820e9"
                height="54px"
              >
                <Box fontSize="16px" fontWeight="600">
                  {displayPicture
                    ? "Update profile picture"
                    : "Add profile picture"}
                </Box>
              </ResizableButton>
              <Modal open={openProfile} onClose={handleCloseProfile}>
                <AddImageBox
                  handleClose={handleCloseProfile}
                  type="PROFILE_PIC"
                  callback={setDisplayPicture}
                />
              </Modal>
            </Box>
          )}
          <Box
            pt="16px"
            fontSize="16px"
            fontWeight="500 "
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {name}
          </Box>
          <ProfileCategory>Content creator</ProfileCategory>
          <Box
            pt="16px"
            fontSize="16px"
            fontWeight="500 "
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {ticker}
          </Box>
          {isSubscribed && (
            <Box
              mt="10px"
              display="flex"
              width="178px"
              borderRadius="20px"
              color="#fff"
              bgColor="#0000"
              border="1px solid 
          #6D5CD3"
              height="54px"
              hoverColor="none"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box fontSize="16px" fontWeight="600">
                {"Subscribed"}
              </Box>
            </Box>
          )}
          {!isUsersProfile && !isSubscribed && (
            <Box
              pt="30px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <ResizableButton
                width="178px"
                borderRadius="20px"
                color="#fff"
                bgColor="#6D5CD3"
                border="1px solid 
          #6D5CD3"
                height="54px"
                onClick={onSubscribeClick}
              >
                <Box fontSize="16px" fontWeight="600">
                  {"Subscribe to view content"}
                </Box>
              </ResizableButton>
              {error && (
                <Box
                  mt="15px"
                  py="14px"
                  width="400px"
                  fontSize="16px"
                  border="1px solid red"
                  borderRadius="10px"
                  background="#000"
                  color="red"
                >
                  {error}
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Box
          width="70%"
          justifyContent="space-around"
          display="flex"
          flexDirection="column"
        >
          <ProfileDetailsWrapper>
            {/* profile image */}
            <ProfileStats>
              <StatsBlock>
                <StatsLabel>posts</StatsLabel>
                <StatsNumber>{posts.length}</StatsNumber>
              </StatsBlock>
              <StatsBlock>
                <StatsLabel>followers</StatsLabel>
                <StatsNumber>
                  {Math.floor(Math.random() * (10000 - 10 + 1)) + 1}
                </StatsNumber>
              </StatsBlock>
              <StatsBlock>
                <StatsLabel>following</StatsLabel>
                <StatsNumber>
                  {Math.floor(Math.random() * (100 - 10 + 1)) + 1}
                </StatsNumber>
              </StatsBlock>
            </ProfileStats>
          </ProfileDetailsWrapper>

          <Box display="flex" justifyContent="center" pr="50px">
            {isUsersProfile && (
              <Box
                py="20px"
                borderRadius="16px"
                border="2px solid #6D5CD3"
                width="50%"
                fontSize="16px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box fontWeight="800">{"Total earnings : "}</Box>
                <Box
                  fontSize="16px"
                  fontWeight="800"
                  color="#6D5CD3"
                  pl="100px"
                >
                  {totalEarnings}
                </Box>
              </Box>
            )}
            <Box
              py="20px"
              borderRadius="16px"
              border="2px solid #6D5CD3"
              width="50%"
              fontSize="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              ml="26px"
            >
              <Box fontWeight="800">{"Subscription cost: "}</Box>
              <Box fontSize="16px" fontWeight="800" color="#6D5CD3" pl="100px">
                {price}
                {" CCN"}
              </Box>
            </Box>
          </Box>

          {isUsersProfile && (
            <Box display="flex" justifyContent="center" pr="50px">
              <Box onClick={handleOpen} width="40%">
                <ResizableButton
                  borderRadius="20px"
                  color="#fff"
                  bgColor="#6D5CD3"
                  border="1px solid #3820e9"
                  height="54px"
                >
                  <Box fontSize="16px" fontWeight="600">
                    {"New post"}
                  </Box>
                </ResizableButton>
                <Modal open={open} onClose={handleClose}>
                  <AddImageBox
                    handleClose={handleClose}
                    type="POST"
                    callback={updatePostList}
                  />
                </Modal>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Tabs />
      <PostGrid posts={posts} />
    </>
  );
}

export default ProfileDetails;
