import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { db } from "@/services/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ArrowRight,
  Calendar,
  Tag,
  MapPin,
  Users,
  Wrench,
  Shield,
  Zap,
  Car,
  Package,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Phone,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Target,
  Heart,
  Building2,
  Globe,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import HeroSearch from "@/components/HeroSearch";

const features = [
  {
    icon: Wrench,
    title: "Service Profesional",
    description: "Teknisi berpengalaman dan peralatan modern",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Produk Original",
    description: "Jaminan keaslian semua produk yang dijual",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Pelayanan Cepat",
    description: "Proses cepat dan efisien untuk semua layanan",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Customer Support",
    description: "Tim support siap membantu 24/7",
    gradient: "from-purple-500 to-pink-500",
  },
];

const testimonials = [
  {
    name: "John Doe",
    role: "Pemilik Toyota Avanza",
    rating: 5,
    comment:
      "Pelayanan sangat memuaskan, staff ramah dan profesional! Sudah 3 tahun jadi customer setia.",
    date: "2 hari yang lalu",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
  },
  {
    name: "Maria Sari",
    role: "Pemilik Honda Jazz",
    rating: 5,
    comment:
      "Harga terjangkau, kualitas terjamin. Recommended banget! Ganti oli rutin disini.",
    date: "1 minggu yang lalu",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
  },
  {
    name: "Budi Hartono",
    role: "Pemilik Mitsubishi Pajero",
    rating: 4,
    comment:
      "Tempat service terpercaya, sudah langganan bertahun-tahun. Teknisinya berpengalaman.",
    date: "2 minggu yang lalu",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
  },
  {
    name: "Siti Nurhaliza",
    role: "Pemilik Nissan X-Trail",
    rating: 5,
    comment:
      "Promo sering, pelayanan cepat. Puas banget sama hasilnya, mobil jadi seperti baru!",
    date: "3 minggu yang lalu",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=50&h=50&fit=crop&crop=face",
  },
];

export default function Index() {
  useVisitorTracking(); // Track page visits

  const [promos, setPromos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSponsor, setCurrentSponsor] = useState(0);

  useEffect(() => {
    // Load data from database
    const allPromos = db
      .getAllPromos()
      .filter((promo) => promo.status === "active")
      .slice(0, 6);
    const allArticles = db
      .getAllArticles()
      .filter((article) => article.status === "published")
      .slice(0, 6);
    const allProducts = db
      .getAllProducts()
      .filter((product) => product.inStock)
      .slice(0, 8);
    const allSponsors = db.getActiveSponsors();

    setPromos(allPromos);
    setArticles(allArticles);
    setProducts(allProducts);
    setSponsors(allSponsors);
  }, []);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll sponsors like testimonials
  useEffect(() => {
    if (sponsors.length <= 1) return; // Don't auto-scroll if only one sponsor

    const timer = setInterval(() => {
      setCurrentSponsor((prev) => {
        return prev === sponsors.length - 1 ? 0 : prev + 1;
      });
    }, 5000); // Slower for full-size display
    return () => clearInterval(timer);
  }, [sponsors.length]);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  // Track scroll position for progress indicator
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-automotive-blue-dark to-automotive-blue text-white overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          {/* Dynamic Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-automotive-orange/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "8s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-automotive-blue/5 to-transparent rounded-full"></div>

          {/* Modern Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30"></div>

          {/* Floating Elements */}
          <div className="absolute top-32 right-20 opacity-10 animate-float">
            <Car className="h-40 w-40 text-automotive-orange" />
          </div>
          <div className="absolute bottom-32 left-20 opacity-5 animate-float-delayed">
            <Wrench className="h-32 w-32 text-white" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-automotive-orange/20 to-red-500/20 border border-automotive-orange/30 text-automotive-orange px-8 py-4 rounded-full text-sm font-bold mb-12 backdrop-blur-md shadow-2xl">
              <Award className="h-5 w-5" />
              <span>Automotive Excellence Since 2009</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>

            {/* Hero Title - Ultra Dynamic */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 leading-tight">
              <span className="block opacity-90">DRIVE</span>
              <span className="block bg-gradient-to-r from-automotive-orange via-yellow-400 to-red-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                BEYOND
              </span>
              <span className="block opacity-90">LIMITS</span>
            </h1>

            {/* Subtitle with Animation */}
            <p className="text-xl md:text-3xl mb-16 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolusi pengalaman otomotif Anda dengan teknologi terdepan,
              <span className="text-automotive-orange font-bold animate-pulse">
                {" "}
                service premium
              </span>
              , dan
              <span className="text-automotive-orange font-bold animate-pulse">
                {" "}
                spare part original
              </span>
            </p>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {[
                { value: "15+", label: "Tahun Pengalaman", icon: Clock },
                { value: "5000+", label: "Pelanggan Puas", icon: Heart },
                { value: "24/7", label: "Customer Support", icon: Phone },
                { value: "100%", label: "Parts Original", icon: CheckCircle },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/10">
                    <stat.icon className="h-8 w-8 text-automotive-orange mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="text-4xl md:text-5xl font-bold text-automotive-orange mb-2 animate-counter">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Search - Enhanced */}
            <div className="mb-16">
              <HeroSearch />
            </div>

            {/* CTA Buttons - Ultra Modern */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-automotive-orange via-red-500 to-pink-500 hover:from-automotive-orange/90 hover:via-red-500/90 hover:to-pink-500/90 text-white font-bold px-12 py-6 rounded-full shadow-2xl hover:shadow-automotive-orange/50 transition-all duration-500 group text-xl relative overflow-hidden"
              >
                <Link to="/produk">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Package className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Jelajahi Produk
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md font-bold px-12 py-6 rounded-full transition-all duration-500 group text-xl hover:scale-105"
              >
                <a
                  href="https://wa.me/628995555095?text=Halo%20admin,%20saya%20butuh%20konsultasi%20otomotif%20🚗"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  Konsultasi Expert
                </a>
              </Button>
            </div>

            {/* Trust Indicators - Enhanced */}
            <div className="pt-12 border-t border-white/20">
              <p className="text-sm text-gray-400 mb-8 font-medium">
                Dipercaya Oleh Ribuan Customer
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                {[
                  { icon: Shield, text: "Garansi Resmi" },
                  { icon: Award, text: "Teknisi Bersertifikat" },
                  { icon: Target, text: "Precision Tools" },
                  { icon: TrendingUp, text: "Best Performance" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-300"
                  >
                    <item.icon className="h-6 w-6 text-automotive-orange" />
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
              <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-white/60 font-medium">
              Scroll untuk melihat lebih banyak
            </span>
          </div>
        </div>
      </section>

      {/* Quick Search Promotion Section */}
      <section className="py-16 bg-gradient-to-r from-automotive-blue/5 via-white to-automotive-orange/5 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-automotive-blue/10 text-automotive-blue px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Search className="h-4 w-4" />
              <span>Pencarian Cepat</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cari Apa yang Anda Butuhkan
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Temukan promo, artikel, dan produk otomotif terbaik dengan mudah
            </p>

            {/* Popular Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                "Oli Mesin Premium",
                "Ban Michelin",
                "Service Berkala",
                "Tips Perawatan",
                "Promo Bulanan",
                "Spare Part Original",
              ].map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-white hover:bg-automotive-blue hover:text-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Tag className="h-3 w-3 inline mr-2" />
                  {tag}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-automotive-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-automotive-blue" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Promo Eksklusif
                </h3>
                <p className="text-gray-600 text-sm">
                  Dapatkan penawaran khusus dan diskon menarik
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-automotive-orange/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-automotive-orange" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tips & Panduan</h3>
                <p className="text-gray-600 text-sm">
                  Artikel ahli untuk perawatan kendaraan optimal
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Produk Berkualitas
                </h3>
                <p className="text-gray-600 text-sm">
                  Spare part dan aksesoris original terpercaya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Promo Section with Carousel - Moved to top */}
      <section className="py-24 bg-gradient-to-br from-automotive-blue via-automotive-blue-dark to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-automotive-orange/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-automotive-orange/20 text-automotive-orange border-automotive-orange/30 mb-4">
              🔥 Hot Deals
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Promo <span className="text-automotive-orange">Spektakuler</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dapatkan penawaran terbaik untuk kebutuhan otomotif Anda dengan
              harga yang tidak akan Anda temukan di tempat lain
            </p>
          </div>

          {promos.length > 0 ? (
            <div className="relative mb-12">
              {/* Horizontal Scrolling Carousel */}
              <div className="overflow-x-auto scrollbar-hide">
                <div
                  className="flex gap-6 pb-4"
                  style={{ width: "max-content" }}
                >
                  {promos.map((promo, index) => (
                    <Card
                      key={promo.id}
                      className="group bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-500 overflow-hidden hover:scale-105 hover:shadow-2xl flex-shrink-0 w-80"
                      style={{ minWidth: "320px" }}
                    >
                      <div className="relative">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-automotive-orange to-red-500 text-white border-0 font-bold text-lg px-4 py-2 shadow-lg animate-pulse">
                            {promo.discount}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <Sparkles className="h-5 w-5 text-automotive-orange animate-spin" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Floating Price Badge */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                          <div className="bg-automotive-orange/90 backdrop-blur-sm rounded-xl px-3 py-2 text-white font-bold text-lg shadow-xl">
                            {promo.discountPrice}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-automotive-orange transition-colors duration-300 line-clamp-2">
                          {promo.title}
                        </h3>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-2">
                          {promo.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-automotive-orange">
                              {promo.discountPrice}
                            </span>
                            {promo.originalPrice && (
                              <span className="ml-2 text-gray-400 line-through text-sm">
                                {promo.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              HOT DEAL
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          Valid sampai{" "}
                          {new Date(promo.validUntil).toLocaleDateString(
                            "id-ID",
                          )}
                        </div>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-automotive-orange via-red-500 to-pink-500 hover:from-automotive-orange/90 hover:via-red-500/90 hover:to-pink-500/90 text-white font-bold border-0 relative overflow-hidden group/btn"
                        >
                          <Link to={`/promo/${promo.id}`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            <Tag className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                            Ambil Promo
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* End Gradient Fade */}
                  <div className="flex-shrink-0 w-8 bg-gradient-to-l from-transparent to-automotive-blue-dark opacity-50"></div>
                </div>
              </div>

              {/* Scroll Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                <div className="text-xs text-gray-400 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  ← Geser untuk melihat lebih banyak promo →
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Tag className="h-16 w-16 text-automotive-orange mx-auto mb-4 opacity-50" />
              <p className="text-xl text-gray-400">
                Promo menarik akan segera hadir!
              </p>
            </div>
          )}

          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-8 py-4"
            >
              <Link to="/promo">
                Lihat Semua Promo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-automotive-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-automotive-orange/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-automotive-orange/10 text-automotive-orange border-automotive-orange/20 mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Keunggulan{" "}
              <span className="bg-gradient-to-r from-automotive-blue to-automotive-orange bg-clip-text text-transparent">
                Layanan
              </span>{" "}
              Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Pengalaman bertahun-tahun dan teknologi terdepan memberikan solusi
              otomotif terbaik untuk kendaraan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-12 w-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-automotive-blue transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-automotive-blue/10 text-automotive-blue border-automotive-blue/20 mb-4">
              Premium Products
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Produk <span className="text-automotive-blue">Berkualitas</span>{" "}
              Tinggi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Koleksi lengkap spare part dan aksesoris otomotif dari brand
              terpercaya untuk performa maksimal kendaraan Anda
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.isPromo && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                        Promo
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-automotive-blue transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-automotive-blue">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-gray-400 line-through text-sm">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.inStock && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Ready Stock
                        </Badge>
                      )}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-automotive-blue hover:bg-automotive-blue-dark text-white"
                    >
                      <Link to={`/produk/${product.id}`}>
                        <Package className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                Produk akan segera ditambahkan!
              </p>
            </div>
          )}

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-automotive-blue hover:bg-automotive-blue-dark text-white font-bold px-8 py-4"
            >
              <Link to="/produk">
                Jelajahi Semua Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Carousel */}
      <section className="py-24 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-automotive-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-automotive-orange/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-automotive-orange/10 text-automotive-orange border-automotive-orange/20 mb-4">
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Apa Kata <span className="text-automotive-orange">Pelanggan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ribuan pelanggan telah merasakan pengalaman luar biasa dengan
              layanan dan produk berkualitas kami
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                      <CardContent className="p-12 text-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-full mx-auto mb-6 ring-4 ring-automotive-blue/20"
                        />
                        <div className="flex justify-center mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                          "{testimonial.comment}"
                        </blockquote>
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-automotive-blue font-medium mb-2">
                            {testimonial.role}
                          </p>
                          <p className="text-sm text-gray-500">
                            {testimonial.date}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-automotive-blue hover:bg-white transition-all duration-300 group"
            >
              <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-automotive-blue hover:bg-white transition-all duration-300 group"
            >
              <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "bg-automotive-blue shadow-lg scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Articles Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-automotive-blue/10 text-automotive-blue border-automotive-blue/20 mb-4">
              Expert Knowledge
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Tips & <span className="text-automotive-blue">Panduan</span>{" "}
              Otomotif
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan wawasan mendalam dari para ahli untuk merawat dan
              mengoptimalkan performa kendaraan Anda
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article, index) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-3 left-3 bg-automotive-blue/90 text-white border-0">
                      {article.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
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
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                Artikel menarik akan segera hadir!
              </p>
            </div>
          )}

          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-automotive-blue text-automotive-blue hover:bg-automotive-blue hover:text-white font-bold px-8 py-4"
            >
              <Link to="/artikel">
                Baca Semua Artikel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Sponsor Section - Moved to bottom */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-automotive-blue/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-automotive-orange/10 to-yellow-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_2px,transparent_2px),linear-gradient(90deg,rgba(59,130,246,0.02)_2px,transparent_2px)] bg-[size:80px_80px] opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-automotive-blue/10 to-automotive-orange/10 border border-automotive-blue/20 text-automotive-blue px-6 py-3 rounded-full text-sm font-bold mb-6 backdrop-blur-sm shadow-lg">
              <Award className="h-5 w-5" />
              <span>Global Automotive Partners</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block">Didukung oleh</span>
              <span className="bg-gradient-to-r from-automotive-blue via-automotive-orange to-red-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                Brand Terbaik
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kami bermitra dengan{" "}
              <span className="font-bold text-automotive-blue">
                merek-merek otomotif terkemuka dunia
              </span>{" "}
              untuk memberikan produk dan layanan berkualitas premium
            </p>
          </div>

          {/* Enhanced Sponsor Showcase */}
          <div className="relative mb-12">
            {sponsors.length === 0 ? (
              /* No Sponsors Fallback */
              <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl border border-white/20 shadow-2xl p-16 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  Partner Sedang Dimuat
                </h3>
                <p className="text-gray-500">
                  Menampilkan partner terpercaya kami...
                </p>
              </div>
            ) : (
              /* Main Sponsor Display - Smooth Carousel like Testimonials */
              <div className="relative max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-white/95 to-white/80 backdrop-blur-xl border border-white/30 shadow-2xl">
                  <div
                    className="flex transition-transform duration-700 ease-in-out py-12"
                    style={{
                      transform: `translateX(-${currentSponsor * 100}%)`, // Show 1 sponsor at a time
                    }}
                  >
                    {sponsors.map((sponsor, index) => (
                      <div
                        key={sponsor.id || index}
                        className="w-full flex-shrink-0 px-8"
                      >
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/80 hover:from-white hover:to-automotive-blue/5 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-automotive-blue/0 via-automotive-blue/5 to-automotive-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          <CardContent className="p-16 text-center relative z-10">
                            {/* Large Logo Container */}
                            <div className="relative mb-10">
                              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-[2rem] p-16 group-hover:from-automotive-blue/10 group-hover:via-white group-hover:to-automotive-orange/10 transition-all duration-500 shadow-2xl border border-gray-100/50">
                                {/* Premium Badge */}
                                <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-0">
                                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-xl">
                                    ✓ Premium Partner
                                  </div>
                                </div>

                                <img
                                  src={sponsor.logo}
                                  alt={sponsor.name}
                                  className="h-32 w-auto mx-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 drop-shadow-2xl"
                                  style={{ maxWidth: "280px" }}
                                />

                                {/* Logo Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-automotive-blue/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>

                              {/* Animated Ring */}
                              <div className="absolute inset-0 rounded-[2rem] border-4 border-transparent group-hover:border-automotive-blue/30 transition-all duration-500 group-hover:scale-105"></div>
                            </div>

                            <h3 className="font-black text-gray-900 mb-4 text-3xl group-hover:text-automotive-blue transition-colors duration-300">
                              {sponsor.name}
                            </h3>

                            <Badge
                              variant="outline"
                              className="text-lg px-6 py-2 group-hover:border-automotive-blue group-hover:text-automotive-blue transition-all duration-300 bg-white/70 mb-6 font-bold"
                            >
                              {sponsor.category}
                            </Badge>

                            {/* Always Visible Description for Full Size */}
                            <div className="mt-6">
                              <p className="text-lg text-gray-600 leading-relaxed mb-4 max-w-2xl mx-auto">
                                {sponsor.description ||
                                  "Premium automotive partner providing high-quality products and exceptional service"}
                              </p>
                              {sponsor.website && (
                                <div className="mt-6">
                                  <a
                                    href={sponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-automotive-blue hover:text-automotive-orange transition-colors duration-200 text-lg font-semibold bg-white/50 px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
                                  >
                                    <Globe className="h-5 w-5 mr-2" />
                                    Visit Official Website
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={() => {
                    setCurrentSponsor((prev) =>
                      prev === 0 ? sponsors.length - 1 : prev - 1,
                    );
                  }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center text-gray-600 hover:text-automotive-blue transition-all duration-300 group hover:scale-110 z-10"
                >
                  <ChevronLeft className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
                </button>

                <button
                  onClick={() => {
                    setCurrentSponsor((prev) =>
                      prev === sponsors.length - 1 ? 0 : prev + 1,
                    );
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center text-gray-600 hover:text-automotive-blue transition-all duration-300 group hover:scale-110 z-10"
                >
                  <ChevronRight className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                  {sponsors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSponsor(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSponsor === index
                          ? "bg-automotive-blue shadow-lg scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Partner Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-automotive-blue mb-2">
                {sponsors.length}+
              </div>
              <div className="text-sm text-gray-600">Global Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-automotive-orange mb-2">
                {sponsors.length > 0
                  ? new Set(sponsors.map((s) => s.category)).size
                  : 0}
                +
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                15+
              </div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">Quality Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-gradient-to-br from-automotive-blue via-automotive-blue-dark to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-automotive-orange/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-automotive-orange/20 text-automotive-orange border-automotive-orange/30 mb-6">
            Ready to Get Started?
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Siap Memberikan Kendaraan Anda
            <span className="block text-automotive-orange">
              Perawatan Terbaik?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Tim ahli kami siap membantu Anda dengan konsultasi gratis dan solusi
            otomotif terpersonalisasi
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-automotive-orange to-red-500 hover:from-automotive-orange/90 hover:to-red-500/90 text-white font-bold px-12 py-6 rounded-full shadow-2xl text-xl"
            >
              <a
                href="https://wa.me/628995555095?text=Halo%20admin,%20saya%20ingin%20konsultasi%20tentang%20perawatan%20kendaraan%20🚗"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Chat WhatsApp
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-12 py-6 rounded-full text-xl"
            >
              <Link to="/kontak">
                <MapPin className="mr-3 h-6 w-6" />
                Kunjungi Toko
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Konsultasi Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Respon Cepat 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Expert Advice</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
