import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Tag,
  FileText,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Building2,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import Logo from "@/components/Logo";
import { db } from "@/services/database";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Promo", href: "/admin/promo", icon: Tag },
  { name: "Artikel", href: "/admin/artikel", icon: FileText },
  { name: "Produk", href: "/admin/produk", icon: Package },
  { name: "Sponsor", href: "/admin/sponsor", icon: Building2 },
  { name: "Komentar", href: "/admin/komentar", icon: MessageCircle },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAuthenticated } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadComments, setUnreadComments] = useState(0);

  useEffect(() => {
    // Update unread comments count
    const updateUnreadCount = () => {
      const count = db.getUnreadCommentsCount();
      setUnreadComments(count);
    };

    // Initial load
    updateUnreadCount();

    // Poll for updates every 5 seconds
    const interval = setInterval(updateUnreadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Logo />
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-automotive-blue text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.name === "Komentar" && unreadComments > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto text-xs h-5 w-5 flex items-center justify-center p-0"
                    >
                      {unreadComments > 99 ? "99+" : unreadComments}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <Card className="p-3 mb-3">
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </Card>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="text-sm text-muted-foreground">
            Selamat datang, {user?.username}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
