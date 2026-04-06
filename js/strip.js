// ===== GENERATE STRIP =====
async function generateStrip() {
  if (capturedFrames.length < 4) { alert('Please capture 4 photos first!'); return; }

  document.getElementById('generatingOverlay').classList.add('visible');

  await delay(100);

  const theme = THEMES[currentTheme];
  const canvas = document.getElementById('stripCanvas');
  const ctx = canvas.getContext('2d');

  const PW = 320;
  const PH = Math.round(PW * 3 / 4);
  const PAD = 20;
  const GAP = 8;
  const HEADER = 60;
  const FOOTER = 55;

  const totalW = PW + PAD * 2;
  const totalH = HEADER + (PH + GAP) * 4 + FOOTER + PAD;

  canvas.width = totalW;
  canvas.height = totalH;

  // Background
  let bg = ctx.createLinearGradient(0, 0, 0, totalH);
  bg.addColorStop(0, theme.stripBg[0]);
  bg.addColorStop(1, theme.stripBg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, totalW, totalH);

  // Perforations (film-strip look)
  const perfW = 7, perfH = 11, perfGap = 16;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 0.5;
  for (let y = 20; y < totalH - 20; y += perfGap) {
    // left perf
    roundRect(ctx, 3, y, perfW, perfH, 2);
    // right perf
    roundRect(ctx, totalW - 10, y, perfW, perfH, 2);
  }

  // Header
  ctx.fillStyle = theme.borderColor;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(PAD, 10, PW, HEADER - 15);
  ctx.globalAlpha = 1;

  // Logo text
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.textColor;

  if (theme.font === 'Caveat') {
    ctx.font = `700 28px 'Caveat', cursive`;
  } else if (theme.font === 'Playfair Display') {
    ctx.font = `italic 22px 'Playfair Display', serif`;
  } else {
    ctx.font = `32px 'Bebas Neue', sans-serif`;
  }
  ctx.fillText('MoodStrip', totalW / 2, 42);

  ctx.font = `10px 'Space Mono', monospace`;
  ctx.fillStyle = theme.borderColor;
  ctx.globalAlpha = 0.6;
  ctx.fillText(theme.name.toUpperCase(), totalW / 2, 55);
  ctx.globalAlpha = 1;

  // Load and draw images
  const loadImg = (src) => new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = src;
  });

  for (let i = 0; i < 4; i++) {
    const img = await loadImg(capturedFrames[i]);
    const y = HEADER + i * (PH + GAP);

    // Border
    ctx.strokeStyle = theme.borderColor;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD - 1, y - 1, PW + 2, PH + 2);
    ctx.globalAlpha = 1;

    // Image
    ctx.drawImage(img, PAD, y, PW, PH);

    // Shot number badge
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(PAD, y, 22, 16);
    ctx.fillStyle = theme.borderColor;
    ctx.font = `9px 'Space Mono', monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(`0${i+1}`, PAD + 4, y + 11);
  }

  // Footer
  const footerY = HEADER + 4 * (PH + GAP) + 6;
  ctx.fillStyle = theme.borderColor;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(PAD, footerY, PW, FOOTER - 10);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.fillStyle = theme.textColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `9px 'Space Mono', monospace`;
  ctx.fillText(theme.caption, totalW / 2, footerY + 18);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  ctx.globalAlpha = 0.4;
  ctx.fillText(dateStr, totalW / 2, footerY + 32);
  ctx.globalAlpha = 1;

  // Film edge lines
  ctx.strokeStyle = theme.borderColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(12, 0); ctx.lineTo(12, totalH);
  ctx.moveTo(totalW - 12, 0); ctx.lineTo(totalW - 12, totalH);
  ctx.stroke();
  ctx.globalAlpha = 1;

  stripDataURL = canvas.toDataURL('image/png');
  canvas.style.display = 'block';
  document.getElementById('stripPlaceholder').style.display = 'none';
  document.getElementById('generatingOverlay').classList.remove('visible');
  document.getElementById('downloadBtn').disabled = false;
  document.getElementById('qrBtn').disabled = false;

  // Clear any old QR
  document.getElementById('qrBox').classList.remove('visible');
  document.getElementById('qrcode').innerHTML = '';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// ===== DOWNLOAD =====
function downloadStrip() {
  if (!stripDataURL) return;
  const a = document.createElement('a');
  a.href = stripDataURL;
  a.download = `moodstrip-${currentTheme}-${Date.now()}.png`;
  a.click();
}