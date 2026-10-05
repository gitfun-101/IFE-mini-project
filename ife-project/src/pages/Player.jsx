import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import Header from '../components/Header';
import content from '../data/content.json';

export default function Player() {
  const { id } = useParams();
  const item = content.find(c => c.id === Number(id));
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  const videoUrl = item?.videoUrl;

  useEffect(() => {
    if (!videoUrl) return;

    const video = videoRef.current;
    let hls;
   

    if (Hls.isSupported()) {
      // Chrome, Edge, Firefox: hls.js feeds the segments to the video element
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError('Unable to play this title.');
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari plays HLS natively
      video.src = videoUrl;
    } else {
      setError('This browser cannot play this video.');
    }

    // Cleanup when you leave the page or switch titles
    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  if (!item) {
    return (
      <>
        <Header />
        <main className="page">
          <Link to="/" className="back">← Back</Link>
          <p>Title not found.</p>
        </main>
      </>
    );
  }
  

  return (
    <>
      <Header />
      <main className="page">
        <Link to="/" className="back">← Back</Link>

        <div className="video-wrap">
          <video
            ref={videoRef}
            controls
            playsInline
            onError={() => setError('Unable to play this title.')}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <h1 className="player-title">{item.title}</h1>
        <p className="category">{item.category}</p>
        <p>{item.description}</p>
      </main>
    </>
  );
}