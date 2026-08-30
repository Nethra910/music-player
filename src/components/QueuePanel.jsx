import { X, Music2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { formatDuration } from "../utils/format";

export default function QueuePanel({ open, onClose }) {
  const { songs, currentSong, playSong } = usePlayer();
  if (!open) return null;

  const currentIdx = songs.findIndex((s) => s.id === currentSong?.id);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col
                        border-l border-gray-800 bg-gray-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Music2 size={18} className="text-green-500" /> Queue
            <span className="text-xs font-normal text-gray-500">
              ({songs.length} songs)
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {songs.map((song, idx) => {
            const isCurrent = song.id === currentSong?.id;
            return (
              <button
                key={song.id}
                onClick={() => playSong(song)}
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition
                            hover:bg-gray-800 ${isCurrent ? "bg-gray-800" : ""}`}
              >
                <span
                  className={`w-5 text-center text-xs ${isCurrent ? "text-green-400" : "text-gray-500"}`}
                >
                  {isCurrent ? "▶" : idx + 1}
                </span>
                <img
                  src={song.image}
                  alt=""
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${isCurrent ? "text-green-400" : "text-white"}`}
                  >
                    {song.song}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {song.primary_artists}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDuration(song.duration)}
                </span>
              </button>
            );
          })}
        </div>

        {currentIdx >= 0 && (
          <div className="border-t border-gray-800 p-3 text-center text-xs text-gray-500">
            Up next: {songs[(currentIdx + 1) % songs.length]?.song ?? "—"}
          </div>
        )}
      </aside>
    </>
  );
}
