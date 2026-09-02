import { Play, Pause, Heart, Plus } from "lucide-react";
import { formatDuration, formatPlayCount } from "../utils/format";
import useFavorites from "../hooks/useFavorites";
import EqualizerBars from "./EqualizerBars";
import { usePlayer } from "../hooks/usePlayerContext";

export default function SongCard({ song, isCurrent, onPlay, onAddToPlaylist }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPlaying } = usePlayer();
  const liked = isFavorite(song.id);

  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-3 sm:gap-4 rounded-2xl p-2 sm:p-3 cursor-pointer
                  transition-all duration-200 hover:scale-[1.01] hover:bg-white/[0.06] ${
                    isCurrent ? "bg-[#FA233B]/[0.08]" : ""
                  }`}
    >
      {/* Cover art */}
      <div className="relative shrink-0">
        <img
          src={song.image}
          alt={song.song}
          loading="lazy"
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover shadow-md"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-[2px]
                      ${
                        isCurrent && isPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } transition-all duration-200`}
        >
          <span className="transition-transform duration-200 spring group-hover:scale-110">
            {isCurrent && isPlaying ? (
              <Pause size={22} className="text-white" fill="currentColor" />
            ) : (
              <Play
                size={22}
                className="ml-0.5 text-white"
                fill="currentColor"
              />
            )}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[14px] sm:text-[15px] font-semibold ${
            isCurrent ? "text-[#FB5C74]" : "text-white"
          }`}
        >
          {song.song}
        </p>

        <p className="truncate text-[12px] sm:text-[13px] text-white/50">
          {song.primary_artists}
        </p>

        <p className="truncate text-[11px] sm:text-[12px] text-white/30">
          {song.album} • {song.year} • {formatPlayCount(song.play_count)}
        </p>
      </div>

      {/* Duration */}
      {isCurrent && isPlaying ? (
        <EqualizerBars color="#FA233B" />
      ) : (
        <span className="shrink-0 text-[12px] sm:text-[13px] tabular-nums text-white/40">
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
          className="shrink-0 text-white/40 transition-all duration-200 spring hover:scale-125 hover:text-white active:scale-90"
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
        className={`shrink-0 transition-all duration-200 spring hover:scale-125 active:scale-90 ${
          liked ? "text-[#FA233B]" : "text-white/40 hover:text-[#FA233B]"
        }`}
        title={liked ? "Remove from liked" : "Like song"}
        aria-label={liked ? "Remove from liked" : "Like song"}
      >
        <Heart
          key={liked}
          size={18}
          fill={liked ? "currentColor" : "none"}
          className={liked ? "animate-pop-in" : ""}
        />
      </button>
    </div>
  );
}
