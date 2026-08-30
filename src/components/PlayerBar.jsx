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
import useAudioPlayer from "../hooks/useAudioPlayer";
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
  } = usePlayer();

  const theme = useSongTheme(song);

  const {
    audioRef,
    progress,
    currentTime,
    duration,
    muted,
    volume,
    handleEnded,
    seek,
    toggleMute,
    setVolume,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useAudioPlayer();

  if (!song) return null;

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-800 bg-gray-900/95 backdrop-blur relative overflow-visible">
        {/* Colored glow above the player */}
        <div
          className="pointer-events-none absolute -top-8 left-0 right-0 h-8"
          style={{
            background: `linear-gradient(to top, ${theme.dark}, transparent)`,
          }}
        />

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
          {/* Song Image */}
          <img
            src={song.image}
            alt=""
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover shrink-0"
          />

          {/* Song Information */}
          <div className="min-w-0 flex-1 sm:flex-none sm:w-52">
            <p className="truncate text-sm font-medium">{song.song}</p>

            <p className="hidden truncate text-xs text-gray-400 sm:block">
              {song.primary_artists}
            </p>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`hidden sm:block transition ${
                shuffle ? "text-green-400" : "text-gray-400 hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            {/* Previous */}
            <button
              onClick={playPrev}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipBack size={20} />
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              style={{
                backgroundColor: theme.primary,
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-black hover:brightness-110 active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipForward size={20} />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`hidden sm:block transition ${
                repeat !== "off"
                  ? "text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              title={`Repeat: ${repeat}`}
            >
              <RepeatIcon size={18} />
            </button>
          </div>

          {/* Volume + Duration */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="text-xs text-gray-400 tabular-nums">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>

            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition"
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
            />
          </div>

          {/* Expand Button */}
          <button
            onClick={onExpand}
            className="text-gray-400 hover:text-white transition"
            title="Expand"
          >
            <ChevronUp size={20} />
          </button>

          {/* Queue Button */}
          <button
            onClick={onOpenQueue}
            className="ml-auto md:ml-2 text-gray-400 hover:text-white transition"
            title="Queue"
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
