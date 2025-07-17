import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analyticsService } from "@/services/analytics";

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view when component mounts or route changes
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);
}
