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

  const tabIndex = TABS.findIndex((t) => t.id === tab);

  const playAll = (list) => {
    if (list.length) {
      setSongs(list);
      playSong(list[0], list);
    }
  };

  const SongRow = ({ song, index = 0, onRemove }) => (
    <div
      className="group flex animate-fade-in-up items-center gap-3 rounded-2xl p-2.5 transition-all duration-200 hover:scale-[1.01] hover:bg-white/[0.06]"
      style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}
    >
      <img
        src={song.image}
        alt=""
        className="h-12 w-12 cursor-pointer rounded-xl object-cover transition-transform duration-200 spring hover:scale-105"
        onClick={() => playSong(song)}
      />
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => playSong(song)}
      >
        <p className="truncate text-[14px] font-medium text-white">
          {song.song}
        </p>
        <p className="truncate text-[12px] text-white/45">
          {song.primary_artists}
        </p>
      </div>
      <span className="text-[12px] tabular-nums text-white/35">
        {formatDuration(song.duration)}
      </span>

      {/* Add to playlist */}
      <button
        onClick={() => setModalSong(song)}
        className="text-white/40 transition-all duration-200 spring hover:scale-125 hover:text-white active:scale-90"
        title="Add to playlist"
      >
        <Plus size={17} />
      </button>

      {/* Like toggle */}
      <button
        onClick={() => toggleFavorite(song)}
        className={`transition-all duration-200 spring hover:scale-125 active:scale-90 ${isFavorite(song.id) ? "text-[#FA233B]" : "text-white/40 hover:text-[#FA233B]"}`}
      >
        <Heart size={17} fill={isFavorite(song.id) ? "currentColor" : "none"} />
      </button>

      {onRemove && (
        <button
          onClick={onRemove}
          className="text-white/40 transition-all duration-200 spring hover:scale-125 hover:text-white active:scale-90"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-3 sm:px-6">
      {/* Segmented control tabs with a sliding pill indicator */}
      <div className="relative mb-5 flex gap-1 overflow-x-auto rounded-full bg-white/[0.06] p-1 scrollbar-hide">
        <div
          className="absolute inset-y-1 w-[calc(33.333%-3px)] rounded-full bg-white transition-transform duration-300 spring"
          style={{
            transform: `translateX(calc(${tabIndex * 100}% + ${tabIndex * 4}px))`,
          }}
        />

        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              setOpenPlaylist(null);
            }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors duration-200
                        ${tab === id ? "text-black" : "text-white/55 hover:text-white"}`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-in-up">
        {/* FAVORITES */}
        {tab === "favorites" &&
          (favorites.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-white/40">
              No liked songs yet. Tap the heart on any song.
            </p>
          ) : (
            <>
              <button
                onClick={() => playAll(favorites)}
                className="mb-3 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition-all duration-200 spring hover:scale-105 hover:bg-white/90 active:scale-95"
              >
                <Play size={14} fill="currentColor" /> Play All (
                {favorites.length})
              </button>
              {favorites.map((s, i) => (
                <SongRow key={s.id} song={s} index={i} />
              ))}
            </>
          ))}

        {/* RECENT */}
        {tab === "recent" &&
          (recent.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-white/40">
              Nothing played yet.
            </p>
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => playAll(recent)}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition-all duration-200 spring hover:scale-105 hover:bg-white/90 active:scale-95"
                >
                  <Play size={14} fill="currentColor" /> Play All
                </button>
                <button
                  onClick={clearRecent}
                  className="flex items-center gap-1.5 rounded-full bg-white/[0.08] px-4 py-2.5 text-[13px] text-white/60 transition-all duration-200 spring hover:scale-105 hover:bg-white/[0.14] hover:text-white active:scale-95"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
              {recent.map((s, i) => (
                <SongRow key={s.id} song={s} index={i} />
              ))}
            </>
          ))}

        {/* PLAYLISTS */}
        {tab === "playlists" &&
          !openPlaylist &&
          (playlists.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-white/40">
              No playlists. Add songs with the ＋ button.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {playlists.map((pl, i) => (
                <div
                  key={pl.id}
                  className="group relative animate-pop-in cursor-pointer rounded-2xl bg-white/[0.06] p-4 transition-all duration-200 hover:scale-[1.03] hover:bg-white/[0.1]"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setOpenPlaylist(pl)}
                >
                  <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-white/[0.08] transition-transform duration-300 group-hover:scale-105">
                    <ListMusic size={30} className="text-white/30" />
                  </div>
                  <p className="truncate text-[14px] font-medium text-white">
                    {pl.name}
                  </p>
                  <p className="text-[12px] text-white/40">
                    {pl.songs.length} songs
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="absolute right-2 top-2 hidden h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/60 transition-all duration-200 spring hover:scale-110 hover:text-[#FA233B] group-hover:flex"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}

        {/* OPEN PLAYLIST DETAIL */}
        {tab === "playlists" && openPlaylist && (
          <div className="animate-fade-in-up">
            <div className="mb-3 flex items-center gap-3">
              <button
                onClick={() => setOpenPlaylist(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white/60 transition-all duration-200 spring hover:scale-110 hover:text-white active:scale-90"
              >
                ←
              </button>
              <h2 className="text-[17px] font-semibold text-white">
                {openPlaylist.name}
              </h2>
              {openPlaylist.songs.length > 0 && (
                <button
                  onClick={() => playAll(openPlaylist.songs)}
                  className="ml-auto flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-all duration-200 spring hover:scale-105 hover:bg-white/90"
                >
                  <Play size={13} fill="currentColor" /> Play
                </button>
              )}
            </div>
            {openPlaylist.songs.length === 0 ? (
              <p className="py-12 text-center text-[15px] text-white/40">
                Empty playlist — add songs with ＋
              </p>
            ) : (
              openPlaylist.songs.map((s, i) => (
                <SongRow
                  key={s.id}
                  song={s}
                  index={i}
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
          </div>
        )}
      </div>

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
