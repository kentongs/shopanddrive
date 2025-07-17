// Production API service using Supabase directly
import { createClient } from "@supabase/supabase-js";
import type {
  Promo,
  Article,
  Product,
  Sponsor,
  Comment,
  Settings,
} from "./api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class ProductionApiService {
  // Promo operations
  async getAllPromos(): Promise<Promo[]> {
    const { data, error } = await supabase
      .from("promos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getActivePromos(): Promise<Promo[]> {
    const { data, error } = await supabase
      .from("promos")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchPromos(query: string): Promise<Promo[]> {
    const { data, error } = await supabase
      .from("promos")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Article operations
  async getAllArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPublishedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchArticles(query: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%,author.ilike.%${query}%`,
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getInStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`,
      )
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Sponsor operations
  async getAllSponsors(): Promise<Sponsor[]> {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getActiveSponsors(): Promise<Sponsor[]> {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Comment operations
  async getCommentsByContent(
    contentId: string,
    contentType: string,
  ): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("content_id", contentId)
      .eq("content_type", contentType)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createComment(
    commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          content_id: commentData.contentId,
          content_type: commentData.contentType,
          author_name: commentData.authorName,
          author_email: commentData.authorEmail,
          author_avatar: commentData.authorAvatar,
          is_google_auth: commentData.isGoogleAuth,
          google_user_id: commentData.googleUserId,
          content: commentData.content,
          parent_id: commentData.parentId,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Settings operations
  async getSettings(): Promise<Settings> {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Return default settings if none exist
      return {
        siteName: "Shop and Drive Taman Tekno",
        siteDescription: "Solusi terpercaya untuk kebutuhan otomotif Anda",
        logo: "/placeholder.svg",
        contactPhone: "08995555095",
        contactEmail: "info@shopanddrive.com",
        address: "Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan",
        socialMedia: {
          whatsapp: "628995555095",
          facebook: "",
          instagram: "",
        },
      };
    }

    return {
      siteName: data.site_name,
      siteDescription: data.site_description,
      logo: data.logo,
      contactPhone: data.contact_phone,
      contactEmail: data.contact_email,
      address: data.address,
      socialMedia: {
        whatsapp: data.social_whatsapp,
        facebook: data.social_facebook || "",
        instagram: data.social_instagram || "",
      },
    };
  }

  // Search operations
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

  // Admin operations (requires service key - to be handled by backend)
  async createPromo(
    data: Omit<Promo, "id" | "createdAt" | "updatedAt">,
  ): Promise<Promo> {
    throw new Error("Admin operations must be performed through backend API");
  }

  async updatePromo(id: string, data: Partial<Promo>): Promise<Promo | null> {
    throw new Error("Admin operations must be performed through backend API");
  }

  async deletePromo(id: string): Promise<boolean> {
    throw new Error("Admin operations must be performed through backend API");
  }

  // Similar for other admin operations...
  async createSponsor(data: any): Promise<Sponsor> {
    throw new Error("Admin operations must be performed through backend API");
  }

  async updateSponsor(id: string, data: any): Promise<Sponsor | null> {
    throw new Error("Admin operations must be performed through backend API");
  }

  async deleteSponsor(id: string): Promise<boolean> {
    throw new Error("Admin operations must be performed through backend API");
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    throw new Error("Admin operations must be performed through backend API");
  }
}

export const productionApiService = new ProductionApiService();
