import React from "react";
import { useTheme } from "../hooks/useTheme";
import styled from "styled-components";

const ThemeButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: var(--primary);
  color: var(--background);
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeButton onClick={toggleTheme}>
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </ThemeButton>
  );
};

export default ThemeToggle;
