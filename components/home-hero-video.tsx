"use client";

import { useEffect, useRef, useState } from "react";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);

    const handleReady = async () => {
      try {
        video.currentTime = 0;
      } catch {}

      try {
        await video.play();
      } catch {}

      setIsReady(true);
    };

    const handleLoadedMetadata = () => {
      try {
        video.currentTime = 0;
      } catch {}
    };

    const handleCanPlay = () => {
      handleReady();
    };

    video.pause();
    try {
      video.currentTime = 0;
    } catch {}

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);

    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

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
    </div>
  );
}