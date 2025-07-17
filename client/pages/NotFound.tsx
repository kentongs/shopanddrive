import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-automotive-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="h-12 w-12 text-automotive-blue" />
          </div>

          <h1 className="text-6xl font-bold text-automotive-blue mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-8">
            Sepertinya halaman yang Anda cari sudah pindah tempat atau tidak
            ada. Mari kembali ke beranda untuk mencari produk otomotif terbaik.
          </p>

          <div className="space-y-4">
            <Button
              asChild
              className="bg-automotive-blue hover:bg-automotive-blue-dark"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>

            <div className="text-sm text-muted-foreground">
              Atau hubungi kami jika Anda membutuhkan bantuan
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
