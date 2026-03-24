"use client";

import { useEffect, useRef } from "react";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const restartAndPlay = async () => {
      try {
        video.currentTime = 0;
      } catch {}

      try {
        await video.play();
      } catch {}
    };

    const handleLoadedMetadata = () => {
      void restartAndPlay();
    };

    const handleCanPlay = () => {
      void restartAndPlay();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);

    void restartAndPlay();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="block aspect-[16/10] w-full object-cover"
      src="/engage.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
    />
  );
}