import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      navigate('/?error=auth_failed');
      return;
    }

    if (accessToken && refreshToken) {
      try {
        // Decode user from JWT
        const decodedUser = jwtDecode(accessToken) as any;
        setAuth(decodedUser, accessToken, refreshToken);
        
        // Redirect to home or intended page
        navigate('/');
      } catch (err) {
        console.error('Failed to decode token:', err);
        navigate('/?error=invalid_token');
      }
    } else {
      navigate('/');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center text-white font-sans">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400">Authenticating...</p>
      </div>
    </div>
  );
}
