import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Tag,
  Package,
  ArrowRight,
  Search,
  Clock,
} from "lucide-react";
import type { SearchResult } from "@/services/search";

interface LiveSearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onItemClick: () => void;
}

const getTypeIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "article":
      return FileText;
    case "promo":
      return Tag;
    case "product":
      return Package;
    default:
      return Search;
  }
};

const getTypeBadgeColor = (type: SearchResult["type"]) => {
  switch (type) {
    case "article":
      return "bg-blue-100 text-blue-800";
    case "promo":
      return "bg-red-100 text-red-800";
    case "product":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeLabel = (type: SearchResult["type"]) => {
  switch (type) {
    case "article":
      return "Artikel";
    case "promo":
      return "Promo";
    case "product":
      return "Produk";
    default:
      return "";
  }
};

export default function LiveSearchResults({
  results,
  query,
  isLoading,
  onItemClick,
}: LiveSearchResultsProps) {
  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-automotive-blue"></div>
            <span className="text-sm text-muted-foreground">Mencari...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!query.trim()) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Ketik untuk mencari artikel, promo, atau produk
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs">
                oli mesin
              </Badge>
              <Badge variant="outline" className="text-xs">
                ban mobil
              </Badge>
              <Badge variant="outline" className="text-xs">
                promo service
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">
              Tidak ditemukan hasil untuk "{query}"
            </p>
            <p className="text-xs text-muted-foreground">
              Coba kata kunci lain atau periksa ejaan Anda
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2 p-0 text-automotive-blue"
              asChild
            >
              <Link to="/produk" onClick={onItemClick}>
                Lihat semua produk
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      acc[result.type].push(result);
      return acc;
    },
    { article: [], promo: [], product: [] } as Record<
      SearchResult["type"],
      SearchResult[]
    >,
  );

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg max-h-96 overflow-y-auto">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {results.length} hasil untuk "{query}"
            </p>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-automotive-blue"
              asChild
            >
              <Link
                to={`/produk?search=${encodeURIComponent(query)}`}
                onClick={onItemClick}
              >
                Lihat semua
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="divide-y">
          {Object.entries(groupedResults).map(([type, typeResults]) => {
            if (typeResults.length === 0) return null;

            return (
              <div key={type}>
                {typeResults.map((result, index) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <Link
                      key={result.id}
                      to={result.url}
                      onClick={onItemClick}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt={result.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge
                                className={`text-xs ${getTypeBadgeColor(
                                  result.type,
                                )}`}
                              >
                                {getTypeLabel(result.type)}
                              </Badge>
                              {result.extra && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {result.extra}
                                </div>
                              )}
                            </div>
                            <h4 className="font-medium text-sm line-clamp-1 mb-1">
                              {result.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {results.length >= 10 && (
          <div className="p-4 border-t bg-gray-50 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link
                to={`/produk?search=${encodeURIComponent(query)}`}
                onClick={onItemClick}
              >
                Lihat semua hasil ({results.length}+)
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
