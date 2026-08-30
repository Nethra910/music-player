import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState([]); // the current list acts as the queue
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off"); // "off" | "all" | "one"

  // Returns the next/prev song respecting shuffle & repeat
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
      return songs[nextIdx];
    },
    [currentSong, songs, shuffle],
  );

  const playSong = useCallback(
    (song, list) => {
      if (list) setSongs(list);
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
    const next = getNeighbor(1);
    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
    } else if (repeat === "off") {
      setIsPlaying(false);
    }
  }, [getNeighbor, repeat]);

  const playPrev = useCallback(() => {
    const prev = getNeighbor(-1);
    if (prev) {
      setCurrentSong(prev);
      setIsPlaying(true);
    }
  }, [getNeighbor]);

  // Cycle repeat: off → all → one → off
  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const value = useMemo(
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
      toggleShuffle: () => setShuffle((s) => !s),
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
      cycleRepeat,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}
