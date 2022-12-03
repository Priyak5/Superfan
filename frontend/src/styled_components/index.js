import styled from "@emotion/styled";

export const ResizableButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: ${(props) => props.border || "1px solid #2781E7"};
  border-radius: ${(props) => props.borderRadius || "1%"};
  color: ${(props) => props.color || "#2781E7"};
  background-color: ${(props) => props.bgColor || "#ffffff"};
  margin: "auto";
  font-size: ${(props) => props.fontSize || "12px"};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  min-width: ${(props) => props.minWidth || "50px"};
  min-height: 30px;
  background: ${(props) => props.bgGradient};
  padding: ${(props) => props.pA || "5px"};
  padding-bottom: ${(props) => props.pB || "5px"};
  cursor: ${(props) => props.cursor || "pointer"};
  user-select: none;
  transition: all 0.8s;
  &:hover {
    background-color: ${(props) => props.hoverColor || "#2781E7"};
    color: ${(props) => props.hoverTextColor || "#ffffff"};
  }
`;

export const RoundedImage = styled.div`
  background-image: url("${(props) => props.src || ""}");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${(props) => props.borderRadius || "0%"};
  height: ${(props) => props.height || "none"};
  width: ${(props) => props.width || "0%"};
  border: ${(props) => props.borderStyle || "none"};
  object-fit: ${({ objectFit }) => objectFit || "unset"};
  margin-right: ${(props) => props.mR || "none"};
  margin-top: ${(props) => props.mT || "none"};
  cursor: ${(props) => props.cursor || "auto"};
`;
