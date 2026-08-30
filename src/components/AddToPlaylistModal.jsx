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
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-gray-900 border border-gray-800 p-4 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <ListPlus size={18} className="text-green-500" /> Add to playlist
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 truncate text-sm text-gray-400">🎵 {song?.song}</p>

        <div className="max-h-60 space-y-1 overflow-y-auto">
          {playlists.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No playlists yet — create one below 👇
            </p>
          )}
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => onAdd(pl.id, song)}
              className="flex w-full items-center justify-between rounded-lg p-3 text-left
                         text-sm hover:bg-gray-800 transition"
            >
              <span className="truncate">{pl.name}</span>
              <span className="text-xs text-gray-500">
                {pl.songs.length} songs
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 border-t border-gray-800 pt-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New playlist name..."
            className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm outline-none ring-1 ring-gray-700 focus:ring-green-500"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>
    </div>
  );
}
