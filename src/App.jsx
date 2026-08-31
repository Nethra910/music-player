import { useState, useCallback } from "react";
import { searchSongs } from "./api/saavn";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import AudioElement from "./components/AudioElement";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import PlayerBar from "./components/PlayerBar";
import QueuePanel from "./components/QueuePanel";
import FullScreenPlayer from "./components/FullScreenPlayer";
import LibraryPage from "./pages/LibraryPage";
import AddToPlaylistModal from "./components/AddToPlaylistModal";
import usePlaylists from "./hooks/usePlaylists";
import { Music2, Home, Library } from "lucide-react";

function AppContent() {
  const [page, setPage] = useState("home");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [queueOpen, setQueueOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [modalSong, setModalSong] = useState(null);

  const {
    setSongs: setQueueSongs,
    playSong,
    currentSong,
    isPlaying,
  } = usePlayer();

  const { playlists, createPlaylist, addToPlaylist } = usePlaylists();

  const handleSearch = useCallback(
    async (query) => {
      setPage("home");
      setLoading(true);
      setError(null);
      setLastQuery(query);

      try {
        const data = await searchSongs(query);

        setSongs(data);
        setQueueSongs(data);
      } catch (err) {
        setError(err.message);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    },
    [setQueueSongs],
  );

  return (
    <div className="min-h-screen pb-28 sm:pb-32">
      {/* The ONE audio element */}
      <AudioElement />

      {/* Top nav */}
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2"
        >
          <Music2 className="text-green-500" size={22} />

          <h1 className="text-lg font-bold text-white">
            Saavn<span className="text-green-500">Play</span>
          </h1>
        </button>

        <nav className="flex gap-1">
          <button
            onClick={() => setPage("home")}
            className={`rounded-lg p-2 transition ${
              page === "home"
                ? "text-green-400"
                : "text-gray-400 hover:text-white"
            }`}
            title="Home"
          >
            <Home size={22} />
          </button>

          <button
            onClick={() => setPage("library")}
            className={`rounded-lg p-2 transition ${
              page === "library"
                ? "text-green-400"
                : "text-gray-400 hover:text-white"
            }`}
            title="Library"
          >
            <Library size={22} />
          </button>
        </nav>
      </header>

      {page === "home" ? (
        <>
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
              onAddToPlaylist={setModalSong}
              onRetry={() => {
                if (lastQuery) {
                  handleSearch(lastQuery);
                }
              }}
            />
          </main>
        </>
      ) : (
        <LibraryPage />
      )}

      {/* Player */}
      <PlayerBar
        onOpenQueue={() => setQueueOpen(true)}
        onExpand={() => setFullScreenOpen(true)}
      />

      {/* Queue */}
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />

      {/* Full screen player */}
      <FullScreenPlayer
        open={fullScreenOpen}
        onClose={() => setFullScreenOpen(false)}
      />

      {/* Add to playlist modal */}
      {modalSong && (
        <AddToPlaylistModal
          song={modalSong}
          playlists={playlists}
          onAdd={(playlistId, song) => {
            addToPlaylist(playlistId, song);
            setModalSong(null);
          }}
          onCreate={(name, song) => {
            const id = createPlaylist(name);

            if (id) {
              addToPlaylist(id, song);
            }

            setModalSong(null);
          }}
          onClose={() => setModalSong(null)}
        />
      )}
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
