import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Clock, Tag, Star, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import type { Promo, Article, Product } from "@/services/api";

interface SearchResults {
  promos: Promo[];
  articles: Article[];
  products: Product[];
}

export default function EnhancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    promos: [],
    articles: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "promos" | "articles" | "products"
  >("all");

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem("recentSearches");
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Close search when clicking outside
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
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults({ promos: [], articles: [], products: [] });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await apiService.searchAll(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);

      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const totalResults =
    results.promos.length + results.articles.length + results.products.length;

  const filteredResults = {
    promos:
      activeFilter === "all" || activeFilter === "promos"
        ? results.promos.slice(0, 3)
        : [],
    articles:
      activeFilter === "all" || activeFilter === "articles"
        ? results.articles.slice(0, 3)
        : [],
    products:
      activeFilter === "all" || activeFilter === "products"
        ? results.products.slice(0, 3)
        : [],
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari artikel, promo, produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
            if (e.key === "Escape") {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-automotive-blue focus:border-transparent bg-white/90 backdrop-blur-sm placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden">
          {/* Search Header */}
          <div className="p-4 bg-gradient-to-r from-automotive-blue to-automotive-blue-dark text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {query ? `Hasil untuk "${query}"` : "Pencarian"}
              </h3>
              {query && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {isLoading ? "Mencari..." : `${totalResults} hasil`}
                </Badge>
              )}
            </div>

            {/* Filter Tabs */}
            {query && totalResults > 0 && (
              <div className="flex gap-2 mt-3">
                {["all", "promos", "articles", "products"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      activeFilter === filter
                        ? "bg-white text-automotive-blue font-semibold"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {filter === "all"
                      ? "Semua"
                      : filter === "promos"
                        ? "Promo"
                        : filter === "articles"
                          ? "Artikel"
                          : "Produk"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!query ? (
              /* Recent Searches & Suggestions */
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Pencarian Terakhir
                      </h4>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearch(search);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Populer
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "oli mesin",
                      "ban mobil",
                      "tips perawatan",
                      "promo service",
                    ].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setQuery(tag);
                          handleSearch(tag);
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              /* Loading State */
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automotive-blue mx-auto mb-4"></div>
                <p className="text-gray-500">Mencari...</p>
              </div>
            ) : totalResults === 0 ? (
              /* No Results */
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Tidak ada hasil
                </h4>
                <p className="text-gray-500 mb-4">
                  Coba gunakan kata kunci yang berbeda
                </p>
                <Button
                  onClick={() => handleSearch(query)}
                  variant="outline"
                  size="sm"
                >
                  Lihat semua hasil untuk "{query}"
                </Button>
              </div>
            ) : (
              /* Search Results */
              <div className="p-4 space-y-4">
                {/* Promos */}
                {filteredResults.promos.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Promo ({results.promos.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.promos.map((promo) => (
                        <Link
                          key={promo.id}
                          to={`/promo/${promo.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={promo.image}
                              alt={promo.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {promo.title}
                              </h5>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {promo.description}
                              </p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {promo.discount}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {filteredResults.articles.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Artikel ({results.articles.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.articles.map((article) => (
                        <Link
                          key={article.id}
                          to={`/artikel/${article.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {article.title}
                              </h5>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {article.excerpt}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {article.category}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {article.readTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {filteredResults.products.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Produk ({results.products.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/produk/${product.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {product.name}
                              </h5>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-automotive-blue">
                                  {product.price}
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-500 ml-1">
                                    {product.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Results */}
                {totalResults > 0 && (
                  <div className="pt-3 border-t">
                    <Button
                      onClick={() => handleSearch(query)}
                      className="w-full bg-automotive-blue hover:bg-automotive-blue-dark text-white"
                    >
                      Lihat Semua {totalResults} Hasil
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
