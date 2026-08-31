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
import { usePlayer } from "../context/PlayerContext";
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

  const {
    audioRef,
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

  useKeyboardShortcuts(audioRef);

  if (!song) return null;

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (duration > 0) {
      seek(((e.clientX - rect.left) / rect.width) * duration);
    }
  };

  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
      {/* Progress bar */}
      <div
        onClick={handleSeekClick}
        className="h-1.5 w-full cursor-pointer bg-gray-800"
      >
        <div
          className="h-full transition-[width]"
          style={{
            width: `${progress}%`,
            backgroundColor: theme.primary,
          }}
        />
      </div>

      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
        {/* Song info */}
        <button
          onClick={onExpand}
          className="flex min-w-0 flex-1 items-center gap-3 text-left sm:w-52 sm:flex-none"
        >
          <img
            src={song.image}
            alt=""
            className="h-10 w-10 shrink-0 rounded-md object-cover sm:h-12 sm:w-12"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {song.song}
            </p>

            <p className="truncate text-xs text-gray-400">
              {song.primary_artists}
            </p>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleShuffle}
            className={`hidden transition sm:block ${
              shuffle ? "text-green-400" : "text-gray-400 hover:text-white"
            }`}
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={playPrev}
            className="text-gray-400 transition hover:text-white"
            title="Previous"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:scale-95 hover:brightness-110"
            style={{
              backgroundColor: theme.primary,
              filter: "brightness(1.35)",
            }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="text-gray-400 transition hover:text-white"
            title="Next"
          >
            <SkipForward size={20} />
          </button>

          <button
            onClick={cycleRepeat}
            className={`hidden transition sm:block ${
              repeat !== "off"
                ? "text-green-400"
                : "text-gray-400 hover:text-white"
            }`}
            title={`Repeat: ${repeat}`}
          >
            <RepeatIcon size={18} />
          </button>
        </div>

        {/* Time + volume */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <span className="text-xs tabular-nums text-gray-400">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>

          <button
            onClick={toggleMute}
            className="text-gray-400 transition hover:text-white"
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
            className="w-20 accent-green-500"
            aria-label="Volume"
          />
        </div>

        {/* Expand + Queue */}
        <div className="ml-auto flex items-center gap-3 md:ml-2">
          <button
            onClick={onExpand}
            className="text-gray-400 transition hover:text-white"
            title="Expand player"
          >
            <ChevronUp size={20} />
          </button>

          <button
            onClick={onOpenQueue}
            className="text-gray-400 transition hover:text-white"
            title="Queue"
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
