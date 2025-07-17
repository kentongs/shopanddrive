import { Car } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "white";
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
  variant = "default",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-automotive-blue rounded-lg flex items-center justify-center`}
      >
        <Car className={`${iconSizes[size]} text-white`} />
      </div>
      {showText && (
        <div className={size !== "sm" ? "block" : "hidden sm:block"}>
          <div
            className={`font-bold ${textSizes[size]} ${
              variant === "white" ? "text-white" : "text-automotive-blue"
            }`}
          >
            Shop and Drive
          </div>
          <div
            className={`text-xs ${
              variant === "white" ? "text-gray-300" : "text-muted-foreground"
            }`}
          >
            Taman Tekno
          </div>
        </div>
      )}
    </div>
  );
}
