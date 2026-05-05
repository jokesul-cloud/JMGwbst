"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  options: any;
  onReady?: (player: any) => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoElement.classList.add("vjs-theme-golf");
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
      <div ref={videoRef} className="w-full h-full" />
      <style jsx global>{`
        .vjs-theme-golf .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }
        .vjs-theme-golf .vjs-play-progress {
          background-color: #22c55e;
        }
        .vjs-theme-golf .vjs-big-play-button {
          background-color: #22c55e;
          border-color: #22c55e;
          color: black;
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          margin-top: -40px;
          margin-left: -40px;
        }
        .vjs-theme-golf .vjs-big-play-button:hover {
          background-color: #16a34a;
          transform: scale(1.1);
          transition: all 0.2s;
        }
        .video-js {
          width: 100%;
          height: 100%;
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </div>
  );
};
