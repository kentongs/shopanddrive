import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { db } from "@/services/database";

export default function Artikel() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua Artikel");

  // Get unique categories from database
  const [categories, setCategories] = useState(["Semua Artikel"]);

  useEffect(() => {
    // Load all articles from database
    const allArticles = db.getAllArticles();
    setArticles(allArticles);
    setFilteredArticles(allArticles);

    // Extract unique categories
    const uniqueCategories = [
      "Semua Artikel",
      ...new Set(allArticles.map((article) => article.category)),
    ];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    // Filter articles by category
    if (selectedCategory === "Semua Artikel") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(
        articles.filter((article) => article.category === selectedCategory),
      );
    }
  }, [selectedCategory, articles]);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-automotive-blue to-automotive-blue-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Artikel Otomotif
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Tips, panduan, review, dan informasi terbaru seputar dunia otomotif
            untuk membantu Anda merawat kendaraan dengan baik.
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

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Link key={article.id} to={`/artikel/${article.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {article.category}
                        </Badge>

                        <h3 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-automotive-blue cursor-pointer transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {article.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.readTime}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            className={
                              article.status === "published"
                                ? "bg-green-100 text-green-800"
                                : article.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {article.status === "published" && "Terbit"}
                            {article.status === "draft" && "Draft"}
                            {article.status === "archived" && "Arsip"}
                          </Badge>
                          <Button
                            variant="link"
                            className="p-0 text-automotive-blue"
                          >
                            Baca Selengkapnya
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Show load more only if there are many articles */}
              {filteredArticles.length > 6 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Muat Artikel Lainnya
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Belum Ada Artikel</h3>
              <p className="text-muted-foreground">
                {selectedCategory === "Semua Artikel"
                  ? "Saat ini belum ada artikel yang tersedia."
                  : `Belum ada artikel dalam kategori "${selectedCategory}".`}
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
