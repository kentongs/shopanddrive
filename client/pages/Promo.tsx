import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag } from "lucide-react";
import { db } from "@/services/database";

export default function Promo() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    // Load all promos from database
    const allPromos = db.getAllPromos();
    setPromos(allPromos);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-automotive-blue to-automotive-blue-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Promo Spesial Kami
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Jangan lewatkan penawaran terbaik untuk kebutuhan otomotif Anda.
            Hemat lebih banyak dengan promo eksklusif kami!
          </p>
        </div>
      </section>

      {/* Promo Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {promos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo) => (
                <Link key={promo.id} to={`/promo/${promo.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-automotive-red text-white">
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
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-3 hover:text-automotive-blue transition-colors">
                        {promo.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {promo.description}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-automotive-blue">
                            {promo.discountPrice}
                          </span>
                          {promo.originalPrice &&
                            promo.originalPrice !== promo.discountPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {promo.originalPrice}
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Valid Until */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Valid sampai{" "}
                          {new Date(promo.validUntil).toLocaleDateString(
                            "id-ID",
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-automotive-blue hover:bg-automotive-blue-dark"
                        disabled={promo.status === "expired"}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {promo.status === "expired"
                          ? "Promo Berakhir"
                          : "Lihat Detail"}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Belum Ada Promo</h3>
              <p className="text-muted-foreground">
                Saat ini belum ada promo yang tersedia. Silakan cek kembali
                nanti!
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
