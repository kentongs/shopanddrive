import { db, type Article, type Promo, type Product } from "./database";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "article" | "promo" | "product";
  url: string;
  image?: string;
  extra?: string; // For additional info like price, author, etc.
}

export class SearchService {
  private static instance: SearchService;

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents
  }

  private searchInText(searchTerm: string, ...texts: string[]): boolean {
    const normalizedSearch = this.normalizeText(searchTerm);
    return texts.some((text) =>
      this.normalizeText(text).includes(normalizedSearch),
    );
  }

  searchArticles(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const articles = db
      .getAllArticles()
      .filter((article) => article.status === "published");

    return articles
      .filter((article) =>
        this.searchInText(
          query,
          article.title,
          article.excerpt,
          article.content,
          article.author,
          article.category,
        ),
      )
      .map((article) => ({
        id: article.id,
        title: article.title,
        description: article.excerpt,
        type: "article" as const,
        url: `/artikel/${article.id}`,
        image: article.image,
        extra: `${article.author} • ${article.readTime}`,
      }));
  }

  searchPromos(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const promos = db
      .getAllPromos()
      .filter((promo) => promo.status === "active");

    return promos
      .filter((promo) =>
        this.searchInText(query, promo.title, promo.description),
      )
      .map((promo) => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        type: "promo" as const,
        url: `/promo/${promo.id}`,
        image: promo.image,
        extra: `${promo.discount} • ${promo.discountPrice}`,
      }));
  }

  searchProducts(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const products = db.getAllProducts().filter((product) => product.inStock);

    return products
      .filter((product) =>
        this.searchInText(
          query,
          product.name,
          product.description,
          product.category,
        ),
      )
      .map((product) => ({
        id: product.id,
        title: product.name,
        description: product.description,
        type: "product" as const,
        url: `/produk/${product.id}`,
        image: product.image,
        extra: `${product.category} • ${product.price}`,
      }));
  }

  searchAll(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return [];

    const articles = this.searchArticles(query);
    const promos = this.searchPromos(query);
    const products = this.searchProducts(query);

    // Combine and sort by relevance (exact matches first, then partial)
    const allResults = [...articles, ...promos, ...products];

    // Sort by relevance: exact title matches first, then partial matches
    allResults.sort((a, b) => {
      const aExactTitle = this.normalizeText(a.title).includes(
        this.normalizeText(query),
      );
      const bExactTitle = this.normalizeText(b.title).includes(
        this.normalizeText(query),
      );

      if (aExactTitle && !bExactTitle) return -1;
      if (!aExactTitle && bExactTitle) return 1;

      // If both are exact or both are partial, maintain original order
      return 0;
    });

    return allResults.slice(0, limit);
  }

  getSearchSuggestions(query: string): string[] {
    if (!query.trim()) return [];

    const articles = db.getAllArticles();
    const promos = db.getAllPromos();
    const products = db.getAllProducts();

    const suggestions = new Set<string>();

    // Add category suggestions
    [...articles, ...products].forEach((item) => {
      if (
        item.category &&
        this.normalizeText(item.category).includes(this.normalizeText(query))
      ) {
        suggestions.add(item.category);
      }
    });

    // Add common search terms
    const commonTerms = [
      "oli mesin",
      "ban mobil",
      "aki",
      "service",
      "promo",
      "tips perawatan",
      "modifikasi",
      "spare part",
    ];

    commonTerms.forEach((term) => {
      if (this.normalizeText(term).includes(this.normalizeText(query))) {
        suggestions.add(term);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }
}

export const searchService = SearchService.getInstance();
