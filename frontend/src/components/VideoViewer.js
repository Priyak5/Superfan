import React, { useRef, useEffect } from "react";
import Box from "./atoms/box.atom";

const VideoViewer = ({
  url = "",
  index,
  height = "400px",
  width = "250px",
  borderRadius = "6px",
}) => {
  const videoRef = useRef(null);

  // useEffect(() => {
  //   let options = {
  //     rootMargin: "0px",
  //     threshold: [0.25, 0.75],
  //   };

  //   let handlePlay = (entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         videoRef.current.play();
  //       } else {
  //         videoRef.current.pause();
  //       }
  //     });
  //   };

  //   let observer = new IntersectionObserver(handlePlay, options);

  //   observer.observe(videoRef.current);
  // });

  return (
    <Box
      width={width}
      display="flex"
      height={height}
      borderRadius={borderRadius}
      minWidth="fit-content"
      overflow="hidden"
      key={index}
    >
      <video
        src={url}
        autoPlay={false}
        muted
        title="video"
        height="100%"
        width={width}
        controls
        ref={videoRef}
      />
    </Box>
  );
};

export default VideoViewer;
