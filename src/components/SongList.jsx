import SongCard from "./SongCard";

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-3 animate-pulse">
      <div className="h-16 w-16 rounded-lg bg-gray-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-800" />
        <div className="h-3 w-1/2 rounded bg-gray-800" />
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
}) {
  if (loading)
    return (
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-red-400">⚠️ {error}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-gray-800 px-5 py-2 text-sm hover:bg-gray-700 transition"
        >
          Retry
        </button>
      </div>
    );

  if (!songs.length)
    return (
      <p className="py-16 text-center text-gray-500">
        🔍 No songs found. Try another search!
      </p>
    );

  return (
    <div className="space-y-1">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isCurrent={currentSong?.id === song.id}
          isPlaying={isPlaying}
          onPlay={() => onPlay(song)}
        />
      ))}
    </div>
  );
}
