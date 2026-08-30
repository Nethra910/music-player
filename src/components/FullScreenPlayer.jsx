import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import useAudioPlayer from "../hooks/useAudioPlayer";
import useSongTheme from "../hooks/useSongTheme";
import useFavorites from "../hooks/useFavorites";
import { formatDuration } from "../utils/format";

export default function FullScreenPlayer({ open, onClose }) {
  const {
    currentSong: song,
    isPlaying,
    shuffle,
    repeat,
    playNext,
    playPrev,
    toggleShuffle,
    cycleRepeat,
    setIsPlaying,
  } = usePlayer();

  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    progress,
    currentTime,
    duration,
    muted,
    volume,
    seek,
    toggleMute,
    setVolume,
    handleEnded,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useAudioPlayer();

  const theme = useSongTheme(song);
  const liked = song ? isFavorite(song.id) : false;
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  // --------------------------------
  // Swipe down to close
  // --------------------------------
  let touchStartY = 0;

  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;

    // Swipe down more than 80px
    if (touchEndY - touchStartY > 80) {
      onClose();
    }
  };

  if (!open || !song) return null;

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col transition-all"
      style={{
        background: `linear-gradient(
          180deg,
          ${theme.dark} 0%,
          #0a0a0a 70%
        )`,
      }}
    >
      {/* =========================
          Top Bar
      ========================== */}
      <div
        className="flex items-center justify-between p-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition"
        >
          <ChevronDown size={28} />
        </button>

        <p className="text-xs uppercase tracking-widest text-white/50">
          Now Playing
        </p>

        {/* Spacer for centering */}
        <div className="w-7" />
      </div>

      {/* =========================
          Cover Art
      ========================== */}
      <div className="flex flex-1 items-center justify-center px-8">
        <img
          src={song.image}
          alt={song.song}
          className={`aspect-square w-full max-w-[320px] sm:max-w-[380px]
                      rounded-2xl object-cover shadow-2xl
                      transition-transform duration-500
                      ${isPlaying ? "scale-100" : "scale-90"}`}
          style={{
            boxShadow: `0 20px 60px -10px ${theme.primary}66`,
          }}
        />
      </div>

      {/* =========================
          Song Information
      ========================== */}
      <div className="px-6 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl sm:text-2xl font-bold text-white">
              {song.song}
            </h2>

            <p className="truncate text-sm text-white/60">
              {song.primary_artists}
            </p>

            <p className="truncate text-xs text-white/40">
              {song.album} • {song.year}
            </p>
          </div>

          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(song)}
            className={`shrink-0 p-2 transition ${
              liked ? "text-red-500" : "text-white/60 hover:text-white"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* =========================
            Progress
        ========================== */}
        <div onClick={handleSeekClick} className="mt-4 cursor-pointer">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.primary,
              }}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-white/50 tabular-nums">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* =========================
            Controls
        ========================== */}
        <div className="mt-4 flex items-center justify-center gap-8">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`transition ${shuffle ? "text-white" : "text-white/40"}`}
          >
            <Shuffle size={22} />
          </button>

          {/* Previous */}
          <button
            onClick={playPrev}
            className="text-white/80 hover:text-white transition"
          >
            <SkipBack size={32} />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-16 w-16 items-center justify-center rounded-full
                       text-black shadow-lg active:scale-95 transition"
            style={{
              backgroundColor: theme.primary,
            }}
          >
            {isPlaying ? (
              <Pause size={28} />
            ) : (
              <Play size={28} className="ml-1" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="text-white/80 hover:text-white transition"
          >
            <SkipForward size={32} />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            className={`transition ${
              repeat !== "off" ? "text-white" : "text-white/40"
            }`}
          >
            <RepeatIcon size={22} />
          </button>
        </div>

        {/* =========================
            Volume
        ========================== */}
        <div className="mt-5 hidden items-center justify-center gap-3 sm:flex">
          <button
            onClick={toggleMute}
            className="text-white/60 hover:text-white"
          >
            {muted || volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-40 accent-white"
          />
        </div>
      </div>
    </div>
  );
}
