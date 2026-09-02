import { useState, useCallback, useRef } from "react";
import { searchSongs } from "./api/saavn";
import { PlayerProvider } from "./context/PlayerContext";
import { usePlayer } from "./hooks/usePlayerContext";
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
  const lastQueryRef = useRef("");
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
      lastQueryRef.current = query;

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
    <div className="min-h-screen bg-black pb-32 sm:pb-36">
      {/* The ONE audio element */}
      <AudioElement />

      {/* Top nav */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 glass border-b border-white/[0.06] animate-fade-in-up">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 transition active:scale-95"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FA233B] to-[#FB5C74] transition-transform duration-300 spring hover:scale-110 hover:rotate-6">
            <Music2 className="text-white" size={16} strokeWidth={2.5} />
          </div>

          <h1 className="text-[17px] font-semibold tracking-tight text-white">
            N-Beats<span className="text-white/50"> Play</span>
          </h1>
        </button>

        {/* Segmented nav with a sliding pill indicator */}
        <nav className="relative flex items-center gap-1 rounded-full bg-white/[0.06] p-1">
          <div
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-white transition-transform duration-300 spring"
            style={{
              transform:
                page === "home"
                  ? "translateX(0%)"
                  : "translateX(calc(100% + 4px))",
            }}
          />

          <button
            onClick={() => setPage("home")}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
              page === "home" ? "text-black" : "text-white/60 hover:text-white"
            }`}
            title="Home"
          >
            <Home size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setPage("library")}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
              page === "library"
                ? "text-black"
                : "text-white/60 hover:text-white"
            }`}
            title="Library"
          >
            <Library size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Library</span>
          </button>
        </nav>
      </header>

      {page === "home" ? (
        <div key="home" className="animate-fade-in-up">
          <div className="mb-6 mt-6">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          <main className="mx-auto max-w-5xl px-3 sm:px-6">
            <SongList
              songs={songs}
              loading={loading}
              error={error}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlay={(song) => playSong(song, songs)}
              onAddToPlaylist={setModalSong}
              onRetry={() => {
                if (lastQueryRef.current) {
                  handleSearch(lastQueryRef.current);
                }
              }}
            />
          </main>
        </div>
      ) : (
        <div key="library" className="animate-fade-in-up">
          <LibraryPage />
        </div>
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
