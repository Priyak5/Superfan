import styled from "@emotion/styled";
import {
  space,
  color,
  layout,
  flexbox,
  position,
  typography,
  border,
  shadow,
  background,
} from "styled-system";

const Box = styled.div`
  box-sizing: border-box;
  min-width: 0;
  font-family: "Poppins", sans-serif;
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${position}
  ${typography}
  ${border}
  ${shadow}
  ${background}
`;

export default Box;
