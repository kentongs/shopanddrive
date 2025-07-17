import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function EnhancedCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  onClick,
}: EnhancedCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 transition-all duration-500",
        hover && "hover:scale-105 hover:shadow-2xl cursor-pointer",
        glow && "hover:shadow-2xl hover:shadow-automotive-blue/20",
        gradient &&
          "bg-gradient-to-br from-white via-white to-gray-50/50 hover:from-white hover:to-automotive-blue/5",
        !gradient && "bg-white",
        className,
      )}
      onClick={onClick}
    >
      {/* Animated gradient overlay */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-automotive-blue/0 via-automotive-blue/5 to-automotive-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Shine effect on hover */}
      {hover && (
        <div className="absolute inset-0 -top-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </Card>
  );
}

export function EnhancedCardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <CardContent className={cn("group", className)}>{children}</CardContent>
  );
}
