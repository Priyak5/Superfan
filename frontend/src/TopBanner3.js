import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import headerImg from "./money.png";
import "animate.css";
import TrackVisibility from "react-on-screen";
import Box from "./components/atoms/box.atom";
import handshake from "./handshake.png";

export const Banner3 = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["Passion to Career"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <Box pt="70px">
        <Box display="flex">
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility partialVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img src={headerImg} width="650px" alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Box px="50px">
            <span>
              <h1 style={{ fontSize: "70px" }}>
                {`Support your favourite content creators.`}{" "}
              </h1>
              <img src={handshake} height="90px" width="80px" />{" "}
            </span>
            <h3>Get access to exclusive content in the form of NFTs.</h3>
            {/* </div>
              )} */}
            {/* </TrackVisibility> */}
          </Box>
        </Box>
      </Box>
    </section>
  );
};
