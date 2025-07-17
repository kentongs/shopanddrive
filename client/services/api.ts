// API service to replace localStorage database
// Switch between localStorage (development) and API (production)

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://yourdomain.com/api";
const USE_API = import.meta.env.VITE_USE_API === "true";

export interface Promo {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  status: "active" | "expired" | "scheduled";
  image: string;
  originalPrice?: string;
  discountPrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
  isPromo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  category: string;
  website?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  contentId: string;
  contentType: "article" | "promo" | "product";
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  isGoogleAuth: boolean;
  googleUserId?: string;
  content: string;
  parentId?: string;
  status: "pending" | "approved" | "rejected";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  logo: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  socialMedia: {
    whatsapp: string;
    facebook?: string;
    instagram?: string;
  };
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Promo operations
  async getAllPromos(): Promise<Promo[]> {
    if (!USE_API) {
      // Fallback to localStorage
      const { db } = await import("./database");
      return db.getAllPromos();
    }
    return this.request("/promos");
  }

  async getActivePromos(): Promise<Promo[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getAllPromos().filter((promo) => promo.status === "active");
    }
    return this.request("/promos?status=active");
  }

  async getPromoById(id: string): Promise<Promo | null> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getPromoById(id);
    }
    try {
      return await this.request(`/promos?id=${id}`);
    } catch {
      return null;
    }
  }

  async createPromo(
    data: Omit<Promo, "id" | "createdAt" | "updatedAt">,
  ): Promise<Promo> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.createPromo(data);
    }
    return this.request("/promos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePromo(id: string, data: Partial<Promo>): Promise<Promo | null> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.updatePromo(id, data);
    }
    return this.request(`/promos?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePromo(id: string): Promise<boolean> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.deletePromo(id);
    }
    try {
      await this.request(`/promos?id=${id}`, { method: "DELETE" });
      return true;
    } catch {
      return false;
    }
  }

  // Article operations
  async getAllArticles(): Promise<Article[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getAllArticles();
    }
    return this.request("/articles");
  }

  async getPublishedArticles(): Promise<Article[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db
        .getAllArticles()
        .filter((article) => article.status === "published");
    }
    return this.request("/articles?status=published");
  }

  async getArticleById(id: string): Promise<Article | null> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getArticleById(id);
    }
    try {
      return await this.request(`/articles?id=${id}`);
    } catch {
      return null;
    }
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getAllProducts();
    }
    return this.request("/products");
  }

  async getInStockProducts(): Promise<Product[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getAllProducts().filter((product) => product.inStock);
    }
    return this.request("/products?in_stock=true");
  }

  // Sponsor operations
  async getAllSponsors(): Promise<Sponsor[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getAllSponsors();
    }
    return this.request("/sponsors");
  }

  async getActiveSponsors(): Promise<Sponsor[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getActiveSponsors();
    }
    return this.request("/sponsors?active=true");
  }

  async createSponsor(
    data: Omit<Sponsor, "id" | "createdAt" | "updatedAt">,
  ): Promise<Sponsor> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.createSponsor(data);
    }
    return this.request("/sponsors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSponsor(
    id: string,
    data: Partial<Sponsor>,
  ): Promise<Sponsor | null> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.updateSponsor(id, data);
    }
    return this.request(`/sponsors?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSponsor(id: string): Promise<boolean> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.deleteSponsor(id);
    }
    try {
      await this.request(`/sponsors?id=${id}`, { method: "DELETE" });
      return true;
    } catch {
      return false;
    }
  }

  // Comment operations
  async getCommentsByContent(
    contentId: string,
    contentType: string,
  ): Promise<Comment[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getApprovedCommentsByContent(contentId, contentType);
    }
    return this.request(
      `/comments?content_id=${contentId}&content_type=${contentType}`,
    );
  }

  async createComment(
    data: Omit<Comment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Comment> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.createComment(data);
    }
    return this.request("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Settings operations
  async getSettings(): Promise<Settings> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.getSettings();
    }
    return this.request("/settings");
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    if (!USE_API) {
      const { db } = await import("./database");
      return db.updateSettings(settings);
    }
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Search operations
  async searchPromos(query: string): Promise<Promo[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      const allPromos = db.getAllPromos();
      return allPromos.filter(
        (promo) =>
          promo.title.toLowerCase().includes(query.toLowerCase()) ||
          promo.description.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return this.request(`/promos?search=${encodeURIComponent(query)}`);
  }

  async searchArticles(query: string): Promise<Article[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      const allArticles = db.getAllArticles();
      return allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.author.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return this.request(`/articles?search=${encodeURIComponent(query)}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!USE_API) {
      const { db } = await import("./database");
      const allProducts = db.getAllProducts();
      return allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return this.request(`/products?search=${encodeURIComponent(query)}`);
  }

  async searchAll(query: string): Promise<{
    promos: Promo[];
    articles: Article[];
    products: Product[];
  }> {
    const [promos, articles, products] = await Promise.all([
      this.searchPromos(query),
      this.searchArticles(query),
      this.searchProducts(query),
    ]);

    return { promos, articles, products };
  }
}

export const apiService = new ApiService();
