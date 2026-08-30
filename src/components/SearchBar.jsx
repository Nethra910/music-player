import { useState } from "react";

const QUICK_CHIPS = [
  "Telugu Songs",
  "Hindi Songs",
  "Trending 2026",
  "Punjabi Hits",
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="flex-1 rounded-xl bg-gray-800 px-4 py-3 text-sm sm:text-base
                     placeholder-gray-500 outline-none ring-1 ring-gray-700
                     focus:ring-2 focus:ring-green-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-500 px-4 sm:px-6 py-3 font-semibold text-black
                     hover:bg-green-400 active:scale-95 disabled:opacity-50 transition"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {/* Quick chips — horizontally scrollable on mobile */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setQuery(chip);
              onSearch(chip);
            }}
            className="whitespace-nowrap rounded-full bg-gray-800 px-4 py-1.5 text-xs sm:text-sm
                       text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
