import { usePlayer } from "../hooks/usePlayerContext";

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
    >
      {/*
        No caption source exists for streamed tracks yet. An empty
        track keeps the element spec-compliant and signals to
        assistive tech that captions were considered, not omitted.
      */}
      <track kind="captions" label="No captions available" default />
    </audio>
  );
}
