import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "./colorsharp.png";
import Box from "./components/atoms/box.atom";
import image from "../src/components/TopCreators.js/check.png";
import c1 from "../src/c1.jpeg";
import c2 from "../src/c2.jpeg";
import c3 from "../src/c3.jpeg";
import c4 from "../src/c4.jpeg";
import c5 from "../src/c5.jpeg";
import c6 from "../src/c6.jpeg";

export const CreatorContent = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="skill" id="skills">
      <Box
        style={{
          backgroundImage: `url(${colorSharp})`,
          backgroundSize: "cover",
        }}
        justifyContent="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="600px"
      >
        <div className="row">
          <Box className="col-12">
            <Box
              width="1000px"
              py="50px"
              borderRadius="40px"
              background="#121316"
            >
              <h2>Top Creators</h2>

              <Carousel
                responsive={responsive}
                infinite={true}
                className="owl-carousel owl-theme skill-slider"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c1} alt="hi" width="100%" />
                  </Box>
                  <h5>Lifestyle</h5>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c2} alt="hi" width="100%" />
                  </Box>
                  <h5>Content creator</h5>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c3} alt="hi" width="100%" />
                  </Box>
                  <h5>Blogger</h5>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c4} alt="hi" width="100%" />
                  </Box>
                  <h5>Fashion blogger</h5>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c5} alt="hi" width="100%" />
                  </Box>
                  <h5>Content creator</h5>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    height="150px"
                    width="150px"
                    borderRadius="100%"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src={c6} alt="hi" width="100%" />
                  </Box>
                  <h5>Travel blogger</h5>
                </Box>
              </Carousel>
            </Box>
          </Box>
        </div>
      </Box>
    </section>
  );
};
