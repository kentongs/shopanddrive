import { ReactNode, useEffect } from "react";
import { googleAuthService } from "@/services/googleAuth";

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export default function GoogleOAuthProvider({
  children,
}: GoogleOAuthProviderProps) {
  useEffect(() => {
    // Initialize Google Auth when component mounts
    googleAuthService.initialize();
  }, []);

  return <>{children}</>;
}
