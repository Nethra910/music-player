import { createContext, useState, useCallback, useMemo } from "react";
import useAudioPlayer from "../hooks/useAudioPlayer";

export const PlayerContext = createContext(null);

/*
 * Separate context for fast-changing audio state
 * (currentTime / progress / duration).
 *
 * This is the core fix: time updates fire ~4x/second. Keeping them
 * out of PlayerContext means songs/favorites/recent lists never
 * re-render when playback time advances.
 */
export const AudioTimeContext = createContext(null);

/**
 * Inner provider: attaches the audio engine to the player state.
 */
function AudioProvider({ player, children }) {
  const engine = useAudioPlayer(player);

  const controls = useMemo(
    () => ({
      audioRef: engine.audioRef,
      muted: engine.muted,
      volume: engine.volume,
      seek: engine.seek,
      toggleMute: engine.toggleMute,
      setVolume: engine.setVolume,
      handleEnded: engine.handleEnded,
      handleTimeUpdate: engine.handleTimeUpdate,
      handleLoadedMetadata: engine.handleLoadedMetadata,
    }),
    [
      engine.audioRef,
      engine.muted,
      engine.volume,
      engine.seek,
      engine.toggleMute,
      engine.setVolume,
      engine.handleEnded,
      engine.handleTimeUpdate,
      engine.handleLoadedMetadata,
    ],
  );

  const time = useMemo(
    () => ({
      progress: engine.progress,
      currentTime: engine.currentTime,
      duration: engine.duration,
    }),
    [engine.progress, engine.currentTime, engine.duration],
  );

  return (
    <PlayerContext.Provider
      value={useMemo(
        () => ({ ...player, audio: controls }),
        [player, controls],
      )}
    >
      <AudioTimeContext.Provider value={time}>
        {children}
      </AudioTimeContext.Provider>
    </PlayerContext.Provider>
  );
}

/**
 * Outer provider: holds all playback state.
 */
export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off"); // "off" | "all" | "one"

  const getNeighbor = useCallback(
    (dir) => {
      if (!currentSong || songs.length === 0) return null;

      const idx = songs.findIndex((s) => s.id === currentSong.id);

      if (shuffle && songs.length > 1) {
        let rand;

        do {
          rand = Math.floor(Math.random() * songs.length);
        } while (rand === idx);

        return songs[rand];
      }

      const nextIdx = (idx + dir + songs.length) % songs.length;

      if (repeat === "off" && (nextIdx < 0 || nextIdx >= songs.length)) {
        return null;
      }

      return songs[nextIdx];
    },
    [currentSong, songs, shuffle, repeat],
  );

  const playSong = useCallback(
    (song, list) => {
      if (list && list.length > 0) {
        setSongs(list);
      }

      if (currentSong?.id === song.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    },
    [currentSong],
  );

  const playNext = useCallback(() => {
    if (repeat === "one" && currentSong) {
      setCurrentSong(currentSong);
      setIsPlaying(true);
      return;
    }

    const next = getNeighbor(1);

    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [getNeighbor, repeat, currentSong]);

  const playPrev = useCallback(() => {
    const prev = getNeighbor(-1);

    if (prev) {
      setCurrentSong(prev);
      setIsPlaying(true);
    }
  }, [getNeighbor]);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => !s);
  }, []);

  const state = useMemo(
    () => ({
      songs,
      currentSong,
      isPlaying,
      shuffle,
      repeat,
      setSongs,
      playSong,
      playNext,
      playPrev,
      toggleShuffle,
      cycleRepeat,
      setIsPlaying,
    }),
    [
      songs,
      currentSong,
      isPlaying,
      shuffle,
      repeat,
      playSong,
      playNext,
      playPrev,
      toggleShuffle,
      cycleRepeat,
    ],
  );

  return <AudioProvider player={state}>{children}</AudioProvider>;
}
