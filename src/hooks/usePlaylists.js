import { useState, useEffect, useCallback } from "react";
import { load, save } from "../utils/storage";

export default function usePlaylists() {
  const [playlists, setPlaylists] = useState(() => load("playlists", []));

  useEffect(() => save("playlists", playlists), [playlists]);

  const createPlaylist = useCallback((name) => {
    const id = `pl_${Date.now()}`;
    setPlaylists((prev) => [...prev, { id, name: name.trim(), songs: [] }]);
    id; // ← ADD THIS
  }, []);

  const deletePlaylist = useCallback((id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addToPlaylist = useCallback((playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songs.some((s) => s.id === song.id)
          ? { ...p, songs: [song, ...p.songs] }
          : p,
      ),
    );
  }, []);

  const removeFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p,
      ),
    );
  }, []);

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };
}
