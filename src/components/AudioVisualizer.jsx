import React, { useRef, useEffect, useState } from "react";
import { useAudioInput } from "../hooks/useAudioInput";
import { drawWaves, drawBars } from "../utils/canvasHelpers";
import styled from "styled-components";
import { motion } from "framer-motion";
import AnimatedCanvas from "./AnimatedCanvas";

const VisualizerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: var(--primary);
  color: var(--background);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }
`;

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const { startAudio, stopAudio, analyser } = useAudioInput();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visualizationType, setVisualizationType] = useState("waves");
  const [sensitivity, setSensitivity] = useState(1);
  const [primaryColor, setPrimaryColor] = useState("#00ff00");
  const animationFrameId = useRef(null);
  const [audioSource, setAudioSource] = useState("mic");

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    setAudioSource("mic");
    setIsPlaying(false);
    setIsPaused(false);

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);

    if (audioRef.current) {
      if (isPaused) {
        // Resume both audio and animation
        audioRef.current.play();
        draw();
      } else {
        // Pause both audio and animation
        audioRef.current.pause();
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      }
    }
  };

  const draw = () => {
    if (!analyser || !canvasRef.current || !isPlaying || isPaused) return;

    const canvas = canvasRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    if (visualizationType === "waves") {
      analyser.getByteTimeDomainData(dataArray);
      drawWaves(canvas, dataArray, primaryColor, sensitivity);
    } else {
      analyser.getByteFrequencyData(dataArray);
      drawBars(canvas, dataArray, primaryColor, sensitivity);
    }

    animationFrameId.current = requestAnimationFrame(draw);
  };

  const handleStart = async () => {
    try {
      await startAudio(audioSource, audioRef.current);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Failed to start audio:", error);
    }
  };

  const handleStop = () => {
    // Stop the animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    // Stop audio context and disconnect sources
    stopAudio();

    // Reset audio element and canvas
    resetAudio();

    // Release object URL if it exists
    if (audioRef.current.src) {
      URL.revokeObjectURL(audioRef.current.src);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      setAudioSource("file");
      await handleStart();
    }
  };

  const handleSnapshot = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
      link.download = `visualization-${timestamp}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case " ":
        event.preventDefault();
        setIsPaused((prev) => !prev);
        break;
      case "Enter":
        event.preventDefault();
        isPlaying ? handleStop() : handleStart();
        break;
      case "ArrowUp":
        setSensitivity((prev) => Math.min(prev + 0.1, 5));
        break;
      case "ArrowDown":
        setSensitivity((prev) => Math.max(prev - 0.1, 0.1));
        break;
    }
  };

  useEffect(() => {
    if (isPlaying && !isPaused) {
      draw();
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    isPlaying,
    isPaused,
    visualizationType,
    sensitivity,
    primaryColor,
    analyser,
  ]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  // Make sure to update the useEffect cleanup
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  return (
    <VisualizerContainer role="application" aria-label="Audio Visualizer">
      <Controls role="toolbar" aria-label="Visualization controls">
        <Button
          onClick={handleStart}
          disabled={isPlaying}
          aria-label="Start visualization"
        >
          Start
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isPlaying}
          aria-label="Stop visualization"
        >
          Stop
        </Button>
        <Button
          onClick={handlePauseResume}
          disabled={!isPlaying}
          aria-label={
            isPaused
              ? "Resume visualization and audio"
              : "Pause visualization and audio"
          }
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>

        <select
          value={visualizationType}
          onChange={(e) => setVisualizationType(e.target.value)}
          aria-label="Select visualization type"
        >
          <option value="waves">Waveform</option>
          <option value="bars">Frequency Bars</option>
        </select>

        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          aria-label="Choose visualization color"
        />

        <label htmlFor="sensitivity">
          Sensitivity
          <input
            id="sensitivity"
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            aria-label="Adjust visualization sensitivity"
          />
        </label>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="audio-upload"
          aria-label="Upload audio file"
        />
        <Button as="label" htmlFor="audio-upload">
          Upload Audio
        </Button>

        <Button
          onClick={handleSnapshot}
          disabled={!isPlaying}
          aria-label="Save visualization snapshot"
        >
          Save Snapshot
        </Button>
      </Controls>

      <AnimatedCanvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        width={800}
        height={400}
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
        role="img"
        aria-label="Audio visualization canvas"
      />

      <audio
        ref={audioRef}
        style={{ display: "none" }}
        onEnded={handleStop}
        aria-hidden="true"
      />
    </VisualizerContainer>
  );
};

export default AudioVisualizer;
