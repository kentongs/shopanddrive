import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl =
    "https://wa.me/628995555095?text=Halo%20admin,%20saya%20butuh%20bantuan%20🙏";

  // Show button after a delay and page scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto show tooltip after button appears
  useEffect(() => {
    if (isVisible) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
        // Auto hide after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }, 1000);

      return () => clearTimeout(tooltipTimer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-4">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-right-5 duration-500">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-3 w-3 text-gray-500" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Butuh Bantuan?
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Chat langsung dengan tim ahli kami untuk konsultasi gratis!
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                Chat Sekarang
              </a>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-4 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-in zoom-in-50 duration-700"
          aria-label="Hubungi kami via WhatsApp"
          onMouseEnter={() => !showTooltip && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <MessageCircle className="h-7 w-7 group-hover:animate-bounce" />

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-50"></div>
        </a>

        {/* Notification Badge */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          1
        </div>

        {/* Online Status */}
        <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full w-5 h-5 animate-pulse"></div>
      </div>
    </div>
  );
}
