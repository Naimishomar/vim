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
        const token = localStorage.getItem('vibe_token') || useAuthStore.getState().accessToken;
        if (!token) return;
        
        try {
          // Adjust API URL as needed if it differs, but typically we can use standard fetch
          const res = await fetch('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              set({ user: data.user, isAuthenticated: true });
            }
          } else {
            set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
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
