import React, { useState } from "react";
import styled from "styled-components";
import Box from "./components/atoms/box.atom";
import { ResizableButton } from "./styled_components";
import Modal from "@mui/material/Modal";
import AddImageBox from "./components/AddImageBox";
import get from "lodash-es/get";
import StartEarningBox from "./components/StartEariningBox";

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

function ProfileDetails({ profileData = {}, isSelf = false }) {
  const [open, setOpen] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [price, setPrice] = useState();
  const [ticker, setTicker] = useState("");
  const isUsersProfile = isSelf;

  const [openCost, setOpenCost] = useState();
  const handleOpenCost = () => {
    setOpenCost(true);
  };
  const handleCloseCost = () => setOpenCost(false);

  const displayPicture = get(
    profileData,
    "profile_picture",
    "https://www.pakainfo.com/wp-content/uploads/2021/09/image-url-for-testing.jpg"
  );
  const name = get(profileData, "name", "");
  const tickerb = get(profileData, "ticker", "");
  const cost = get(profileData, "reward", "");
  const posts = get(profileData, "posts", "");
  const followers = get(profileData, "followers", "");
  const following = get(profileData, "following", "");
  const totalEarnings = get(profileData, "total_earnings", "");

  const currentlyEarning = cost === "0" || cost === undefined;

  return (
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
          <img src={displayPicture} alt="hi" width="100%" />
        </Box>
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
              <StatsNumber>{posts}</StatsNumber>
            </StatsBlock>
            <StatsBlock>
              <StatsLabel>followers</StatsLabel>
              <StatsNumber>{followers}</StatsNumber>
            </StatsBlock>
            <StatsBlock>
              <StatsLabel>following</StatsLabel>
              <StatsNumber>{following}</StatsNumber>
            </StatsBlock>
          </ProfileStats>
        </ProfileDetailsWrapper>
        {isUsersProfile && (
          <Box display="flex" justifyContent="center" pr="50px">
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
              <Box fontSize="16px" fontWeight="800" color="#6D5CD3" pl="100px">
                {totalEarnings}
              </Box>
            </Box>
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
              <Box fontWeight="800">{"Current earnings/post: "}</Box>
              <Box fontSize="16px" fontWeight="800" color="#6D5CD3" pl="100px">
                {cost}
                {" CCN"}
              </Box>
            </Box>
          </Box>
        )}
        {isUsersProfile && (
          <Box display="flex" justifyContent="center" pr="50px">
            <Box onClick={handleOpen} width="40%">
              <ResizableButton
                borderRadius="20px"
                color="#fff"
                bgColor="#6D5CD3"
                border="1px solid 
          #3820e9"
                height="54px"
              >
                <Box fontSize="16px" fontWeight="600">
                  {"New post"}
                </Box>
              </ResizableButton>
              <Modal open={open} onClose={handleClose}>
                <AddImageBox handleClose={handleClose} />
              </Modal>
            </Box>
            <Box
              // onClick={handleSign}
              width="40%"
              ml="46px"
            >
              <ResizableButton
                borderRadius="20px"
                color="#fff"
                bgColor="#6D5CD3"
                border="1px solid 
          #3820e9"
                height="54px"
                onClick={handleOpenCost}
              >
                <Box fontSize="16px" fontWeight="600">
                  {currentlyEarning
                    ? "Start earning today"
                    : "Update earning/post"}
                </Box>
              </ResizableButton>
              <Modal open={openCost} onClose={handleCloseCost}>
                <StartEarningBox
                  handleClose={handleCloseCost}
                  ticker={ticker}
                  setPrice={setPrice}
                />
              </Modal>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProfileDetails;
