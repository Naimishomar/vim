import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  name: string;
  username: string;
  email?: string;
  profileImage?: string;
  premiumStatus: boolean;
  premiumExpiryDate?: string;
  gender?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      
      checkAuth: async () => {
        const state = useAuthStore.getState();
        const token = localStorage.getItem('vibe_token') || state.accessToken;
        if (!token) return;
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        try {
          let res = await fetch(`${backendUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // If token expired, try to refresh
          if (res.status === 401 && state.refreshToken) {
            const refreshRes = await fetch(`${backendUrl}/api/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: state.refreshToken })
            });

            if (refreshRes.ok) {
              const tokens = await refreshRes.json();
              set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
              
              // Retry fetching user profile with new access token
              res = await fetch(`${backendUrl}/api/users/me`, {
                headers: { Authorization: `Bearer ${tokens.accessToken}` }
              });
            }
          }

          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              set({ user: data.user, isAuthenticated: true });
            }
          } else {
            // Both access and refresh tokens failed, log out
            set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
            localStorage.removeItem('vibe_token');
          }
        } catch (error) {
          console.error('checkAuth failed:', error);
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
