import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Tag,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import { db, type Promo } from "@/services/database";

export default function PromoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const promoData = db.getPromoById(id);
      setPromo(promoData);
      setIsLoading(false);
    }
  }, [id]);

  const whatsappUrl = `https://wa.me/628995555095?text=Halo%20admin,%20saya%20tertarik%20dengan%20promo%20${promo?.title}%20🙏`;

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

  if (!promo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Promo Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Promo yang Anda cari tidak ditemukan atau sudah tidak tersedia.
            </p>
            <Button onClick={() => navigate("/promo")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Promo
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
          onClick={() => navigate("/promo")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Promo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Promo Image */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-automotive-red text-white text-lg px-3 py-1">
                  {promo.discount}
                </Badge>
                <Badge
                  className={`absolute top-4 right-4 ${
                    promo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : promo.status === "expired"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {promo.status === "active" && "Aktif"}
                  {promo.status === "expired" && "Berakhir"}
                  {promo.status === "scheduled" && "Terjadwal"}
                </Badge>
              </div>
            </Card>

            {/* Promo Details */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-4">{promo.title}</h1>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-automotive-blue">
                      {promo.discountPrice}
                    </span>
                    {promo.originalPrice &&
                      promo.originalPrice !== promo.discountPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {promo.originalPrice}
                        </span>
                      )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Detail Penawaran
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                {/* Validity */}
                <div className="mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      Valid sampai{" "}
                      {new Date(promo.validUntil).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={promo.status === "expired"}
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {promo.status === "expired"
                        ? "Promo Berakhir"
                        : "Hubungi Kami via WhatsApp"}
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={promo.status === "expired"}
                  >
                    <Tag className="h-5 w-5 mr-2" />
                    {promo.status === "expired"
                      ? "Promo Berakhir"
                      : "Ambil Promo Ini"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comment Section */}
            <CommentSection
              contentId={promo.id}
              contentType="promo"
              contentTitle={promo.title}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Share */}
            <SocialShare
              title={promo.title}
              description={promo.description}
              url={`/promo/${promo.id}`}
              hashtags={["promo", "otomotif", "shopanddrive"]}
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

            {/* Terms */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Syarat & Ketentuan</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Promo berlaku selama periode yang ditentukan</p>
                  <p>• Tidak dapat digabung dengan promo lain</p>
                  <p>• Berlaku untuk pelanggan baru dan lama</p>
                  <p>• Stok terbatas, berlaku selama persediaan masih ada</p>
                  <p>• Hubungi kami untuk informasi lebih lanjut</p>
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
