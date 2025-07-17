import { db } from "./database";

export interface VisitorData {
  timestamp: string;
  page: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
}

export interface AnalyticsData {
  visitors: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  pageViews: {
    total: number;
    today: number;
    unique: number;
  };
  content: {
    totalPromos: number;
    totalArticles: number;
    totalProducts: number;
    activePromos: number;
    publishedArticles: number;
    inStockProducts: number;
  };
  chartData: {
    daily: Array<{ date: string; visitors: number; pageViews: number }>;
    weekly: Array<{ week: string; visitors: number; pageViews: number }>;
    monthly: Array<{ month: string; visitors: number; pageViews: number }>;
    yearly: Array<{ year: string; visitors: number; pageViews: number }>;
  };
  topPages: Array<{ page: string; views: number; percentage: number }>;
  recentActivity: Array<{
    type: string;
    title: string;
    timestamp: string;
    action: string;
  }>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private listeners: Array<(data: AnalyticsData) => void> = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeStorage();
    this.trackPageView();
  }

  private generateSessionId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private initializeStorage(): void {
    if (!localStorage.getItem("shop_drive_visitors")) {
      localStorage.setItem("shop_drive_visitors", JSON.stringify([]));
    }
    if (!localStorage.getItem("shop_drive_analytics_last_update")) {
      localStorage.setItem(
        "shop_drive_analytics_last_update",
        Date.now().toString(),
      );
    }
  }

  trackPageView(page?: string): void {
    const currentPage = page || window.location.pathname;
    const visitorData: VisitorData = {
      timestamp: new Date().toISOString(),
      page: currentPage,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: this.sessionId,
    };

    const visitors = this.getVisitors();
    visitors.push(visitorData);

    // Keep only last 1000 entries for performance
    if (visitors.length > 1000) {
      visitors.splice(0, visitors.length - 1000);
    }

    localStorage.setItem("shop_drive_visitors", JSON.stringify(visitors));
    localStorage.setItem(
      "shop_drive_analytics_last_update",
      Date.now().toString(),
    );

    // Notify listeners
    this.notifyListeners();
  }

  private getVisitors(): VisitorData[] {
    const data = localStorage.getItem("shop_drive_visitors");
    return data ? JSON.parse(data) : [];
  }

  private generateMockData(): VisitorData[] {
    const mockData: VisitorData[] = [];
    const now = new Date();

    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate random visitors for each day (more realistic pattern)
      const baseVisitors = 50 + Math.floor(Math.random() * 100);
      const dailyVisitors = Math.max(
        10,
        baseVisitors + (Math.random() - 0.5) * 40,
      );

      for (let j = 0; j < dailyVisitors; j++) {
        const visitTime = new Date(date);
        visitTime.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60),
        );

        mockData.push({
          timestamp: visitTime.toISOString(),
          page: ["/", "/produk", "/artikel", "/promo", "/kontak"][
            Math.floor(Math.random() * 5)
          ],
          userAgent: "Mock User Agent",
          referrer: "",
          sessionId: `mock-${i}-${j}`,
        });
      }
    }

    return mockData;
  }

  getAnalyticsData(): AnalyticsData {
    let visitors = this.getVisitors();

    // If no real data, use mock data for demonstration
    if (visitors.length < 10) {
      visitors = this.generateMockData();
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate visitor stats
    const todayVisitors = visitors.filter(
      (v) => new Date(v.timestamp) >= today,
    ).length;
    const weekVisitors = visitors.filter(
      (v) => new Date(v.timestamp) >= thisWeek,
    ).length;
    const monthVisitors = visitors.filter(
      (v) => new Date(v.timestamp) >= thisMonth,
    ).length;
    const uniqueVisitors = new Set(visitors.map((v) => v.sessionId)).size;

    // Get content stats from database
    const allPromos = db.getAllPromos();
    const allArticles = db.getAllArticles();
    const allProducts = db.getAllProducts();

    // Generate chart data
    const chartData = this.generateChartData(visitors);

    // Top pages
    const pageViews: { [key: string]: number } = {};
    visitors.forEach((v) => {
      pageViews[v.page] = (pageViews[v.page] || 0) + 1;
    });

    const topPages = Object.entries(pageViews)
      .map(([page, views]) => ({
        page: this.getPageDisplayName(page),
        views,
        percentage: Math.round((views / visitors.length) * 100),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Recent activity (mock data based on CRUD operations)
    const recentActivity = this.generateRecentActivity();

    return {
      visitors: {
        total: visitors.length,
        today: todayVisitors,
        thisWeek: weekVisitors,
        thisMonth: monthVisitors,
      },
      pageViews: {
        total: visitors.length,
        today: todayVisitors,
        unique: uniqueVisitors,
      },
      content: {
        totalPromos: allPromos.length,
        totalArticles: allArticles.length,
        totalProducts: allProducts.length,
        activePromos: allPromos.filter((p) => p.status === "active").length,
        publishedArticles: allArticles.filter((a) => a.status === "published")
          .length,
        inStockProducts: allProducts.filter((p) => p.inStock).length,
      },
      chartData,
      topPages,
      recentActivity,
    };
  }

  private generateChartData(visitors: VisitorData[]) {
    const now = new Date();

    // Daily data (last 7 days)
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayVisitors = visitors.filter((v) =>
        v.timestamp.startsWith(dateStr),
      );

      daily.push({
        date: date.toLocaleDateString("id-ID", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        visitors: new Set(dayVisitors.map((v) => v.sessionId)).size,
        pageViews: dayVisitors.length,
      });
    }

    // Weekly data (last 4 weeks)
    const weekly = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekVisitors = visitors.filter((v) => {
        const vDate = new Date(v.timestamp);
        return vDate >= weekStart && vDate <= weekEnd;
      });

      weekly.push({
        week: `Week ${4 - i}`,
        visitors: new Set(weekVisitors.map((v) => v.sessionId)).size,
        pageViews: weekVisitors.length,
      });
    }

    // Monthly data (last 6 months)
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthVisitors = visitors.filter((v) => {
        const vDate = new Date(v.timestamp);
        return vDate >= month && vDate < nextMonth;
      });

      monthly.push({
        month: month.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        visitors: new Set(monthVisitors.map((v) => v.sessionId)).size,
        pageViews: monthVisitors.length,
      });
    }

    // Yearly data (last 2 years)
    const yearly = [];
    for (let i = 1; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year + 1, 0, 1);

      const yearVisitors = visitors.filter((v) => {
        const vDate = new Date(v.timestamp);
        return vDate >= yearStart && vDate < yearEnd;
      });

      yearly.push({
        year: year.toString(),
        visitors: new Set(yearVisitors.map((v) => v.sessionId)).size,
        pageViews: yearVisitors.length,
      });
    }

    return { daily, weekly, monthly, yearly };
  }

  private getPageDisplayName(path: string): string {
    const pageNames: { [key: string]: string } = {
      "/": "Beranda",
      "/promo": "Promo",
      "/artikel": "Artikel",
      "/produk": "Produk",
      "/kontak": "Kontak",
    };
    return pageNames[path] || path;
  }

  private generateRecentActivity() {
    const activities = [];
    const now = new Date();

    // Add some mock recent activities
    const mockActivities = [
      {
        type: "visitor",
        title: "Pengunjung baru mengakses halaman produk",
        action: "page_view",
        hours: 0.5,
      },
      {
        type: "content",
        title: 'Promo "Oli Mobil Premium" dilihat 15 kali',
        action: "view",
        hours: 1,
      },
      {
        type: "visitor",
        title: "5 pengunjung baru dalam 10 menit terakhir",
        action: "visit",
        hours: 2,
      },
      {
        type: "content",
        title: 'Artikel "Tips Merawat Mesin" dibaca habis',
        action: "read",
        hours: 3,
      },
      {
        type: "visitor",
        title: "Pengunjung dari Jakarta mengakses halaman kontak",
        action: "contact",
        hours: 4,
      },
    ];

    mockActivities.forEach((activity) => {
      const timestamp = new Date(
        now.getTime() - activity.hours * 60 * 60 * 1000,
      );
      activities.push({
        type: activity.type,
        title: activity.title,
        timestamp: timestamp.toISOString(),
        action: activity.action,
      });
    });

    return activities;
  }

  subscribe(callback: (data: AnalyticsData) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const data = this.getAnalyticsData();
    this.listeners.forEach((callback) => callback(data));
  }

  // Simulate real-time updates
  startRealTimeUpdates(): void {
    setInterval(() => {
      // Simulate occasional new visitors
      if (Math.random() < 0.3) {
        // 30% chance every 10 seconds
        this.trackPageView();
      }
    }, 10000); // Every 10 seconds
  }
}

export const analyticsService = AnalyticsService.getInstance();

// Start tracking immediately
if (typeof window !== "undefined") {
  analyticsService.startRealTimeUpdates();
}
