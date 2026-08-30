import { useState, useEffect } from "react";
import { extractDominantColor } from "../utils/color";

const cache = new Map(); // songId → theme (avoid re-extracting)

export default function useSongTheme(song) {
  const [theme, setTheme] = useState({ primary: "#22c55e", dark: "#052e16" });

  useEffect(() => {
    if (!song?.image) return;
    if (cache.has(song.id)) {
      setTheme(cache.get(song.id));
      return;
    }
    let active = true;
    extractDominantColor(song.image).then((t) => {
      cache.set(song.id, t);
      if (active) setTheme(t);
    });
    return () => {
      active = false;
    };
  }, [song]);

  return theme;
}
