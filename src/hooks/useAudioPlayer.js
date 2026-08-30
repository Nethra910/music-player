import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayer } from "../context/PlayerContext";
import { getAudioUrl } from "../utils/format";

export default function useAudioPlayer() {
  const { currentSong, isPlaying, repeat, playNext, setIsPlaying } =
    usePlayer();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);

  // Load new song when it changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = getAudioUrl(currentSong);
    audioRef.current.play().catch(() => setIsPlaying(false)); // autoplay blocked or URL failed
  }, [currentSong, setIsPlaying]);

  // Keep audio element in sync with isPlaying state (THE FIX ✅)
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
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
    if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext(); // playNext handles "all" vs "off"
    }
  }, [repeat, playNext]);

  const seek = useCallback((seconds) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = seconds;
    }
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (v > 0) setMuted(false);
  }, []);

  return {
    audioRef,
    progress,
    currentTime,
    duration,
    muted,
    volume,
    handleEnded,
    seek,
    toggleMute,
    setVolume,
    handleTimeUpdate: () => {
      const a = audioRef.current;
      if (!a || !a.duration) return;
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100);
    },
    handleLoadedMetadata: () => setDuration(audioRef.current.duration || 0),
  };
}
