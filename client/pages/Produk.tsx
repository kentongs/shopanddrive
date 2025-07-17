import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { db } from "@/services/database";

export default function Produk() {
  useVisitorTracking(); // Track page visits

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua Produk");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique categories from database
  const [categories, setCategories] = useState(["Semua Produk"]);

  useEffect(() => {
    // Load all products from database
    const allProducts = db.getAllProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);

    // Extract unique categories
    const uniqueCategories = [
      "Semua Produk",
      ...new Set(allProducts.map((product) => product.category)),
    ];
    setCategories(uniqueCategories);

    // Handle search from URL params
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "Semua Produk") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, products, searchQuery]);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-automotive-blue to-automotive-blue-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {searchQuery
              ? `Hasil Pencarian: "${searchQuery}"`
              : "Produk Otomotif"}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            {searchQuery
              ? `Menampilkan ${filteredProducts.length} produk untuk pencarian "${searchQuery}"`
              : "Koleksi lengkap produk otomotif berkualitas tinggi dengan harga terbaik. Dari oli mesin hingga aksesoris premium untuk kendaraan Anda."}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                className={
                  category === selectedCategory
                    ? "bg-automotive-blue hover:bg-automotive-blue-dark"
                    : ""
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/produk/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {product.isPromo && (
                          <Badge className="absolute top-2 left-2 bg-automotive-red">
                            Promo
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Stok Habis</Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {product.category}
                        </Badge>

                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-automotive-blue cursor-pointer transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1 font-medium">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({product.reviews} ulasan)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-automotive-blue">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          className="w-full bg-automotive-blue hover:bg-automotive-blue-dark"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? "Lihat Detail" : "Stok Habis"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Show load more only if there are many products */}
              {filteredProducts.length > 8 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Muat Produk Lainnya
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Belum Ada Produk</h3>
              <p className="text-muted-foreground">
                {selectedCategory === "Semua Produk"
                  ? "Saat ini belum ada produk yang tersedia."
                  : `Belum ada produk dalam kategori "${selectedCategory}".`}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
