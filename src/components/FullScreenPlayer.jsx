import { useEffect } from "react";
import { createPortal } from "react-dom";
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
  Heart,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
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
    audio,
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
  } = audio;

  const theme = useSongTheme(song);
  const liked = song ? isFavorite(song.id) : false;
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  // Lock background scroll while fullscreen is open
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape key closes fullscreen
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (duration > 0) {
      seek(((e.clientX - rect.left) / rect.width) * duration);
    }
  };

  if (!open || !song) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex w-screen h-screen flex-col overflow-hidden bg-black">
      {/* Blurred backdrop */}
      <img
        src={song.image}
        alt=""
        className="absolute inset-0 h-full w-full scale-150 object-cover blur-[80px] opacity-50"
      />

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main content — fills the viewport exactly */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between p-5">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            title="Close"
          >
            <ChevronDown size={20} strokeWidth={2.5} />
          </button>

          <p className="text-[12px] font-medium tracking-tight text-white/50">
            Now Playing
          </p>

          <div className="w-8" />
        </div>

        {/* Cover art */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-8 py-4">
          <img
            src={song.image}
            alt={song.song}
            className={`aspect-square w-full max-w-[300px] rounded-3xl object-cover transition-transform duration-500 ease-out sm:max-w-[380px] ${
              isPlaying ? "scale-100" : "scale-90"
            }`}
            style={{
              boxShadow: `0 30px 70px -15px rgba(0,0,0,0.7)`,
            }}
          />
        </div>

        {/* Info + controls */}
        <div className="shrink-0 px-6 pb-10 pt-2 sm:px-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[22px] font-semibold tracking-tight text-white sm:text-2xl">
                {song.song}
              </h2>

              <p className="truncate text-[15px] text-white/55">
                {song.primary_artists}
              </p>

              <p className="truncate text-[13px] text-white/35">
                {song.album}
                {song.year ? ` • ${song.year}` : ""}
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(song)}
              className={`shrink-0 p-2 transition ${
                liked ? "text-[#FA233B]" : "text-white/50 hover:text-white"
              }`}
              title={liked ? "Remove from liked" : "Like song"}
            >
              <Heart size={24} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Progress */}
          <div onClick={handleSeekClick} className="mt-5 cursor-pointer">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full transition-[width]"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #FA233B, #FB5C74)",
                }}
              />
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-white/40">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
            <button
              onClick={toggleShuffle}
              className={`transition ${
                shuffle ? "text-white" : "text-white/35"
              }`}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={playPrev}
              className="text-white/85 transition hover:text-white"
              title="Previous"
            >
              <SkipBack size={30} fill="currentColor" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} className="ml-1" fill="currentColor" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-white/85 transition hover:text-white"
              title="Next"
            >
              <SkipForward size={30} fill="currentColor" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`transition ${
                repeat !== "off" ? "text-white" : "text-white/35"
              }`}
              title={`Repeat: ${repeat}`}
            >
              <RepeatIcon size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="mt-6 hidden items-center justify-center gap-3 sm:flex">
            <button
              onClick={toggleMute}
              className="text-white/50 hover:text-white"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <VolumeX size={17} />
              ) : (
                <Volume2 size={17} />
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
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
