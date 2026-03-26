"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const startPlayback = async () => {
      try {
        video.defaultMuted = true;
        video.muted = true;
        video.playsInline = true;
        await video.play();
      } catch {}
    };

    const handleLoadedData = async () => {
      if (cancelled) return;
      setIsReady(true);
      await startPlayback();
    };

    const handlePlaying = () => {
      if (cancelled) return;
      setIsReady(true);
    };

    video.defaultMuted = true;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("playing", handlePlaying);

    if (video.readyState >= 2) {
      setIsReady(true);
      void startPlayback();
    } else {
      video.load();
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      void video.play().catch(() => {});
    }
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a111b]">
      <img
        src="/engage-poster.jpg"
        alt="MathPickle classroom preview"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        src="/engage-hero.mp4"
        poster="/engage-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
      />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Turn sound on" : "Mute video"}
        className="absolute bottom-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white shadow-soft backdrop-blur-md transition hover:bg-black/60"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
}