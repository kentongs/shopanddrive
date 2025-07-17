// Simple database service using localStorage for persistence
// In a real application, this would be API calls to a backend

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
  parentId?: string; // For replies
  status: "pending" | "approved" | "rejected";
  isRead: boolean; // For admin notifications
  createdAt: string;
  updatedAt: string;
}

export interface CommentNotification {
  id: string;
  commentId: string;
  type: "new_comment" | "new_reply";
  message: string;
  isRead: boolean;
  createdAt: string;
}

class DatabaseService {
  private getStorageKey(table: string): string {
    return `shop_drive_${table}`;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Generic CRUD operations
  private getAll<T>(table: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(table));
    return data ? JSON.parse(data) : [];
  }

  private getById<T extends { id: string }>(
    table: string,
    id: string,
  ): T | null {
    const items = this.getAll<T>(table);
    return items.find((item) => item.id === id) || null;
  }

  private create<
    T extends { id?: string; createdAt?: string; updatedAt?: string },
  >(table: string, data: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const items = this.getAll<T>(table);
    const now = this.getCurrentTimestamp();
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    items.push(newItem);
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(items));
    return newItem;
  }

  private update<T extends { id: string; updatedAt?: string }>(
    table: string,
    id: string,
    data: Partial<T>,
  ): T | null {
    const items = this.getAll<T>(table);
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };

    items[index] = updatedItem;
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(items));
    return updatedItem;
  }

  private delete(table: string, id: string): boolean {
    const items = this.getAll(table);
    const filteredItems = items.filter((item) => item.id !== id);

    if (filteredItems.length === items.length) return false;

    localStorage.setItem(
      this.getStorageKey(table),
      JSON.stringify(filteredItems),
    );
    return true;
  }

  // Promo operations
  getAllPromos(): Promo[] {
    return this.getAll<Promo>("promos");
  }

  getPromoById(id: string): Promo | null {
    return this.getById<Promo>("promos", id);
  }

  createPromo(data: Omit<Promo, "id" | "createdAt" | "updatedAt">): Promo {
    return this.create<Promo>("promos", data);
  }

  updatePromo(id: string, data: Partial<Promo>): Promo | null {
    return this.update<Promo>("promos", id, data);
  }

  deletePromo(id: string): boolean {
    return this.delete("promos", id);
  }

  // Article operations
  getAllArticles(): Article[] {
    return this.getAll<Article>("articles");
  }

  getArticleById(id: string): Article | null {
    return this.getById<Article>("articles", id);
  }

  createArticle(
    data: Omit<Article, "id" | "createdAt" | "updatedAt">,
  ): Article {
    return this.create<Article>("articles", data);
  }

  updateArticle(id: string, data: Partial<Article>): Article | null {
    return this.update<Article>("articles", id, data);
  }

  deleteArticle(id: string): boolean {
    return this.delete("articles", id);
  }

  // Product operations
  getAllProducts(): Product[] {
    return this.getAll<Product>("products");
  }

  getProductById(id: string): Product | null {
    return this.getById<Product>("products", id);
  }

  createProduct(
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Product {
    return this.create<Product>("products", data);
  }

  updateProduct(id: string, data: Partial<Product>): Product | null {
    return this.update<Product>("products", id, data);
  }

  deleteProduct(id: string): boolean {
    return this.delete("products", id);
  }

  // Settings operations
  getSettings(): Settings {
    const settings = localStorage.getItem(this.getStorageKey("settings"));
    if (!settings) {
      // Return default settings
      const defaultSettings: Settings = {
        siteName: "Shop and Drive Taman Tekno",
        siteDescription: "Solusi terpercaya untuk kebutuhan otomotif Anda",
        logo: "/placeholder.svg",
        contactPhone: "08995555095",
        contactEmail: "info@shopanddrive.com",
        address: "Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan",
        socialMedia: {
          whatsapp: "628995555095",
        },
      };
      this.updateSettings(defaultSettings);
      return defaultSettings;
    }
    return JSON.parse(settings);
  }

  updateSettings(settings: Settings): Settings {
    localStorage.setItem(
      this.getStorageKey("settings"),
      JSON.stringify(settings),
    );
    return settings;
  }

  // Comment operations
  getAllComments(): Comment[] {
    return this.getAll<Comment>("comments");
  }

  getCommentById(id: string): Comment | null {
    return this.getById<Comment>("comments", id);
  }

  getCommentsByContent(contentId: string, contentType: string): Comment[] {
    const comments = this.getAllComments();
    return comments.filter(
      (comment) =>
        comment.contentId === contentId && comment.contentType === contentType,
    );
  }

  getApprovedCommentsByContent(
    contentId: string,
    contentType: string,
  ): Comment[] {
    const comments = this.getCommentsByContent(contentId, contentType);
    return comments.filter((comment) => comment.status === "approved");
  }

  createComment(
    data: Omit<Comment, "id" | "createdAt" | "updatedAt">,
  ): Comment {
    const comment = this.create<Comment>("comments", data);

    // Create notification for admin
    this.createCommentNotification({
      commentId: comment.id,
      type: data.parentId ? "new_reply" : "new_comment",
      message: data.parentId
        ? `Balasan baru dari ${data.authorName}`
        : `Komentar baru dari ${data.authorName}`,
      isRead: false,
    });

    return comment;
  }

  updateComment(id: string, data: Partial<Comment>): Comment | null {
    return this.update<Comment>("comments", id, data);
  }

  deleteComment(id: string): boolean {
    return this.delete("comments", id);
  }

  approveComment(id: string): Comment | null {
    return this.updateComment(id, { status: "approved", isRead: true });
  }

  rejectComment(id: string): Comment | null {
    return this.updateComment(id, { status: "rejected", isRead: true });
  }

  getPendingComments(): Comment[] {
    const comments = this.getAllComments();
    return comments.filter((comment) => comment.status === "pending");
  }

  getUnreadCommentsCount(): number {
    const comments = this.getAllComments();
    return comments.filter(
      (comment) => !comment.isRead && comment.status === "pending",
    ).length;
  }

  // Comment notification operations
  getAllNotifications(): CommentNotification[] {
    return this.getAll<CommentNotification>("notifications");
  }

  createCommentNotification(
    data: Omit<CommentNotification, "id" | "createdAt">,
  ): CommentNotification {
    return this.create<CommentNotification>("notifications", data);
  }

  markNotificationAsRead(id: string): CommentNotification | null {
    return this.update<CommentNotification>("notifications", id, {
      isRead: true,
    });
  }

  getUnreadNotificationsCount(): number {
    const notifications = this.getAllNotifications();
    return notifications.filter((notification) => !notification.isRead).length;
  }

  getRecentNotifications(limit: number = 10): CommentNotification[] {
    const notifications = this.getAllNotifications();
    return notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  // Sponsor operations
  getAllSponsors(): Sponsor[] {
    return this.getAll<Sponsor>("sponsors");
  }

  getSponsorById(id: string): Sponsor | null {
    return this.getById<Sponsor>("sponsors", id);
  }

  getActiveSponsors(): Sponsor[] {
    const sponsors = this.getAllSponsors();
    return sponsors
      .filter((sponsor) => sponsor.isActive)
      .sort((a, b) => a.order - b.order);
  }

  createSponsor(
    data: Omit<Sponsor, "id" | "createdAt" | "updatedAt">,
  ): Sponsor {
    return this.create<Sponsor>("sponsors", data);
  }

  updateSponsor(id: string, data: Partial<Sponsor>): Sponsor | null {
    return this.update<Sponsor>("sponsors", id, data);
  }

  deleteSponsor(id: string): boolean {
    return this.delete("sponsors", id);
  }

  // Initialize with sample data
  initializeSampleData(): void {
    // Only initialize if no data exists
    if (this.getAllPromos().length === 0) {
      const samplePromos: Omit<Promo, "id" | "createdAt" | "updatedAt">[] = [
        {
          title: "Promo Oli Mobil Premium",
          description:
            "Dapatkan diskon 30% untuk semua jenis oli mobil premium",
          discount: "30%",
          validUntil: "2024-12-31",
          status: "active",
          image: "/placeholder.svg",
          originalPrice: "Rp 120.000",
          discountPrice: "Rp 84.000",
        },
        {
          title: "Paket Service Lengkap",
          description: "Service lengkap + ganti oli hanya 299rb",
          discount: "Hemat 100rb",
          validUntil: "2025-01-15",
          status: "active",
          image: "/placeholder.svg",
          originalPrice: "Rp 399.000",
          discountPrice: "Rp 299.000",
        },
        {
          title: "Ban Mobil Berkualitas",
          description: "Beli 4 ban gratis pemasangan dan balancing",
          discount: "Gratis Pasang",
          validUntil: "2025-02-28",
          status: "scheduled",
          image: "/placeholder.svg",
          discountPrice: "Rp 2.500.000",
        },
      ];
      samplePromos.forEach((promo) => this.createPromo(promo));
    }

    if (this.getAllArticles().length === 0) {
      const sampleArticles: Omit<Article, "id" | "createdAt" | "updatedAt">[] =
        [
          {
            title: "Tips Merawat Mesin Mobil di Musim Hujan",
            excerpt:
              "Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal...",
            content:
              "Musim hujan memerlukan perawatan khusus untuk menjaga performa mesin tetap optimal. Berikut tips lengkap untuk merawat mesin mobil Anda di musim hujan...",
            date: "15 Desember 2024",
            author: "Ahmad Wijaya",
            category: "Tips Perawatan",
            readTime: "5 menit",
            image: "/placeholder.svg",
            status: "published",
          },
          {
            title: "5 Tanda Oli Mobil Harus Diganti",
            excerpt:
              "Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin...",
            content:
              "Mengenali tanda-tanda oli yang sudah tidak layak pakai adalah kunci perawatan mesin yang baik...",
            date: "12 Desember 2024",
            author: "Sari Indah",
            category: "Tips Perawatan",
            readTime: "3 menit",
            image: "/placeholder.svg",
            status: "published",
          },
        ];
      sampleArticles.forEach((article) => this.createArticle(article));
    }

    if (this.getAllProducts().length === 0) {
      const sampleProducts: Omit<Product, "id" | "createdAt" | "updatedAt">[] =
        [
          {
            name: "Oli Mesin Castrol GTX",
            category: "Oli & Pelumas",
            price: "Rp 85.000",
            rating: 4.8,
            reviews: 124,
            image: "/placeholder.svg",
            description: "Oli mesin berkualitas tinggi untuk performa optimal",
            inStock: true,
            isPromo: true,
          },
          {
            name: "Ban Michelin Primacy 4",
            category: "Ban & Velg",
            price: "Rp 1.250.000",
            rating: 4.9,
            reviews: 87,
            image: "/placeholder.svg",
            description: "Ban premium dengan teknologi terdepan",
            inStock: true,
            isPromo: false,
          },
        ];
      sampleProducts.forEach((product) => this.createProduct(product));
    }

    if (this.getAllSponsors().length === 0) {
      const sampleSponsors: Omit<Sponsor, "id" | "createdAt" | "updatedAt">[] =
        [
          {
            name: "Castrol",
            logo: "https://via.placeholder.com/120x60/FF4500/FFFFFF?text=CASTROL",
            category: "Oil Partner",
            website: "https://castrol.com",
            description: "Premium motor oil and lubricants",
            isActive: true,
            order: 1,
          },
          {
            name: "Michelin",
            logo: "https://via.placeholder.com/120x60/0033A0/FFFFFF?text=MICHELIN",
            category: "Tire Partner",
            website: "https://michelin.com",
            description: "World-leading tire manufacturer",
            isActive: true,
            order: 2,
          },
          {
            name: "Bosch",
            logo: "https://via.placeholder.com/120x60/E30613/FFFFFF?text=BOSCH",
            category: "Parts Partner",
            website: "https://bosch.com",
            description: "Automotive parts and technology",
            isActive: true,
            order: 3,
          },
          {
            name: "Shell",
            logo: "https://via.placeholder.com/120x60/FFD700/000000?text=SHELL",
            category: "Oil Partner",
            website: "https://shell.com",
            description: "Global energy and petrochemicals company",
            isActive: true,
            order: 4,
          },
          {
            name: "Pirelli",
            logo: "https://via.placeholder.com/120x60/FFED00/000000?text=PIRELLI",
            category: "Tire Partner",
            website: "https://pirelli.com",
            description: "Premium tire manufacturer",
            isActive: true,
            order: 5,
          },
          {
            name: "NGK",
            logo: "https://via.placeholder.com/120x60/1E3A8A/FFFFFF?text=NGK",
            category: "Parts Partner",
            website: "https://ngk.com",
            description: "Spark plugs and automotive components",
            isActive: true,
            order: 6,
          },
          {
            name: "Total",
            logo: "https://via.placeholder.com/120x60/DC2626/FFFFFF?text=TOTAL",
            category: "Oil Partner",
            website: "https://total.com",
            description: "Multi-energy company",
            isActive: true,
            order: 7,
          },
          {
            name: "Continental",
            logo: "https://via.placeholder.com/120x60/0F172A/FFFFFF?text=CONTINENTAL",
            category: "Tire Partner",
            website: "https://continental.com",
            description: "Technology company for automotive industry",
            isActive: true,
            order: 8,
          },
        ];
      sampleSponsors.forEach((sponsor) => this.createSponsor(sponsor));
    }
  }
}

export const db = new DatabaseService();

// Initialize sample data on first load
if (typeof window !== "undefined") {
  db.initializeSampleData();
}
