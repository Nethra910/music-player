import { useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatDuration, getAudioUrl } from "../utils/format";

export default function PlayerBar({
  song,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  if (!song) return null;

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0,
    );
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const toggleMute = () => {
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={getAudioUrl(song)}
        autoPlay={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={onNext}
      />

      {/* Sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
        {/* Progress bar — tappable full width on top of the bar (mobile friendly) */}
        <div
          onClick={handleSeek}
          className="group h-1.5 w-full cursor-pointer bg-gray-800"
        >
          <div
            className="h-full bg-green-500 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
          {/* Song info — hides album text on small screens */}
          <img
            src={song.image}
            alt=""
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover shrink-0"
          />
          <div className="min-w-0 flex-1 sm:flex-none sm:w-52">
            <p className="truncate text-sm font-medium">{song.song}</p>
            <p className="hidden truncate text-xs text-gray-400 sm:block">
              {song.primary_artists}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onPrev}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={onTogglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-black
                         hover:bg-green-400 active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </button>
            <button
              onClick={onNext}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Time + volume — hidden on mobile to avoid clutter */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <span className="text-xs text-gray-400 tabular-nums">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
