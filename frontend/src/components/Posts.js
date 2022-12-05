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
      <Box
        height="300px"
        width="300px"
        position="relative"
        display="flex"
        justifyContent="center"
      >
        <img src={url} />
      </Box>
    </>
  );
}

export default Posts;
