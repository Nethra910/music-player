import { useContext } from "react";
import { PlayerContext, AudioTimeContext } from "../context/PlayerContext";

export function usePlayer() {
  const ctx = useContext(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayer must be used inside <PlayerProvider>");
  }

  return ctx;
}

/**
 * Fast-changing playback time. Only use in components that render
 * time/progress (PlayerBar, progress bars, fullscreen player timers).
 */
export function useAudioTime() {
  const ctx = useContext(AudioTimeContext);

  if (!ctx) {
    throw new Error("useAudioTime must be used inside <PlayerProvider>");
  }

  return ctx;
}
