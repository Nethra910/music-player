import { useEffect } from "react";
import { usePlayer } from "./usePlayerContext";

export default function useKeyboardShortcuts(audioRef) {
  const { isPlaying, setIsPlaying, playNext, playPrev, currentSong } =
    usePlayer();

  useEffect(() => {
    const handler = (e) => {
      // Don't hijack keys while typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (!currentSong) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;

        case "ArrowRight":
          if (audioRef.current) audioRef.current.currentTime += 5;
          break;

        case "ArrowLeft":
          if (audioRef.current) audioRef.current.currentTime -= 5;
          break;

        case "KeyN":
          playNext();
          break;

        case "KeyP":
          playPrev();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlaying, setIsPlaying, playNext, playPrev, currentSong, audioRef]);
}
