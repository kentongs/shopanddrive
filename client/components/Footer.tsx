import { MapPin, Phone, Clock } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-automotive-gray text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo variant="white" />
            </div>
            <p className="text-gray-300 text-sm">
              Solusi terpercaya untuk kebutuhan otomotif Anda. Melayani dengan
              sepenuh hati sejak bertahun-tahun.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Jl. Rawa Buntu Raya No. 61 A, Ciater, Tangerang Selatan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href="tel:08995555095"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  08995555095
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="text-gray-300">
                  Senin - Sabtu: 08:00 - 17:00
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/promo"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Promo Terbaru
                </a>
              </li>
              <li>
                <a
                  href="/artikel"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Artikel Otomotif
                </a>
              </li>
              <li>
                <a
                  href="/produk"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Produk Unggulan
                </a>
              </li>
              <li>
                <a
                  href="/kontak"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Penjualan Spare Part</li>
              <li className="text-gray-300">Konsultasi Otomotif</li>
              <li className="text-gray-300">Service Kendaraan</li>
              <li className="text-gray-300">Modifikasi</li>
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Lokasi Kami</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5755847445635!2d106.70276127502736!3d-6.318094161803746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e5b8c4d88073%3A0x7b10bbead6d4e3c4!2sJl.%20Rawa%20Buntu%20Raya%20No.61A%2C%20Ciater%2C%20Kec.%20Serpong%2C%20Kota%20Tangerang%20Selatan%2C%20Banten%2015310!5e0!3m2!1sen!2sid!4v1703123456789!5m2!1sen!2sid"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              ></iframe>
            </div>
            <div className="mt-2">
              <a
                href="https://maps.google.com/?q=Jl.+Rawa+Buntu+Raya+No.61A,+Ciater,+Tangerang+Selatan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-automotive-orange hover:text-white transition-colors inline-flex items-center"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Shop and Drive Taman Tekno. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
