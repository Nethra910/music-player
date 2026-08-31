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
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-safe sm:px-4">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 glass-strong shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* Progress bar */}
        <div
          onClick={handleSeekClick}
          className="h-1 w-full cursor-pointer bg-white/10"
        >
          <div
            className="h-full transition-[width]"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${theme.primary}, #FB5C74)`,
            }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
          {/* Song info */}
          <button
            onClick={onExpand}
            className="flex min-w-0 flex-1 items-center gap-3 text-left sm:w-52 sm:flex-none"
          >
            <img
              src={song.image}
              alt=""
              className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md sm:h-12 sm:w-12"
            />

            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-white">
                {song.song}
              </p>

              <p className="truncate text-[12px] text-white/50">
                {song.primary_artists}
              </p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleShuffle}
              className={`hidden transition sm:block ${
                shuffle ? "text-white" : "text-white/40 hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle size={17} />
            </button>

            <button
              onClick={playPrev}
              className="text-white/70 transition hover:text-white"
              title="Previous"
            >
              <SkipBack size={19} fill="currentColor" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition active:scale-90"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} className="ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-white/70 transition hover:text-white"
              title="Next"
            >
              <SkipForward size={19} fill="currentColor" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`hidden transition sm:block ${
                repeat !== "off"
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              }`}
              title={`Repeat: ${repeat}`}
            >
              <RepeatIcon size={17} />
            </button>
          </div>

          {/* Time + volume */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="text-[12px] tabular-nums text-white/40">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>

            <button
              onClick={toggleMute}
              className="text-white/50 transition hover:text-white"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
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
              className="text-white/50 transition hover:text-white"
              title="Expand player"
            >
              <ChevronUp size={19} />
            </button>

            <button
              onClick={onOpenQueue}
              className="text-white/50 transition hover:text-white"
              title="Queue"
            >
              <ListMusic size={19} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
