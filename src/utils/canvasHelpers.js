function clearCanvas(canvas) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWaveform(canvas, dataArray) {
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const sliceWidth = width / dataArray.length;
  let x = 0;

  context.lineWidth = 2;
  context.strokeStyle = "rgba(255, 255, 255, 0.8)";
  context.beginPath();

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0; // Normalize to [0, 1]
    const y = (v * height) / 2;

    if (i === 0) {
      context.moveTo(x, y + height / 2);
    } else {
      context.lineTo(x, y + height / 2);
    }
    x += sliceWidth;
  }

  context.lineTo(width, height / 2);
  context.stroke();
}

export const drawWaves = (canvas, audioData, color, sensitivity = 1) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();

  const sliceWidth = width / audioData.length;
  let x = 0;

  for (let i = 0; i < audioData.length; i++) {
    const v = (audioData[i] / 128.0) * sensitivity;
    const y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.stroke();
};

export const drawBars = (canvas, audioData, color, sensitivity = 1) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const barWidth = (width / audioData.length) * 2.5;
  const barGap = 2;

  for (let i = 0; i < audioData.length; i++) {
    const barHeight = (audioData[i] * sensitivity) / 255 * height;

    const x = i * (barWidth + barGap);
    const y = height - barHeight;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
};

const adjustColorBrightness = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export { clearCanvas, drawWaveform };
