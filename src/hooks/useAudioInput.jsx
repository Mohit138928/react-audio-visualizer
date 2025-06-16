  import { useState, useEffect, useRef } from "react";

export const useAudioInput = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [analyser, setAnalyser] = useState(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  const setupAudioSource = async (sourceType, audioElement = null) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const analyserNode = audioContextRef.current.createAnalyser();
      analyserNode.fftSize = 2048;

      if (sourceType === "mic") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserNode);
      } else if (sourceType === "file" && audioElement) {
        const source = audioContextRef.current.createMediaElementSource(audioElement);
        source.connect(analyserNode);
        analyserNode.connect(audioContextRef.current.destination);
        audioElement.play();
      }

      setAnalyser(analyserNode);
      setIsAudioActive(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const startAudio = async (sourceType = "mic", audioElement = null) => {
    await setupAudioSource(sourceType, audioElement);
  };

  const stopAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAnalyser(null);
    setIsAudioActive(false);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return { audioData, analyser, startAudio, stopAudio, isAudioActive };
};
