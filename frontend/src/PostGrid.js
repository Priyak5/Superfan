import React, { useState } from "react";
import styled from "styled-components";
import Box from "./components/atoms/box.atom";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import Posts from "./components/Posts";

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
  width: 100%;
  padding-bottom: 100px;

  img {
    max-width: 100%;
  }
`;

function PostGrid(posts = []) {
  const buyMedia = async (e) => {
    const data = "xyz";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const viewMedia = new ethers.Contract("addr", "json", provider);
  };
  const media = posts.posts ?? [];
  console.log(media);
  const [loaded, setLoaded] = useState(false);

  return (
    <GridWrapper>
      {media.map((postImage, index) => (
        <Posts url={postImage.media_url} key={`media${index}`} />
      ))}
    </GridWrapper>
  );
}

export default PostGrid;
