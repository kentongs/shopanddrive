import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Phone,
  Eye,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import { db, type Article } from "@/services/database";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const articleData = db.getArticleById(id);
      setArticle(articleData);
      setIsLoading(false);
    }
  }, [id]);

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

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Artikel yang Anda cari tidak ditemukan atau sudah tidak tersedia.
            </p>
            <Button onClick={() => navigate("/artikel")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Artikel
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
          onClick={() => navigate("/artikel")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Artikel
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Header */}
            <Card>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-4">
                  {article.category}
                </Badge>

                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    1,247 pembaca
                  </div>
                </div>

                {/* Featured Image */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
                />

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="space-y-4 leading-relaxed">
                    {article.content.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Additional content for automotive articles */}
                  <div className="mt-8 p-4 bg-automotive-gray-light rounded-lg">
                    <h3 className="font-semibold mb-2">Tips Tambahan:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • Selalu konsultasikan dengan teknisi berpengalaman
                      </li>
                      <li>• Gunakan spare part original untuk hasil terbaik</li>
                      <li>• Lakukan perawatan rutin sesuai jadwal</li>
                      <li>• Simpan dokumentasi perawatan untuk referensi</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Bio */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Tentang Penulis</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-automotive-blue rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{article.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      Penulis berpengalaman di bidang otomotif dengan keahlian
                      dalam perawatan kendaraan dan tips praktis untuk pemilik
                      mobil.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment Section */}
            <CommentSection
              contentId={article.id}
              contentType="article"
              contentTitle={article.title}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Share */}
            <SocialShare
              title={article.title}
              description={article.excerpt}
              url={`/artikel/${article.id}`}
              hashtags={["artikel", "otomotif", "tips", "shopanddrive"]}
            />

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Konsultasi Gratis</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ada pertanyaan tentang artikel ini? Hubungi kami untuk
                  konsultasi gratis!
                </p>
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
                </div>
                <Button
                  asChild
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  <a
                    href={`https://wa.me/628995555095?text=Halo%20admin,%20saya%20ingin%20konsultasi%20tentang%20artikel%20"${article.title}"%20🙏`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Konsultasi via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Artikel Terkait</h3>
                <div className="space-y-3">
                  {db
                    .getAllArticles()
                    .filter(
                      (a) =>
                        a.id !== article.id &&
                        a.category === article.category &&
                        a.status === "published",
                    )
                    .slice(0, 3)
                    .map((relatedArticle) => (
                      <div
                        key={relatedArticle.id}
                        className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() =>
                          navigate(`/artikel/${relatedArticle.id}`)
                        }
                      >
                        <h4 className="font-medium text-sm line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {relatedArticle.readTime}
                        </p>
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
