import { Play, Pause, Heart } from "lucide-react";
import { formatDuration, formatPlayCount } from "../utils/format";

export default function SongCard({ song, isCurrent, isPlaying, onPlay }) {
  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-3 sm:gap-4 rounded-xl p-2 sm:p-3 cursor-pointer
                  transition hover:bg-gray-800/70 ${isCurrent ? "bg-gray-800" : ""}`}
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
                      ${isCurrent && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition`}
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
          className={`truncate text-sm sm:text-base font-medium ${isCurrent ? "text-green-400" : "text-white"}`}
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
      <span className="shrink-0 text-xs sm:text-sm text-gray-400">
        {formatDuration(song.duration)}
      </span>

      <Heart
        size={18}
        className="shrink-0 text-gray-500 hover:text-red-500 transition hidden sm:block"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
