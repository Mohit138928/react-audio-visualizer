import React from "react";
import styled from "styled-components";

const StyledCanvas = styled.canvas`
  width: 100%;
  height: auto;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const AnimatedCanvas = React.forwardRef(
  ({ isVisible = true, ...props }, ref) => {
    return <StyledCanvas ref={ref} $isVisible={isVisible} {...props} />;
  }
);

export default AnimatedCanvas;
