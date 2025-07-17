import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Tag,
  Sparkles,
  TrendingUp,
  Grid,
  List,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { apiService } from "@/services/api";
import type { Promo, Article, Product } from "@/services/api";

interface SearchResults {
  promos: Promo[];
  articles: Article[];
  products: Product[];
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResults>({
    promos: [],
    articles: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "promos" | "articles" | "products"
  >("all");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "popular">(
    "relevance",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (query) {
      searchData(query);
    }
  }, [query]);

  const searchData = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const searchResults = await apiService.searchAll(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults =
    results.promos.length + results.articles.length + results.products.length;

  const getFilteredResults = () => {
    switch (activeFilter) {
      case "promos":
        return { promos: results.promos, articles: [], products: [] };
      case "articles":
        return { promos: [], articles: results.articles, products: [] };
      case "products":
        return { promos: [], articles: [], products: results.products };
      default:
        return results;
    }
  };

  const filteredResults = getFilteredResults();

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pencarian Kosong
          </h1>
          <p className="text-gray-600 mb-8">
            Silakan masukkan kata kunci untuk mencari promo, artikel, atau
            produk.
          </p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Results Header */}
      <section className="py-16 bg-gradient-to-br from-automotive-blue via-automotive-blue-dark to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-automotive-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-automotive-orange/20 text-automotive-orange border-automotive-orange/30 mb-6">
              <Search className="h-4 w-4 mr-2" />
              Hasil Pencarian
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hasil untuk{" "}
              <span className="bg-gradient-to-r from-automotive-orange to-yellow-400 bg-clip-text text-transparent">
                "{query}"
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              {isLoading
                ? "Mencari..."
                : `Ditemukan ${totalResults} hasil yang sesuai`}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-automotive-orange">
                  {results.promos.length}
                </div>
                <div className="text-sm text-gray-300">Promo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-automotive-orange">
                  {results.articles.length}
                </div>
                <div className="text-sm text-gray-300">Artikel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-automotive-orange">
                  {results.products.length}
                </div>
                <div className="text-sm text-gray-300">Produk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "Semua", count: totalResults },
                { key: "promos", label: "Promo", count: results.promos.length },
                {
                  key: "articles",
                  label: "Artikel",
                  count: results.articles.length,
                },
                {
                  key: "products",
                  label: "Produk",
                  count: results.products.length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.key
                      ? "bg-automotive-blue text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-automotive-blue"
              >
                <option value="relevance">Paling Relevan</option>
                <option value="date">Terbaru</option>
                <option value="popular">Terpopuler</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-automotive-blue text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-automotive-blue text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            /* Loading State */
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-automotive-blue mx-auto mb-4"></div>
              <p className="text-gray-600">
                Mencari hasil terbaik untuk Anda...
              </p>
            </div>
          ) : totalResults === 0 ? (
            /* No Results */
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tidak Ada Hasil Ditemukan
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Maaf, kami tidak dapat menemukan hasil untuk "{query}". Coba
                gunakan kata kunci yang berbeda atau lebih spesifik.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Saran Pencarian:
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "oli mesin",
                      "ban mobil",
                      "service berkala",
                      "tips perawatan",
                    ].map((suggestion) => (
                      <Link
                        key={suggestion}
                        to={`/search?q=${encodeURIComponent(suggestion)}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/">
                  <Button>Kembali ke Beranda</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Promos */}
              {filteredResults.promos.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-automotive-orange to-red-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Promo ({filteredResults.promos.length})
                    </h2>
                    <Sparkles className="h-6 w-6 text-automotive-orange" />
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredResults.promos.map((promo, index) => (
                      <Card
                        key={promo.id}
                        className={`group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50/50 hover:scale-105 overflow-hidden ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`relative ${
                            viewMode === "list" ? "w-48 flex-shrink-0" : ""
                          }`}
                        >
                          <img
                            src={promo.image}
                            alt={promo.title}
                            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === "list"
                                ? "w-full h-full"
                                : "w-full h-48"
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Badge className="absolute top-3 left-3 bg-automotive-orange/90 text-white border-0">
                            {promo.discount}
                          </Badge>
                        </div>

                        <CardContent
                          className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-automotive-blue transition-colors duration-300 line-clamp-2">
                            {promo.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                            {promo.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              {promo.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {promo.originalPrice}
                                </span>
                              )}
                              <div className="text-xl font-bold text-automotive-orange">
                                {promo.discountPrice}
                              </div>
                            </div>
                            <Badge
                              variant={
                                promo.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {promo.status === "active" ? "Aktif" : "Berakhir"}
                            </Badge>
                          </div>

                          <Button
                            asChild
                            className="w-full group-hover:bg-automotive-blue group-hover:text-white transition-all duration-300"
                            variant="outline"
                          >
                            <Link to={`/promo/${promo.id}`}>
                              Lihat Detail
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {filteredResults.articles.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-automotive-blue to-cyan-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Artikel ({filteredResults.articles.length})
                    </h2>
                    <TrendingUp className="h-6 w-6 text-automotive-blue" />
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredResults.articles.map((article) => (
                      <Card
                        key={article.id}
                        className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white hover:scale-105 overflow-hidden ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`relative ${
                            viewMode === "list" ? "w-48 flex-shrink-0" : ""
                          }`}
                        >
                          <img
                            src={article.image}
                            alt={article.title}
                            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === "list"
                                ? "w-full h-full"
                                : "w-full h-48"
                            }`}
                          />
                          <Badge className="absolute top-3 left-3 bg-automotive-blue/90 text-white border-0">
                            {article.category}
                          </Badge>
                        </div>

                        <CardContent
                          className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-automotive-blue transition-colors duration-300 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {article.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                          </div>

                          <Button
                            asChild
                            variant="outline"
                            className="w-full group-hover:bg-automotive-blue group-hover:text-white group-hover:border-automotive-blue transition-all duration-300"
                          >
                            <Link to={`/artikel/${article.id}`}>
                              Baca Selengkapnya
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {filteredResults.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Produk ({filteredResults.products.length})
                    </h2>
                    <Tag className="h-6 w-6 text-green-500" />
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredResults.products.map((product) => (
                      <Card
                        key={product.id}
                        className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white hover:scale-105 overflow-hidden ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`relative ${
                            viewMode === "list" ? "w-48 flex-shrink-0" : ""
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === "list"
                                ? "w-full h-full"
                                : "w-full h-48"
                            }`}
                          />
                          {product.isPromo && (
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                              Promo
                            </Badge>
                          )}
                        </div>

                        <CardContent
                          className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-automotive-blue transition-colors duration-300 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <div className="text-xl font-bold text-automotive-blue">
                              {product.price}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                {product.originalPrice}
                              </div>
                            )}
                          </div>

                          <Button
                            asChild
                            className="w-full bg-automotive-blue hover:bg-automotive-blue-dark text-white"
                          >
                            <Link to={`/produk/${product.id}`}>
                              Lihat Detail
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
