import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Package,
  Tag,
  FileText,
  TrendingUp,
  Calendar,
  Eye,
  Activity,
  Globe,
  MousePointer,
  Zap,
  MessageCircle,
  Bell,
  Clock,
  Building2,
} from "lucide-react";
import { analyticsService, type AnalyticsData } from "@/services/analytics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { db } from "@/services/database";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    // Initial load
    const initialData = analyticsService.getAnalyticsData();
    setAnalytics(initialData);

    // Subscribe to real-time updates
    const unsubscribe = analyticsService.subscribe((data) => {
      if (isRealTime) {
        setAnalytics(data);
      }
    });

    return unsubscribe;
  }, [isRealTime]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automotive-blue"></div>
      </div>
    );
  }

  // Get comment statistics
  const pendingComments = db.getPendingComments().length;
  const unreadNotifications = db.getUnreadNotificationsCount();
  const totalComments = db.getAllComments().length;

  // Get sponsor statistics
  const totalSponsors = db.getAllSponsors().length;
  const activeSponsors = db.getActiveSponsors().length;

  const stats = [
    {
      title: "Pengunjung Hari Ini",
      value: analytics.visitors.today.toString(),
      change: `Total: ${analytics.visitors.total.toLocaleString()}`,
      icon: Users,
      color: "text-blue-600",
      trend: "+12%",
    },
    {
      title: "Halaman Dilihat",
      value: analytics.pageViews.today.toString(),
      change: `Unik: ${analytics.pageViews.unique.toLocaleString()}`,
      icon: Eye,
      color: "text-green-600",
      trend: "+8%",
    },
    {
      title: "Komentar Pending",
      value: pendingComments.toString(),
      change: `Total: ${totalComments} komentar`,
      icon: MessageCircle,
      color: "text-yellow-600",
      trend: pendingComments > 0 ? "Perlu perhatian" : "Terkendali",
      isAlert: pendingComments > 0,
    },
    {
      title: "Total Sponsor",
      value: totalSponsors.toString(),
      change: `${activeSponsors} aktif`,
      icon: Building2,
      color: "text-purple-600",
      trend:
        activeSponsors === totalSponsors
          ? "Semua aktif"
          : `${totalSponsors - activeSponsors} nonaktif`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan aktivitas dan statistik website Shop and Drive
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Real-time</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Update terakhir: {new Date().toLocaleTimeString("id-ID")}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                    {stat.trend && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${stat.color}`}
                      >
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                    stat.color.includes("blue")
                      ? "from-blue-50 to-blue-100"
                      : stat.color.includes("green")
                        ? "from-green-50 to-green-100"
                        : stat.color.includes("orange")
                          ? "from-orange-50 to-orange-100"
                          : "from-purple-50 to-purple-100"
                  }`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts data={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {analytics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.type === "visitor" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {activity.type === "visitor" ? "Pengunjung" : "Konten"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comment Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi Komentar
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {db.getRecentNotifications(5).length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada notifikasi komentar
                  </p>
                </div>
              ) : (
                db.getRecentNotifications(5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.isRead
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        Baru
                      </Badge>
                    )}
                  </div>
                ))
              )}

              {db.getRecentNotifications(5).length > 0 && (
                <div className="pt-3 border-t mt-4">
                  <Link
                    to="/admin/komentar"
                    className="text-sm text-automotive-blue hover:underline flex items-center gap-1"
                  >
                    Kelola semua komentar
                    <MessageCircle className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Halaman Populer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-automotive-blue rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.views} pengunjung
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {page.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <Tag className="h-8 w-8 mx-auto mb-2 text-automotive-blue" />
              <p className="font-medium">Tambah Promo Baru</p>
              <p className="text-sm text-muted-foreground">
                Buat penawaran spesial
              </p>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <FileText className="h-8 w-8 mx-auto mb-2 text-automotive-blue" />
              <p className="font-medium">Tulis Artikel</p>
              <p className="text-sm text-muted-foreground">
                Bagikan tips otomotif
              </p>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <Package className="h-8 w-8 mx-auto mb-2 text-automotive-blue" />
              <p className="font-medium">Tambah Produk</p>
              <p className="text-sm text-muted-foreground">
                Katalog produk baru
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
