import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";

export default function Kontak() {
  const whatsappUrl =
    "https://wa.me/628995555095?text=Halo%20admin,%20saya%20butuh%20bantuan%20🙏";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-automotive-blue to-automotive-blue-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Siap membantu Anda dengan layanan terbaik. Hubungi kami untuk
            konsultasi, pemesanan, atau informasi produk dan layanan otomotif.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Kirim Pesan</h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nama Depan</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nama Belakang</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Nomor Telefon</Label>
                      <Input id="phone" type="tel" placeholder="08123456789" />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subjek</Label>
                      <Input
                        id="subject"
                        placeholder="Konsultasi produk otomotif"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        placeholder="Jelaskan kebutuhan atau pertanyaan Anda..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-automotive-blue hover:bg-automotive-blue-dark"
                    >
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Informasi Kontak</h2>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-automotive-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Alamat Toko</h3>
                        <p className="text-muted-foreground">
                          Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang
                          Selatan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-automotive-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Telefon</h3>
                        <p className="text-muted-foreground">08995555095</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-automotive-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Jam Operasional</h3>
                        <div className="text-muted-foreground space-y-1">
                          <p>Senin - Sabtu: 08:00 - 17:00</p>
                          <p>Minggu: Tutup</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-automotive-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-muted-foreground">
                          info@shopanddrive.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp CTA */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Butuh Bantuan Cepat?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Hubungi kami langsung via WhatsApp untuk respon yang lebih
                    cepat
                  </p>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Lokasi Kami</h2>
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Google Maps akan ditampilkan di sini
                    </p>
                    <Button
                      variant="link"
                      asChild
                      className="text-automotive-blue"
                    >
                      <a
                        href="https://maps.app.goo.gl/xsbWEz3NDEALurnA6"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat di Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
