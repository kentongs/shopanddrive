import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import EnhancedSearch from "./EnhancedSearch";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Promo", href: "/promo" },
  { name: "Artikel", href: "/artikel" },
  { name: "Produk", href: "/produk" },
  { name: "Kontak", href: "/kontak" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const whatsappUrl =
    "https://wa.me/628995555095?text=Halo%20admin,%20saya%20butuh%20bantuan%20🙏";

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-automotive-blue",
                  location.pathname === item.href
                    ? "text-automotive-blue"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <EnhancedSearch />
          </div>

          {/* WhatsApp & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>

            {/* Admin Login Link */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden md:flex"
            >
              <Link to="/admin/login">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <div className="mb-4">
              <EnhancedSearch />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors hover:text-automotive-blue",
                    location.pathname === item.href
                      ? "text-automotive-blue"
                      : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
