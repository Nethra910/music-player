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
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 animate-fade-in-up">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div
          className={`relative flex-1 rounded-full transition-all duration-300 spring ${
            focused ? "scale-[1.015]" : "scale-100"
          }`}
        >
          <Search
            size={17}
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              focused ? "text-white/70" : "text-white/35"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search songs, artists, albums"
            className="w-full rounded-full bg-white/[0.08] py-3 pl-11 pr-4 text-[15px]
                       placeholder-white/35 outline-none ring-1 ring-white/[0.06]
                       transition-all duration-300 focus:ring-2 focus:ring-white/25 focus:bg-white/[0.1]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white px-5 sm:px-6 py-3 text-[14px] font-semibold text-black
                     transition-all duration-200 spring hover:scale-105 hover:bg-white/90 active:scale-95 disabled:opacity-40"
        >
          {loading ? (
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black" />
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Quick chips — horizontally scrollable on mobile */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={chip}
            onClick={() => {
              setQuery(chip);
              onSearch(chip);
            }}
            className="animate-pop-in whitespace-nowrap rounded-full bg-white/[0.06] px-4 py-1.5 text-[13px]
                       text-white/60 transition-all duration-200 spring hover:scale-110 hover:bg-white/[0.12] hover:text-white active:scale-95"
            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
