// This file contains utility functions for processing audio data and extracting relevant information for visualization.

export const getAudioData = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 2048;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    return {
        analyser,
        dataArray,
        getData: () => {
            analyser.getByteFrequencyData(dataArray);
            return dataArray;
        }
    };
};

export const calculateVolume = (dataArray) => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
};