import { useState } from "react";
import { Search } from "lucide-react";

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
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums"
            className="w-full rounded-full bg-white/[0.08] py-3 pl-11 pr-4 text-[15px]
                       placeholder-white/35 outline-none ring-1 ring-white/[0.06]
                       focus:ring-2 focus:ring-white/25 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 sm:px-6 py-3 text-[14px] font-semibold text-black
                     hover:bg-white/90 active:scale-95 disabled:opacity-40 transition"
        >
          {loading ? "…" : "Search"}
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
            className="whitespace-nowrap rounded-full bg-white/[0.06] px-4 py-1.5 text-[13px]
                       text-white/60 hover:bg-white/[0.12] hover:text-white transition"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
