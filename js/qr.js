// ===== QR CODE =====
function generateQR() {
  if (!stripDataURL) return;

  const qrBox = document.getElementById('qrBox');
  const qrDiv = document.getElementById('qrcode');
  qrDiv.innerHTML = '';

  const shareText = `MoodStrip – ${THEMES[currentTheme].name} – Captured ${new Date().toLocaleString()}`;

  try {
    new QRCode(qrDiv, {
      text: shareText,
      width: 140,
      height: 140,
      colorDark: '#000000',
      colorLight: '#f5eed8',
      correctLevel: QRCode.CorrectLevel.M
    });

    qrBox.classList.add('visible');

  } catch (e) {
    qrDiv.innerHTML = '<p style="font-size:11px;color:var(--text-dim)">QR generation failed.</p>';
    qrBox.classList.add('visible');
  }
}