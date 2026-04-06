// ===== CAPTURE SESSION =====

async function startSession() {
  if (isCapturing) return;
  if (!stream) {
    alert('Camera not ready. Please allow camera access.');
    return;
  }

  isCapturing = true;
  capturedFrames = [];

  resetThumbs();

  document.getElementById('startBtn').disabled = true;
  document.getElementById('generateBtn').disabled = true;

  for (let i = 0; i < 4; i++) {
    markDotActive(i);

    await countdown(3);
    await captureFrame(i);

    markDotCaptured(i);

    await delay(400); // from utils.js
  }

  isCapturing = false;

  document.getElementById('startBtn').disabled = false;
  document.getElementById('generateBtn').disabled = false;

  document.getElementById('cameraStatus').innerHTML =
    '<span class="rec-dot"></span>4 frames captured';
}


// ===== COUNTDOWN =====

function countdown(seconds) {
  return new Promise(resolve => {
    let count = seconds;
    const numEl = document.getElementById('countdownNum');

    const tick = () => {
      if (count <= 0) {
        numEl.style.display = 'none';
        resolve();
        return;
      }

      numEl.textContent = count;
      numEl.style.display = 'block';

      // restart animation
      numEl.style.animation = 'none';
      numEl.offsetHeight;
      numEl.style.animation = 'countPulse 1s ease-out';

      count--;
      setTimeout(tick, 1000);
    };

    tick();
  });
}


// ===== CAPTURE FRAME =====

async function captureFrame(index) {
  const video = document.getElementById('video');
  const canvas = document.getElementById('captureCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  // Flash effect
  const flash = document.getElementById('flashOverlay');
  flash.classList.add('flashing');
  setTimeout(() => flash.classList.remove('flashing'), 150);

  // Mirror (selfie mode)
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Apply pixel filter
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  THEMES[currentTheme].label(imgData);
  ctx.putImageData(imgData, 0, 0);

  // Vignette
  applyVignette(ctx, canvas.width, canvas.height, THEMES[currentTheme].vignette);

  // Theme overlay
  THEMES[currentTheme].filter(ctx, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/jpeg', 0.92);
  capturedFrames[index] = dataURL;

  // Show thumbnail
  showThumb(index, dataURL);

  document.getElementById('cameraStatus').innerHTML =
    `<span class="rec-dot"></span>${index + 1}/4 captured`;
}


// ===== VIGNETTE =====

function applyVignette(ctx, w, h, color) {
  let g = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.85);

  g.addColorStop(0, 'transparent');
  g.addColorStop(1, color);

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}


// ===== UI HELPERS =====

function showThumb(index, dataURL) {
  const cell = document.getElementById(`thumb${index}`);
  cell.innerHTML =
    `<img src="${dataURL}">
     <span class="thumb-num">0${index + 1}</span>`;
}


function resetThumbs() {
  for (let i = 0; i < 4; i++) {
    const cell = document.getElementById(`thumb${i}`);

    cell.innerHTML =
      `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--text-dim);letter-spacing:.1em">
        0${i + 1}
      </span>`;

    const dot = document.getElementById(`dot${i}`);
    dot.className = 'progress-dot';
    dot.textContent = `0${i + 1}`;
  }
}


function markDotActive(i) {
  for (let j = 0; j < 4; j++) {
    const d = document.getElementById(`dot${j}`);
    if (j === i) d.classList.add('active');
    else d.classList.remove('active');
  }
}


function markDotCaptured(i) {
  const d = document.getElementById(`dot${i}`);
  d.classList.remove('active');
  d.classList.add('captured');
  d.textContent = '✓';
}


// ===== RESET SESSION =====

function resetSession() {
  capturedFrames = [];
  isCapturing = false;
  stripDataURL = null;

  resetThumbs();

  document.getElementById('startBtn').disabled = false;
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('downloadBtn').disabled = true;
  document.getElementById('qrBtn').disabled = true;

  document.getElementById('stripCanvas').style.display = 'none';
  document.getElementById('stripPlaceholder').style.display = 'block';

  document.getElementById('qrBox').classList.remove('visible');
  document.getElementById('qrcode').innerHTML = '';

  document.getElementById('cameraStatus').innerHTML =
    '<span class="rec-dot"></span>Ready';

  document.getElementById('countdownNum').style.display = 'none';
  document.getElementById('flashOverlay').classList.remove('flashing');
}