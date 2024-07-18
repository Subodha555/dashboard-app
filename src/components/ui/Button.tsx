import { ReactNode } from "react";
import { Button as MButton } from "@mui/base/Button";
import { styled } from "styled-components";

const StyledButton = styled(MButton)`
  color: #ffffff;
  border-color: #0063b9;
  border-radius: 5px;
  background: #0063b9;
  font-size: x-large;
`;

interface ButtonProps {
  children: ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return <StyledButton> {children} </StyledButton>;
};

export default Button;
