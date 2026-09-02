import { useEffect, useRef, useState, useCallback } from "react";
import { getAudioUrl } from "../utils/format";

/**
 * The single audio engine for the whole app.
 * Receives player state as a parameter — does NOT call usePlayer()
 * (that would create a circular dependency).
 */
export default function useAudioPlayer({
  currentSong,
  isPlaying,
  repeat,
  playNext,
  setIsPlaying,
}) {
  const audioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);

  // Reset the tracked playback numbers the moment the song identity
  // changes, computed during render instead of in a separate Effect.
  // This is the React-recommended "adjusting state when a prop
  // changes" pattern: React re-renders before committing, so the UI
  // never flashes the previous song's stale time/progress.
  const [trackedSongId, setTrackedSongId] = useState(currentSong?.id);

  if (trackedSongId !== currentSong?.id) {
    setTrackedSongId(currentSong?.id);
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);
  }

  // Load + play when the song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    audio.src = getAudioUrl(currentSong);
    audio.load();

    audio.play().catch(() => setIsPlaying(false));
  }, [currentSong, setIsPlaying]);

  // Keep audio element in sync with isPlaying
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  // Volume + mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (repeat === "one") {
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlaying(false));
    } else {
      playNext();
    }
  }, [repeat, playNext, setIsPlaying]);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;

    if (audio && Number.isFinite(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(seconds, audio.duration));
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const setVolume = useCallback((v) => {
    const newVolume = Math.max(0, Math.min(1, Number(v)));

    setVolumeState(newVolume);

    if (newVolume > 0) {
      setMuted(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setCurrentTime(audio.currentTime);

    if (audio.duration && Number.isFinite(audio.duration)) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setDuration(audio.duration || 0);
  }, []);

  return {
    audioRef,
    progress,
    currentTime,
    duration,
    muted,
    volume,
    handleEnded,
    handleTimeUpdate,
    handleLoadedMetadata,
    seek,
    toggleMute,
    setVolume,
  };
}
