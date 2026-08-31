import SongCard from "./SongCard";

function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="h-16 w-16 rounded-xl animate-shimmer" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded-full animate-shimmer" />
        <div className="h-3 w-1/2 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

export default function SongList({
  songs,
  loading,
  error,
  currentSong,
  isPlaying,
  onPlay,
  onRetry,
  onAddToPlaylist,
}) {
  if (loading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.05} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in-up">
        <p className="text-[15px] text-white/60">{error}</p>

        <button
          onClick={onRetry}
          className="rounded-full bg-white/10 px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-200 spring hover:scale-105 hover:bg-white/15 active:scale-95"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!songs.length) {
    return (
      <p className="py-16 text-center text-[15px] text-white/40 animate-fade-in-up">
        No songs found. Try another search.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {songs.map((song, i) => (
        <div
          key={song.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i, 12) * 0.04}s` }}
        >
          <SongCard
            song={song}
            isCurrent={currentSong?.id === song.id}
            isPlaying={isPlaying}
            onPlay={() => onPlay(song)}
            onAddToPlaylist={onAddToPlaylist}
          />
        </div>
      ))}
    </div>
  );
}
