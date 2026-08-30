import { Play, Pause, Heart, Plus } from "lucide-react";
import { formatDuration, formatPlayCount } from "../utils/format";
import useFavorites from "../hooks/useFavorites";
import EqualizerBars from "./EqualizerBars";
import { usePlayer } from "../context/PlayerContext";

export default function SongCard({ song, isCurrent, onPlay, onAddToPlaylist }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPlaying } = usePlayer();
  const liked = isFavorite(song.id);

  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-3 sm:gap-4 rounded-xl p-2 sm:p-3 cursor-pointer
                  transition hover:bg-gray-800/70 ${
                    isCurrent ? "bg-gray-800" : ""
                  }`}
    >
      {/* Cover art */}
      <div className="relative shrink-0">
        <img
          src={song.image}
          alt={song.song}
          loading="lazy"
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/50
                      ${
                        isCurrent && isPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } transition`}
        >
          {isCurrent && isPlaying ? (
            <Pause size={22} className="text-white" />
          ) : (
            <Play size={22} className="text-white" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm sm:text-base font-medium ${
            isCurrent ? "text-green-400" : "text-white"
          }`}
        >
          {song.song}
        </p>

        <p className="truncate text-xs sm:text-sm text-gray-400">
          {song.primary_artists}
        </p>

        <p className="truncate text-[11px] sm:text-xs text-gray-500">
          {song.album} • {song.year} • {formatPlayCount(song.play_count)}
        </p>
      </div>

      {/* Duration */}
      {isCurrent && isPlaying ? (
        <EqualizerBars color="#22c55e" />
      ) : (
        <span className="shrink-0 text-xs sm:text-sm text-gray-400">
          {formatDuration(song.duration)}
        </span>
      )}

      {/* Add to playlist */}
      {onAddToPlaylist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song);
          }}
          className="shrink-0 text-gray-500 hover:text-green-400 transition"
          title="Add to playlist"
          aria-label="Add to playlist"
        >
          <Plus size={18} />
        </button>
      )}

      {/* Favorite toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(song);
        }}
        className={`shrink-0 transition ${
          liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
        title={liked ? "Remove from liked" : "Like song"}
        aria-label={liked ? "Remove from liked" : "Like song"}
      >
        <Heart size={18} fill={liked ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
