// ===== CAMERA =====
async function initCamera() {
  document.getElementById('camError').classList.remove('visible');

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 960 }
      },
      audio: false
    });

    const video = document.getElementById('video');
    video.srcObject = stream;
    await video.play();

    // apply current theme filter
    updateFilterOverlay();

  } catch (e) {
    document.getElementById('camError').classList.add('visible');
    console.error('Camera error:', e);
  }
}