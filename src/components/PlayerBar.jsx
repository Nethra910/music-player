import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  ChevronUp,
} from "lucide-react";
import { usePlayer, useAudioTime } from "../context/PlayerContext";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useSongTheme from "../hooks/useSongTheme";
import { formatDuration } from "../utils/format";

export default function PlayerBar({ onOpenQueue, onExpand }) {
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

  // Fast-changing values come from the dedicated time context
  const { progress, currentTime, duration } = useAudioTime();
  const { muted, volume, seek, toggleMute, setVolume } = audio;

  const theme = useSongTheme(song);

  useKeyboardShortcuts(audio.audioRef);

  if (!song) return null;

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (duration > 0) {
      seek(((e.clientX - rect.left) / rect.width) * duration);
    }
  };

  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-4 sm:pb-4 animate-slide-up-sheet">
      {/* Floating translucent pill — Apple Music Now Playing style */}
      <div className="glass-bar relative mx-auto max-w-4xl overflow-hidden rounded-2xl border hairline shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-shadow duration-500">
        {/* Rainbow progress line — pinned to the absolute top of the player pill */}
        <div
          onClick={handleSeekClick}
          className="group absolute left-0 top-0 z-10 h-1 w-full cursor-pointer"
        >
          <div
            className="h-full transition-[width] duration-300 group-hover:h-1.5"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #8B0000, #DC143C, #FF3B30, #FF6B5B)",
            }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 pb-2 pt-4 sm:gap-4 sm:px-4">
          {/* Song info */}
          <button
            onClick={onExpand}
            className="flex min-w-0 flex-1 items-center gap-3 text-left sm:w-48 sm:flex-none"
          >
            <div
              className={`shrink-0 rounded-lg ${isPlaying ? "animate-glow-pulse" : ""}`}
              style={{ "--glow-color": `${theme.primary}66` }}
            >
              <img
                src={song.image}
                alt=""
                className={`h-11 w-11 rounded-lg object-cover shadow-md transition-transform duration-500 sm:h-12 sm:w-12 ${
                  isPlaying ? "animate-breathe" : ""
                }`}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {song.song}
              </p>

              <p className="truncate text-xs text-secondary">
                {song.primary_artists}
              </p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleShuffle}
              className={`hidden transition-all duration-200 spring hover:scale-125 active:scale-90 sm:block ${
                shuffle ? "text-white" : "text-secondary hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={playPrev}
              className="text-secondary transition-all duration-200 spring hover:scale-125 hover:text-white active:scale-90"
              title="Previous"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DC143C] text-white shadow-lg transition-transform duration-200 spring active:scale-90 hover:scale-105 hover:brightness-110"
              title={isPlaying ? "Pause" : "Play"}
            >
              <span
                key={isPlaying ? "pause" : "play"}
                className="flex items-center justify-center animate-pop-in"
              >
                {isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-0.5" />
                )}
              </span>
            </button>

            <button
              onClick={playNext}
              className="text-secondary transition-all duration-200 spring hover:scale-125 hover:text-white active:scale-90"
              title="Next"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={cycleRepeat}
              className={`hidden transition-all duration-200 spring hover:scale-125 active:scale-90 sm:block ${
                repeat !== "off"
                  ? "text-white"
                  : "text-secondary hover:text-white"
              }`}
              title={`Repeat: ${repeat}`}
            >
              <RepeatIcon size={18} />
            </button>
          </div>

          {/* Time + volume */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="text-xs tabular-nums text-secondary">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>

            <button
              onClick={toggleMute}
              className="text-secondary transition-transform duration-200 spring hover:scale-125 hover:text-white"
              title={muted ? "Unmute" : "Mute"}
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
              className="w-20 accent-white"
              aria-label="Volume"
            />
          </div>

          {/* Expand + Queue */}
          <div className="ml-auto flex items-center gap-3 md:ml-2">
            <button
              onClick={onExpand}
              className="text-secondary transition-transform duration-200 spring hover:scale-125 hover:-translate-y-0.5 hover:text-white active:scale-90"
              title="Expand player"
            >
              <ChevronUp size={20} />
            </button>

            <button
              onClick={onOpenQueue}
              className="text-secondary transition-transform duration-200 spring hover:scale-125 hover:text-white active:scale-90"
              title="Queue"
            >
              <ListMusic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
