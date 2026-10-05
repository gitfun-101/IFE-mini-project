import Hls from 'hls.js';

if (Hls.isSupported()) {
  const video = document.getElementById('video');
  const hls = new Hls();
  hls.loadSource('https://video-stream-url.m3u8');
  hls.attachMedia(video);
}
