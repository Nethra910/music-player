import { X, Music2 } from "lucide-react";
import { usePlayer } from "../hooks/usePlayerContext";
import { formatDuration } from "../utils/format";

export default function QueuePanel({ open, onClose }) {
  const { songs, currentSong, playSong } = usePlayer();
  if (!open) return null;

  const currentIdx = songs.findIndex((s) => s.id === currentSong?.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col
                   border-l border-white/10 glass-strong shadow-2xl animate-slide-up-sheet"
        style={{ animationName: "slide-in-right" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-white">
            <Music2 size={18} className="text-[#FA233B]" /> Queue
            <span className="text-[12px] font-normal text-white/40">
              ({songs.length} songs)
            </span>
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 spring hover:scale-110 hover:bg-white/15 hover:text-white active:scale-90"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {songs.map((song, idx) => {
            const isCurrent = song.id === currentSong?.id;
            return (
              <button
                key={song.id}
                onClick={() => playSong(song)}
                className={`flex w-full animate-fade-in-up items-center gap-3 rounded-2xl p-2 text-left transition-all duration-200
                            hover:scale-[1.01] hover:bg-white/[0.06] ${isCurrent ? "bg-[#FA233B]/[0.08]" : ""}`}
                style={{ animationDelay: `${Math.min(idx, 14) * 0.03}s` }}
              >
                <span
                  className={`w-5 shrink-0 text-center text-[12px] tabular-nums ${
                    isCurrent ? "text-[#FB5C74]" : "text-white/35"
                  }`}
                >
                  {isCurrent ? "♪" : idx + 1}
                </span>
                <img
                  src={song.image}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[13px] font-medium ${
                      isCurrent ? "text-[#FB5C74]" : "text-white"
                    }`}
                  >
                    {song.song}
                  </p>
                  <p className="truncate text-[12px] text-white/40">
                    {song.primary_artists}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] tabular-nums text-white/35">
                  {formatDuration(song.duration)}
                </span>
              </button>
            );
          })}
        </div>

        {currentIdx >= 0 && (
          <div className="border-t border-white/10 p-3 text-center text-[12px] text-white/40">
            Up next: {songs[(currentIdx + 1) % songs.length]?.song ?? "—"}
          </div>
        )}
      </aside>
    </>
  );
}
