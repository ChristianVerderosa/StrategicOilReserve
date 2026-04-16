/**
 * animation.js — Hero video with fade-to-black loop
 * Fades the video element itself to black and back in on each loop.
 * Text and buttons in front of the video are unaffected.
 */
(function () {

  const video = document.getElementById('heroVideo');
  if (!video) return;

  // Apply transition directly to the video element
  video.style.transition = 'opacity 1.4s ease';

  // ── Start playback once metadata is ready ─────────────────────
  video.addEventListener('loadedmetadata', () => {
    video.play().catch(() => {
      console.warn('[SOR] Autoplay blocked — user interaction required.');
    });
  });

  // ── On end: fade video out → reset → fade back in ─────────────
  video.addEventListener('ended', () => {
    // 1. Fade video to black (1.4 s)
    video.style.opacity = '0';

    setTimeout(() => {
      // 2. Reset and restart while video is invisible
      video.currentTime = 0;
      video.play().catch(() => {});

      // 3. Short pause so the first frame is decoded, then fade in
      setTimeout(() => {
        video.style.opacity = '1';
      }, 120);

    }, 1500); // slightly longer than transition so it's fully black first
  });

})();
