"use client";

import { useEffect } from "react";

// Injects the RevTrack attribution snippet into <head> for as long as this
// component is mounted, and removes it on unmount. Rendered only where
// RevTrack should track (the in-app booking step), not site-wide, since
// RevTrack ties video-driven traffic to reaching the calendar specifically.
export default function RevTrackTag() {
  useEffect(() => {
    const metaUsername = document.createElement("meta");
    metaUsername.name = "username";
    metaUsername.content = "user_3CiuDufJh5brPzPKL9D6OxBpEIE";

    const metaOffer = document.createElement("meta");
    metaOffer.name = "offer";
    metaOffer.content = "Body Assessment";

    const script = document.createElement("script");
    script.src = "https://d15dfsr886zcp9.cloudfront.net/tracker_script.js";
    script.defer = true;

    document.head.appendChild(metaUsername);
    document.head.appendChild(metaOffer);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(metaUsername);
      document.head.removeChild(metaOffer);
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
