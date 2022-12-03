import React from "react";
import styled from "styled-components";
import Box from "./components/atoms/box.atom";
import Button from "@mui/material/Button";

const postImages = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
];

const GridWrapper = styled.div`
  margin-top: 3px;
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  img {
    max-width: 100%;
  }
`;

function PostGrid() {
  return (
    <GridWrapper>
      {postImages.map((postImage) => (
        <Box position="relative">
          <img style={{ filter: "blur(7px)" }} src={postImage} alt="" />
          <Box
            zIndex="10"
            top="140px"
            right="200px"
            position="absolute"
            width="65px"
            fontSize="14px"
            color="#ebebeb"
          >
            {"Locked, buy to view"}
          </Box>
          <Box top="200px" right="200px" position="absolute">
            <Button
              style={{ color: "#fff", border: "1px solid #fff" }}
              variant="outlined"
            >
              Buy
            </Button>
          </Box>
        </Box>
      ))}
    </GridWrapper>
  );
}

export default PostGrid;
