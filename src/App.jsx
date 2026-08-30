import { useState, useCallback } from "react";
import { searchSongs } from "./api/saavn";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import PlayerBar from "./components/PlayerBar";
import { Music2 } from "lucide-react";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);
    try {
      const data = await searchSongs(query);
      setSongs(data);
    } catch (err) {
      setError(err.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying((p) => !p); // toggle same song
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleNext = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const next = songs[(idx + 1) % songs.length];
    setCurrentSong(next);
    setIsPlaying(true);
  }, [currentSong, songs]);

  const handlePrev = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setCurrentSong(prev);
    setIsPlaying(true);
  }, [currentSong, songs]);

  return (
    <div className="min-h-screen pb-28 sm:pb-32">
      {" "}
      {/* bottom padding so player bar doesn't cover content */}
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-4 sm:py-6">
        <Music2 className="text-green-500" size={26} />
        <h1 className="text-lg sm:text-xl font-bold">
          Saavn<span className="text-green-500">Play</span>
        </h1>
      </header>
      {/* Search */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>
      {/* Results */}
      <main className="mx-auto max-w-5xl px-2 sm:px-4">
        <SongList
          songs={songs}
          loading={loading}
          error={error}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onRetry={() => lastQuery && handleSearch(lastQuery)}
        />
      </main>
      <PlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
