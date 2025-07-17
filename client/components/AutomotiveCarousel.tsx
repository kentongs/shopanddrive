import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  badge?: string;
  price?: string;
  originalPrice?: string;
}

interface AutomotiveCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  itemsPerView?: number;
  className?: string;
  onItemClick?: (item: CarouselItem) => void;
}

export default function AutomotiveCarousel({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  showControls = true,
  itemsPerView = 1,
  className = "",
  onItemClick,
}: AutomotiveCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(index, maxIndex));
    },
    [maxIndex],
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || totalItems <= itemsPerView) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [
    isPlaying,
    isHovered,
    nextSlide,
    autoPlayInterval,
    totalItems,
    itemsPerView,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === " ") {
        event.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying]);

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl">
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl">
        {/* Carousel Track */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)`,
            width: `${(totalItems / itemsPerView) * 100}%`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex-shrink-0"
              style={{ width: `${100 / totalItems}%` }}
            >
              <Card
                className="mx-2 group cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => onItemClick?.(item)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-automotive-orange text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Action Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-white/90 text-automotive-blue hover:bg-white hover:scale-110 transition-all duration-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-automotive-blue transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Pricing */}
                  {item.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-automotive-blue">
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && totalItems > itemsPerView && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Play/Pause Control */}
        {autoPlay && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-200 shadow-lg"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && totalItems > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-automotive-blue shadow-lg scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && isPlaying && (
        <div className="mt-4">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-automotive-blue to-automotive-orange rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Item Counter */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
        {currentIndex + 1} / {Math.min(totalItems, maxIndex + 1)}
      </div>
    </div>
  );
}

// Usage Examples:

// For Products
export const ProductCarousel = ({
  products,
  ...props
}: { products: any[] } & Partial<AutomotiveCarouselProps>) => {
  const carouselItems: CarouselItem[] = products.map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    badge: product.isPromo ? "Promo" : undefined,
    link: `/produk/${product.id}`,
  }));

  return (
    <AutomotiveCarousel items={carouselItems} itemsPerView={3} {...props} />
  );
};

// For Promos
export const PromoCarousel = ({
  promos,
  ...props
}: { promos: any[] } & Partial<AutomotiveCarouselProps>) => {
  const carouselItems: CarouselItem[] = promos.map((promo) => ({
    id: promo.id,
    title: promo.title,
    description: promo.description,
    image: promo.image,
    price: promo.discountPrice,
    originalPrice: promo.originalPrice,
    badge: promo.discount,
    link: `/promo/${promo.id}`,
  }));

  return (
    <AutomotiveCarousel
      items={carouselItems}
      itemsPerView={2}
      autoPlayInterval={4000}
      {...props}
    />
  );
};

// For Articles
export const ArticleCarousel = ({
  articles,
  ...props
}: { articles: any[] } & Partial<AutomotiveCarouselProps>) => {
  const carouselItems: CarouselItem[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.excerpt,
    image: article.image,
    badge: article.category,
    link: `/artikel/${article.id}`,
  }));

  return (
    <AutomotiveCarousel
      items={carouselItems}
      itemsPerView={3}
      autoPlayInterval={6000}
      {...props}
    />
  );
};
