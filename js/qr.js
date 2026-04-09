// ===== QR CODE =====
async function generateQR() {
  if (!stripDataURL) return;

  const qrBox = document.getElementById('qrBox');
  const qrDiv = document.getElementById('qrcode');
  const qrBtn = document.getElementById('qrBtn');

  // 🔒 Disable button + show loading state
  const originalText = qrBtn.innerText;
  qrBtn.disabled = true;
  qrBtn.innerText = "Generating QR...";

  qrDiv.innerHTML = `
    <p style="font-size:12px;color:var(--text-dim)">
      Uploading & generating QR...
    </p>
  `;

  try {
    // 🔥 Upload to Firebase
    const imageURL = await uploadStripToFirebase(stripDataURL);

    // Clear loading
    qrDiv.innerHTML = "";

    // Generate QR from real URL
    new QRCode(qrDiv, {
      text: imageURL,
      width: 140,
      height: 140,
      colorDark: '#000000',
      colorLight: '#f5eed8',
      correctLevel: QRCode.CorrectLevel.M
    });

    qrBox.classList.add('visible');

  } catch (e) {
    console.error("Firebase upload failed, using fallback QR", e);

    // ⚠️ FALLBACK (keeps app functional)
    qrDiv.innerHTML = "";

    const shareText = `MoodStrip – ${THEMES[currentTheme].name} – Captured ${new Date().toLocaleString()}`;

    new QRCode(qrDiv, {
      text: shareText,
      width: 140,
      height: 140,
      colorDark: '#000000',
      colorLight: '#f5eed8',
      correctLevel: QRCode.CorrectLevel.M
    });

    qrBox.classList.add('visible');
  }

  // 🔓 Restore button
  qrBtn.disabled = false;
  qrBtn.innerText = originalText;
}