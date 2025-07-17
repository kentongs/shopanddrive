import { useState, useEffect, useCallback } from "react";
import { searchService, type SearchResult } from "@/services/search";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clearSearch: () => void;
}

export function useSearch(debounceMs: number = 300): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Simulate async search (you can replace this with actual async search if needed)
      setTimeout(() => {
        const searchResults = searchService.searchAll(searchQuery, 10);
        setResults(searchResults);
        setIsLoading(false);
      }, 50);
    }, debounceMs),
    [debounceMs],
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
      debouncedSearch(query);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    clearSearch,
  };
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
