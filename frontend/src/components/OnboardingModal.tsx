import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Globe, User, ChevronDown } from 'lucide-react';

export default function OnboardingModal() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [countryCodeMap, setCountryCodeMap] = useState<Record<string, string>>({});
  const [countryFlag, setCountryFlag] = useState<string | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is authenticated but missing gender or country, show modal
    if (isAuthenticated && user && (!user.gender || !user.country)) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      
      // Auto-detect country via IP if not already set by user
      if (!user.country && !country) {
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data.country_name) setCountry(data.country_name);
          })
          .catch(err => console.error('Failed to auto-detect country:', err));
      }
    } else {
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Fetch list of all countries from flagcdn
    fetch('https://flagcdn.com/en/codes.json')
      .then(res => res.json())
      .then((data: Record<string, string>) => {
        const reverseMap: Record<string, string> = {};
        const names: string[] = [];
        for (const [code, name] of Object.entries(data)) {
          if (!code.includes('-')) { // Skip subdivision flags
            reverseMap[name] = code;
            names.push(name);
          }
        }
        setCountryCodeMap(reverseMap);
        setCountryList(names.sort((a, b) => a.localeCompare(b)));
      })
      .catch(err => console.error('Failed to fetch country list:', err));
  }, []);

  useEffect(() => {
    if (country && countryCodeMap[country]) {
      const code = countryCodeMap[country];
      setCountryFlag(`https://flagcdn.com/w40/${code}.png`);
    } else {
      setCountryFlag(null);
    }
  }, [country, countryCodeMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !country) return;

    setLoading(true);
    setError(null);
    try {
      let token = localStorage.getItem('vibe_token') || useAuthStore.getState().accessToken;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      let res = await fetch(`${backendUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ gender, country })
      });

      if (res.status === 401) {
        // Try to refresh token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const refreshRes = await fetch(`${backendUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            useAuthStore.getState().setAuth(user!, data.accessToken, data.refreshToken);
            token = data.accessToken;
            
            // Retry the original request
            res = await fetch(`${backendUrl}/api/users/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ gender, country })
            });
          } else {
            useAuthStore.getState().logout();
            return;
          }
        } else {
          useAuthStore.getState().logout();
          return;
        }
      }

      if (res.ok) {
        await checkAuth(); // Refresh user context
        setIsOpen(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Network error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl relative"
        >
          <div className="p-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <User className="text-white w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Complete your profile</h2>
            <p className="text-zinc-400 text-sm mb-8">
              We need a few more details to ensure you get the best matchmaking experience.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl border text-sm font-medium capitalize transition-colors ${
                        gender === g 
                          ? 'bg-white border-white text-black' 
                          : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Country</label>
                <div className="relative">
                  
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  >
                    {countryFlag ? (
                      <img src={countryFlag} alt="flag" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 object-cover rounded-sm shadow-sm z-10" />
                    ) : (
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 z-10" />
                    )}
                    
                    <div className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-white/50 transition-colors flex items-center h-[50px]">
                      <span className={country ? "text-white" : "text-zinc-600"}>
                        {country || "Select your country"}
                      </span>
                    </div>
                    
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isCountryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl overflow-x-hidden max-h-56 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-zinc-600"
                      >
                        {countryList.map(c => (
                          <div
                            key={c}
                            onClick={() => {
                              setCountry(c);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors text-sm ${country === c ? 'bg-white/5 text-white font-medium' : 'text-zinc-400'}`}
                          >
                            <img 
                              src={`https://flagcdn.com/w20/${countryCodeMap[c]}.png`} 
                              alt={c} 
                              className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                            />
                            {c}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!gender || !country || loading}
                className="cursor-pointer w-full bg-white text-black font-medium rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
                {!loading && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
