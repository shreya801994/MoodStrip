// ===== FILTER FUNCTIONS =====
function applySepia(imgData, amount, contrast, brightness) {
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    // brightness
    r *= brightness; g *= brightness; b *= brightness;
    // contrast
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;
    // sepia
    let sr = Math.min(255, r * (1-amount) + (r * 0.393 + g * 0.769 + b * 0.189) * amount);
    let sg = Math.min(255, g * (1-amount) + (r * 0.349 + g * 0.686 + b * 0.168) * amount);
    let sb = Math.min(255, b * (1-amount) + (r * 0.272 + g * 0.534 + b * 0.131) * amount);
    d[i] = Math.max(0, Math.min(255, sr));
    d[i+1] = Math.max(0, Math.min(255, sg));
    d[i+2] = Math.max(0, Math.min(255, sb));
  }
  return imgData;
}

function applyBW(imgData, contrast, brightness) {
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
    gray = (gray - 128) * contrast + 128;
    gray *= brightness;
    gray = Math.max(0, Math.min(255, gray));
    d[i] = d[i+1] = d[i+2] = gray;
  }
  return imgData;
}

function applyWarm(imgData, saturation, contrast) {
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    let avg = (r + g + b) / 3;
    r = avg + (r - avg) * saturation;
    g = avg + (g - avg) * saturation;
    b = avg + (b - avg) * saturation;
    r = (r - 128) * contrast + 128 + 15;
    g = (g - 128) * contrast + 128 + 5;
    b = (b - 128) * contrast + 128 - 10;
    d[i] = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }
  return imgData;
}

function applyMuted(imgData, saturation, contrast) {
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    let avg = (r + g + b) / 3;
    r = avg + (r - avg) * saturation;
    g = avg + (g - avg) * saturation;
    b = avg + (b - avg) * saturation;
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;
    d[i] = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }
  return imgData;
}