import React from "react";
import styled from "styled-components";
import Box from "./atoms/box.atom";

const GridWrapper = styled.div`
  margin-top: 3px;
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  width: 100%;
  padding-bottom: 100px;

  img {
    max-width: 100%;
  }
`;

function Posts({ url = "" }) {
  return (
    <>
      {url ? (
        <Box
          height="300px"
          width="300px"
          position="relative"
          display="flex"
          justifyContent="center"
        >
          <img src={url} />
        </Box>
      ) : (
        <Box
          height="300px"
          width="300px"
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <img
            style={{ filter: "blur(7px)" }}
            src="https://picsum.photos/200/300"
            alt=""
            height="100%"
            width="100%"
          />
          <Box
            zIndex="10"
            width="65px"
            fontSize="14px"
            color="#000"
            position="absolute"
            top="140px"
            right="120px"
          >
            {"Locked, subscribe to view"}
          </Box>
        </Box>
      )}
    </>
  );
}

export default Posts;
