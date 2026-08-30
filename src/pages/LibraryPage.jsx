import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import useFavorites from "../hooks/useFavorites";
import useRecentlyPlayed from "../hooks/useRecentlyPlayed";
import usePlaylists from "../hooks/usePlaylists";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { formatDuration } from "../utils/format";
import { Heart, Clock, ListMusic, Trash2, Play, Plus, X } from "lucide-react";

const TABS = [
  { id: "favorites", label: "Liked", icon: Heart },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "playlists", label: "Playlists", icon: ListMusic },
];

export default function LibraryPage() {
  const [tab, setTab] = useState("favorites");
  const [openPlaylist, setOpenPlaylist] = useState(null);
  const [modalSong, setModalSong] = useState(null);

  const { playSong, setSongs } = usePlayer();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recent, clearRecent } = useRecentlyPlayed();
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
  } = usePlaylists();

  const playAll = (list) => {
    if (list.length) {
      setSongs(list);
      playSong(list[0], list);
    }
  };

  const SongRow = ({ song, onRemove }) => (
    <div className="group flex items-center gap-3 rounded-xl p-2 hover:bg-gray-800/70 transition">
      <img
        src={song.image}
        alt=""
        className="h-12 w-12 cursor-pointer rounded-lg object-cover"
        onClick={() => playSong(song)}
      />
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => playSong(song)}
      >
        <p className="truncate text-sm font-medium">{song.song}</p>
        <p className="truncate text-xs text-gray-400">{song.primary_artists}</p>
      </div>
      <span className="text-xs text-gray-500">
        {formatDuration(song.duration)}
      </span>

      {/* Add to playlist */}
      <button
        onClick={() => setModalSong(song)}
        className="text-gray-500 hover:text-green-400 transition"
        title="Add to playlist"
      >
        <Plus size={18} />
      </button>

      {/* Like toggle */}
      <button
        onClick={() => toggleFavorite(song)}
        className={`transition ${isFavorite(song.id) ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
      >
        <Heart size={18} fill={isFavorite(song.id) ? "currentColor" : "none"} />
      </button>

      {onRemove && (
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-400 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-3 sm:px-4">
      {/* Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              setOpenPlaylist(null);
            }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition
                        ${tab === id ? "bg-green-500 text-black font-semibold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* FAVORITES */}
      {tab === "favorites" &&
        (favorites.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            💔 No liked songs yet. Tap ♥ on any song!
          </p>
        ) : (
          <>
            <button
              onClick={() => playAll(favorites)}
              className="mb-3 rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-black hover:bg-green-400"
            >
              ▶ Play all ({favorites.length})
            </button>
            {favorites.map((s) => (
              <SongRow key={s.id} song={s} />
            ))}
          </>
        ))}

      {/* RECENT */}
      {tab === "recent" &&
        (recent.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            🕐 Nothing played yet.
          </p>
        ) : (
          <>
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => playAll(recent)}
                className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-black hover:bg-green-400"
              >
                ▶ Play all
              </button>
              <button
                onClick={clearRecent}
                className="flex items-center gap-1 rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            {recent.map((s) => (
              <SongRow key={s.id} song={s} />
            ))}
          </>
        ))}

      {/* PLAYLISTS */}
      {tab === "playlists" &&
        !openPlaylist &&
        (playlists.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            📂 No playlists. Add songs via the ＋ button.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="group relative cursor-pointer rounded-xl bg-gray-800/60 p-4 hover:bg-gray-800 transition"
                onClick={() => setOpenPlaylist(pl)}
              >
                <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-gray-700">
                  <ListMusic size={32} className="text-gray-400" />
                </div>
                <p className="truncate text-sm font-medium">{pl.name}</p>
                <p className="text-xs text-gray-500">{pl.songs.length} songs</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(pl.id);
                  }}
                  className="absolute right-2 top-2 hidden text-gray-400 hover:text-red-400 group-hover:block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* OPEN PLAYLIST DETAIL */}
      {tab === "playlists" && openPlaylist && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => setOpenPlaylist(null)}
              className="text-gray-400 hover:text-white"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold">{openPlaylist.name}</h2>
            {openPlaylist.songs.length > 0 && (
              <button
                onClick={() => playAll(openPlaylist.songs)}
                className="ml-auto rounded-full bg-green-500 px-4 py-1.5 text-sm font-semibold text-black"
              >
                ▶ Play
              </button>
            )}
          </div>
          {openPlaylist.songs.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Empty playlist — add songs with ＋
            </p>
          ) : (
            openPlaylist.songs.map((s) => (
              <SongRow
                key={s.id}
                song={s}
                onRemove={() => {
                  removeFromPlaylist(openPlaylist.id, s.id);
                  setOpenPlaylist((p) => ({
                    ...p,
                    songs: p.songs.filter((x) => x.id !== s.id),
                  }));
                }}
              />
            ))
          )}
        </>
      )}

      {/* Add-to-playlist modal */}
      {modalSong && (
        <AddToPlaylistModal
          song={modalSong}
          playlists={playlists}
          onAdd={(plId, song) => {
            addToPlaylist(plId, song);
            setModalSong(null);
          }}
          onCreate={(name, song) => {
            createPlaylist(name);
            setModalSong(null);
          }}
          onClose={() => setModalSong(null)}
        />
      )}
    </main>
  );
}
