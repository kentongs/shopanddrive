import { GoogleAuth } from "@react-oauth/google";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

class GoogleAuthService {
  private currentUser: GoogleUser | null = null;

  async initialize(): Promise<void> {
    // In a real application, you would initialize Google Auth here
    // For demo purposes, we'll simulate the initialization
    console.log("Google Auth initialized");
  }

  async signIn(): Promise<GoogleUser | null> {
    // Simulate Google sign-in for demo
    // In a real app, this would trigger the actual Google OAuth flow
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: GoogleUser = {
          id: "google_" + Date.now(),
          name: "Demo Google User",
          email: "demo@gmail.com",
          picture: "https://via.placeholder.com/40x40/4285f4/ffffff?text=G",
        };
        this.currentUser = mockUser;
        resolve(mockUser);
      }, 1000);
    });
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): GoogleUser | null {
    return this.currentUser;
  }

  isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const googleAuthService = new GoogleAuthService();
