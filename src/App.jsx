import { useState, useCallback, useRef } from "react";
import { searchSongs } from "./api/saavn";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import PlayerBar from "./components/PlayerBar";
import QueuePanel from "./components/QueuePanel";
import { Music2 } from "lucide-react";

function AppContent() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [queueOpen, setQueueOpen] = useState(false);

  const {
    setSongs: setQueueSongs,
    playSong,
    currentSong,
    isPlaying,
  } = usePlayer();

  const handleSearch = useCallback(
    async (query) => {
      setLoading(true);
      setError(null);
      setLastQuery(query);
      try {
        const data = await searchSongs(query);
        setSongs(data);
        setQueueSongs(data); // search results become the queue
      } catch (err) {
        setError(err.message);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    },
    [setQueueSongs],
  );

  // keyboard shortcuts (space, next, prev, seek) — need audioRef, see note below
  // useKeyboardShortcuts(audioRefRef.current) — wired after PlayerBar mounts

  return (
    <div className="min-h-screen pb-28 sm:pb-32">
      <header className="flex items-center gap-2 px-4 py-4 sm:py-6">
        <Music2 className="text-green-500" size={26} />
        <h1 className="text-lg sm:text-xl font-bold">
          Saavn<span className="text-green-500">Play</span>
        </h1>
      </header>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      <main className="mx-auto max-w-5xl px-2 sm:px-4">
        <SongList
          songs={songs}
          loading={loading}
          error={error}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlay={(song) => playSong(song, songs)}
          onRetry={() => lastQuery && handleSearch(lastQuery)}
        />
      </main>

      <PlayerBar onOpenQueue={() => setQueueOpen(true)} />
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
