import React from "react";
import AudioVisualizer from "./components/AudioVisualizer";
import ThemeToggle from "./components/ThemeToggle";
import GlobalStyles from "./styles/globalStyles";
import styled from "styled-components";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

function App() {
  return (
    <AppContainer>
      <GlobalStyles />
      <Header>
        <h1>Audio Visualizer</h1>
        <ThemeToggle />
      </Header>
      <AudioVisualizer />
    </AppContainer>
  );
}

export default App;
