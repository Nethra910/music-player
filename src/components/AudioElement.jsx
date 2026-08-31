import { usePlayer } from "../context/PlayerContext";

/** Renders the ONE <audio> element for the entire app. */
export default function AudioElement() {
  const { audio } = usePlayer();
  const { audioRef, handleEnded, handleTimeUpdate, handleLoadedMetadata } =
    audio;

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
    />
  );
}
