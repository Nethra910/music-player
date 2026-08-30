import { useState, useEffect, useCallback } from "react";
import { load, save } from "../utils/storage";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => load("favorites", []));

  useEffect(() => save("favorites", favorites), [favorites]);

  const isFavorite = useCallback(
    (songId) => favorites.some((s) => s.id === songId),
    [favorites],
  );

  const toggleFavorite = useCallback((song) => {
    setFavorites((prev) =>
      prev.some((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [song, ...prev],
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
