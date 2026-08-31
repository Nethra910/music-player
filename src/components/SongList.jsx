import SongCard from "./SongCard";

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl p-3 animate-pulse">
      <div className="h-16 w-16 rounded-xl bg-white/[0.06]" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
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
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-[15px] text-white/60">{error}</p>

        <button
          onClick={onRetry}
          className="rounded-full bg-white/10 px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-white/15 active:scale-95"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!songs.length) {
    return (
      <p className="py-16 text-center text-[15px] text-white/40">
        No songs found. Try another search.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isCurrent={currentSong?.id === song.id}
          isPlaying={isPlaying}
          onPlay={() => onPlay(song)}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
    </div>
  );
}
