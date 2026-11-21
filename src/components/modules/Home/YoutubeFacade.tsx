"use client";

import { useState } from "react";

export default function YoutubeFacade() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/xcCCAqhuMcc?si=Wvd4G8p2wRCpXZd0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted text-foreground font-semibold text-lg"
      aria-label="Play video"
      onClick={() => setPlaying(true)}
    >
      Play
    </button>
  );
}