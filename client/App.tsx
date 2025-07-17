import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Promo from "./pages/Promo";
import PromoDetail from "./pages/PromoDetail";
import Artikel from "./pages/Artikel";
import ArticleDetail from "./pages/ArticleDetail";
import Produk from "./pages/Produk";
import ProductDetail from "./pages/ProductDetail";
import Kontak from "./pages/Kontak";
import SearchResults from "./pages/SearchResults";
import { AdminProvider } from "./contexts/AdminContext";
import GoogleOAuthProvider from "./components/GoogleOAuthProvider";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PromoManagement from "./pages/admin/PromoManagement";
import ArticleManagement from "./pages/admin/ArticleManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import SponsorManagement from "./pages/admin/SponsorManagement";
import CommentManagement from "./components/admin/CommentManagement";
import Settings from "./pages/admin/Settings";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GoogleOAuthProvider>
        <AdminProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="/promo/:id" element={<PromoDetail />} />
              <Route path="/artikel" element={<Artikel />} />
              <Route path="/artikel/:id" element={<ArticleDetail />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/produk/:id" element={<ProductDetail />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="/search" element={<SearchResults />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/promo"
                element={
                  <AdminLayout>
                    <PromoManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/artikel"
                element={
                  <AdminLayout>
                    <ArticleManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/produk"
                element={
                  <AdminLayout>
                    <ProductManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/sponsor"
                element={
                  <AdminLayout>
                    <SponsorManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/komentar"
                element={
                  <AdminLayout>
                    <CommentManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
