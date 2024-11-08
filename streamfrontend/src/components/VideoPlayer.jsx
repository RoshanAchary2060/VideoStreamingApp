import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: "true",
    });

    // If HLS.js is supported, initialize HLS for playback
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari or other native HLS-supported browsers
      videoRef.current.src = src;
      videoRef.current.addEventListener("canplay", () => {
        videoRef.current.play();
      });
    } else {
      console.error("HLS is not supported by your browser.");
    }
  }, [src]);

  return (
    <div className="video-player-container">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-control-bar"
          style={{
            width: "100%",  // Makes the video responsive
            height: "auto", // Maintains aspect ratio
          }}
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
