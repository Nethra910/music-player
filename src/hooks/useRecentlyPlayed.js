import { useState, useEffect, useCallback } from "react";
import { load, save } from "../utils/storage";
import { usePlayer } from "../context/PlayerContext";

const MAX_RECENT = 20;

export default function useRecentlyPlayed() {
  const { currentSong } = usePlayer();
  const [recent, setRecent] = useState(() => load("recent", []));

  useEffect(() => save("recent", recent), [recent]);

  // Auto-record whenever a new song starts
  useEffect(() => {
    if (!currentSong) return;
    setRecent((prev) =>
      [currentSong, ...prev.filter((s) => s.id !== currentSong.id)].slice(
        0,
        MAX_RECENT,
      ),
    );
  }, [currentSong]);

  const clearRecent = useCallback(() => setRecent([]), []);

  return { recent, clearRecent };
}
