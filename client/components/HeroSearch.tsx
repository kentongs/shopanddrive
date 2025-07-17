import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import LiveSearchResults from "./LiveSearchResults";
import { useSearch } from "@/hooks/useSearch";

export default function HeroSearch() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    clearSearch,
  } = useSearch();

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/produk?search=${encodeURIComponent(query)}`);
      clearSearch();
    }
  };

  return (
    <div className="mt-8 max-w-2xl">
      <form onSubmit={handleSearch}>
        <div ref={searchRef} className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari produk otomotif, oli, ban, aki..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-xl"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="px-6 py-4 bg-automotive-orange hover:bg-automotive-orange/90 rounded-xl shadow-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Cari
            </Button>
          </div>

          {/* Live Search Results for Hero */}
          {isOpen && (
            <div className="relative z-10">
              <LiveSearchResults
                results={results}
                query={query}
                isLoading={isLoading}
                onItemClick={() => {
                  setIsOpen(false);
                  clearSearch();
                }}
              />
            </div>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-white/80 text-sm">Populer:</span>
        {["oli mesin", "ban mobil", "aki", "service rutin"].map(
          (suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                setIsOpen(true);
              }}
              className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
