import { useState } from "react";
import { X, Plus, ListPlus } from "lucide-react";

export default function AddToPlaylistModal({
  song,
  playlists,
  onAdd,
  onCreate,
  onClose,
}) {
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim(), song); // create + add song in one go
    setNewName("");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl glass-strong border border-white/10 p-5 sm:p-6"
      >
        {/* Drag handle (mobile bottom sheet) */}
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/20 sm:hidden" />

        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
            <ListPlus size={18} className="text-white/60" /> Add to Playlist
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 hover:text-white transition"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mb-4 truncate text-[13px] text-white/40">{song?.song}</p>

        <div className="max-h-60 space-y-1 overflow-y-auto">
          {playlists.length === 0 && (
            <p className="py-4 text-center text-[13px] text-white/35">
              No playlists yet — create one below
            </p>
          )}
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onAdd(pl.id, song)}
              className="flex w-full items-center justify-between rounded-2xl p-3 text-left
                         text-[14px] text-white hover:bg-white/[0.06] transition"
            >
              <span className="truncate">{pl.name}</span>
              <span className="text-[12px] text-white/35">
                {pl.songs.length} songs
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New playlist name"
            className="flex-1 rounded-full bg-white/[0.08] px-4 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/[0.06] placeholder-white/35 focus:ring-2 focus:ring-white/25 transition"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-[14px] font-semibold text-black hover:bg-white/90 active:scale-95 transition"
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>
    </div>
  );
}
