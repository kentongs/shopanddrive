import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialShare from "@/components/SocialShare";
import { db, type Product } from "@/services/database";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const productData = db.getProductById(id);
      setProduct(productData);
      setIsLoading(false);
    }
  }, [id]);

  const whatsappUrl = product
    ? `https://wa.me/628995555095?text=Halo%20admin,%20saya%20tertarik%20dengan%20produk%20${product.name}%20dengan%20harga%20${product.price}%20🙏`
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automotive-blue"></div>
          </div>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Produk yang Anda cari tidak ditemukan atau sudah tidak tersedia.
            </p>
            <Button onClick={() => navigate("/produk")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Produk
            </Button>
          </div>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/produk")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Produk
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-cover"
                />
                {product.isPromo && (
                  <Badge className="absolute top-4 left-4 bg-automotive-red text-white">
                    Promo
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Stok Habis
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-4">
                  {product.category}
                </Badge>

                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">{product.rating}</span>
                  </div>
                  <span className="ml-2 text-muted-foreground">
                    ({product.reviews} ulasan)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-automotive-blue">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Keunggulan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-automotive-blue" />
                      <span className="text-sm">Produk Original</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-automotive-blue" />
                      <span className="text-sm">Gratis Pengiriman</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-automotive-blue" />
                      <span className="text-sm">Garansi Resmi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-automotive-blue" />
                      <span className="text-sm">Pemasangan Cepat</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!product.inStock}
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {product.inStock
                        ? "Pesan via WhatsApp"
                        : "Hubungi untuk Ketersediaan"}
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock ? "Beli Sekarang" : "Stok Habis"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Spesifikasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Kategori:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.category}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.inStock ? "Tersedia" : "Stok Habis"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.rating}/5.0 ({product.reviews} ulasan)
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Promo:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.isPromo ? "Ya" : "Tidak"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Share */}
            <SocialShare
              title={product.name}
              description={product.description}
              url={`/produk/${product.id}`}
              hashtags={["produk", "otomotif", "shopanddrive"]}
            />

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Informasi Toko</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">08995555095</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Senin - Sabtu: 08:00 - 17:00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Products */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Produk Terkait</h3>
                <div className="space-y-3">
                  {db
                    .getAllProducts()
                    .filter(
                      (p) =>
                        p.id !== product.id &&
                        p.category === product.category &&
                        p.inStock,
                    )
                    .slice(0, 3)
                    .map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => navigate(`/produk/${relatedProduct.id}`)}
                      >
                        <div className="flex gap-3">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {relatedProduct.name}
                            </h4>
                            <p className="text-xs text-automotive-blue font-semibold mt-1">
                              {relatedProduct.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
