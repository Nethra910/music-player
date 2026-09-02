import { useEffect, useEffectEvent } from "react";
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
import { usePlayer, useAudioTime } from "../hooks/usePlayerContext";
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

  const { progress, currentTime, duration } = useAudioTime();
  const { muted, volume, seek, toggleMute, setVolume } = audio;

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

  // Always reads the latest onClose without making the Effect
  // re-subscribe every time the parent re-renders with a new
  // callback identity.
  const onCloseEvent = useEffectEvent(() => {
    onClose();
  });

  // Escape key closes fullscreen
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onCloseEvent();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (duration > 0) {
      seek(((e.clientX - rect.left) / rect.width) * duration);
    }
  };

  const handleSeekKeyDown = (e) => {
    if (!duration) return;

    const step = 5; // seconds

    if (e.key === "ArrowRight") {
      e.preventDefault();
      seek(Math.min(currentTime + step, duration));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seek(Math.max(currentTime - step, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      seek(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seek(duration);
    }
  };

  if (!open || !song) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex w-screen flex-col overflow-hidden bg-black animate-fade-in"
      style={{ height: "100dvh" }}
    >
      {/* Living, floating color blobs behind the blur — the Apple Music "now playing" background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={song.image}
          alt=""
          className="absolute -inset-[20%] h-[140%] w-[140%] scale-110 object-cover opacity-70 animate-blob-1"
        />
        <div
          className="absolute -inset-[10%] h-[120%] w-[120%] rounded-full opacity-50 animate-blob-2"
          style={{
            background: `radial-gradient(circle, ${theme.primary}aa, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 h-full w-full rounded-full opacity-40 animate-blob-3"
          style={{
            background: "radial-gradient(circle, #FB5C74aa, transparent 55%)",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[90px]" />
      </div>

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main content — fills the viewport exactly */}
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* Top bar */}
        <div
          className="flex shrink-0 items-center justify-between p-5 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <button
            onClick={onClose}
            aria-label="Close full screen player"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-[transform,background-color,color] duration-200 spring hover:scale-110 hover:bg-white/20 hover:text-white active:scale-90"
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
        <div className="flex min-h-0 flex-1 items-center justify-center px-8 py-4 sm:py-4">
          <img
            src={song.image}
            alt={song.song}
            className={`aspect-square h-auto w-full max-w-[min(300px,60dvh)] rounded-3xl object-cover animate-scale-in transition-transform duration-700 ease-out sm:max-w-[380px] ${
              isPlaying ? "animate-breathe" : "scale-90"
            }`}
            style={{
              boxShadow: `0 30px 80px -15px ${theme.primary}55, 0 10px 40px -10px rgba(0,0,0,0.6)`,
            }}
          />
        </div>

        {/* Info + controls */}
        <div
          className="shrink-0 px-6 pb-4 pt-2 sm:px-8 sm:pb-10"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <div
            className="flex items-start justify-between gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.12s" }}
          >
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
              aria-label={
                liked ? "Remove from liked songs" : "Add to liked songs"
              }
              className={`shrink-0 p-2 transition-[transform,color] duration-200 spring hover:scale-125 active:scale-90 ${
                liked ? "text-[#FA233B]" : "text-white/50 hover:text-white"
              }`}
              title={liked ? "Remove from liked" : "Like song"}
            >
              <Heart
                key={liked}
                size={24}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "animate-pop-in" : ""}
              />
            </button>
          </div>

          {/* Progress */}
          <div
            onClick={handleSeekClick}
            onKeyDown={handleSeekKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime || 0}
            aria-valuetext={`${formatDuration(currentTime)} of ${formatDuration(duration)}`}
            className="mt-5 cursor-pointer animate-fade-in-up outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
            style={{ animationDelay: "0.18s" }}
          >
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full transition-[width] duration-300"
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
          <div
            className="mt-6 flex items-center justify-center gap-6 animate-fade-in-up sm:gap-8"
            style={{ animationDelay: "0.24s" }}
          >
            <button
              onClick={toggleShuffle}
              aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
              aria-pressed={shuffle}
              className={`transition-[transform,color] duration-200 spring hover:scale-125 active:scale-90 ${
                shuffle ? "text-white" : "text-white/35"
              }`}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={playPrev}
              aria-label="Previous song"
              className="text-white/85 transition-[transform,color] duration-200 spring hover:scale-125 hover:text-white active:scale-90"
              title="Previous"
            >
              <SkipBack size={30} fill="currentColor" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-200 spring hover:scale-105 active:scale-90"
              title={isPlaying ? "Pause" : "Play"}
            >
              <span
                key={isPlaying ? "pause" : "play"}
                className="flex items-center justify-center animate-pop-in"
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} className="ml-1" fill="currentColor" />
                )}
              </span>
            </button>

            <button
              onClick={playNext}
              aria-label="Next song"
              className="text-white/85 transition-[transform,color] duration-200 spring hover:scale-125 hover:text-white active:scale-90"
              title="Next"
            >
              <SkipForward size={30} fill="currentColor" />
            </button>

            <button
              onClick={cycleRepeat}
              aria-label={`Repeat: ${repeat}`}
              className={`transition-[transform,color] duration-200 spring hover:scale-125 active:scale-90 ${
                repeat !== "off" ? "text-white" : "text-white/35"
              }`}
              title={`Repeat: ${repeat}`}
            >
              <RepeatIcon size={20} />
            </button>
          </div>

          {/* Volume */}
          <div
            className="mt-6 hidden items-center justify-center gap-3 animate-fade-in-up sm:flex"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-white/50 transition-transform duration-200 spring hover:scale-125 hover:text-white"
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
