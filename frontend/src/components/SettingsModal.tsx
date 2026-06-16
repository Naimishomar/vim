import { useState, useEffect } from 'react';
import { X, LogOut, Crown, Globe, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  
  const [country, setCountry] = useState(user?.country || '');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [countryCodeMap, setCountryCodeMap] = useState<Record<string, string>>({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch('https://flagcdn.com/en/codes.json')
      .then(res => res.json())
      .then((data: Record<string, string>) => {
        const reverseMap: Record<string, string> = {};
        const names: string[] = [];
        for (const [code, name] of Object.entries(data)) {
          if (!code.includes('-')) {
            reverseMap[name] = code;
            names.push(name);
          }
        }
        setCountryCodeMap(reverseMap);
        setCountryList(names.sort((a, b) => a.localeCompare(b)));
      })
      .catch(err => console.error('Failed to fetch country list:', err));
  }, []);

  const updateCountry = async (newCountry: string) => {
    setCountry(newCountry);
    setUpdating(true);
    try {
      let token = localStorage.getItem('vibe_token') || useAuthStore.getState().accessToken;
      const backendUrl = import.meta.env.PROD ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
      
      let res = await fetch(`${backendUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ country: newCountry })
      });

      if (res.status === 401) {
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
            res = await fetch(`${backendUrl}/api/users/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ country: newCountry })
            });
          } else {
             logout(); navigate('/'); return;
          }
        } else {
           logout(); navigate('/'); return;
        }
      }

      if (res.ok) {
        await checkAuth();
      }
    } catch (err) {
      console.error('Failed to update country', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    logout();
    // Socket will automatically disconnect or we can force it 
    // by reloading or letting the protective routes handle it
    navigate('/');
    onClose();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-[#15171B] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-2xl font-normal text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-zinc-600">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#1A1A1A] flex items-center justify-center border ${user.premiumStatus ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/10'}`}>
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
              )}
            </div>
            <div>
              <p className="text-white font-medium text-lg">{user.name}</p>
              <p className="text-zinc-500 text-sm">@{user.username}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#131313] border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium text-sm">Gender</h3>
                <p className="text-xs text-zinc-400 mt-1">Gender cannot be changed after setup.</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-zinc-300 capitalize text-sm font-medium">
                {user.gender || 'Not specified'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#131313] border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium text-sm">Location</h3>
                {updating && <span className="text-xs text-white animate-pulse">Saving...</span>}
              </div>
              <div className="relative z-50">
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                >
                  <div className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3 px-4 text-white hover:border-white/20 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {country && countryCodeMap[country] ? (
                        <img 
                          src={`https://flagcdn.com/w20/${countryCodeMap[country]}.png`} 
                          alt="flag" 
                          className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                        />
                      ) : (
                        <Globe className="w-5 h-5 text-zinc-500" />
                      )}
                      <span>{country || 'Select your country'}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isCountryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-x-hidden max-h-56 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-zinc-600"
                    >
                      {countryList.map(c => (
                        <div
                          key={c}
                          onClick={() => {
                            updateCountry(c);
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
          </div>

          {/* Premium Subscription */}
          <div className="p-5 rounded-2xl bg-[#131313] border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Crown size={20} className={user.premiumStatus ? 'text-white' : 'text-zinc-500'} />
              <h3 className="text-white font-medium text-base">Subscription Plan</h3>
            </div>
            {user.premiumStatus ? (
              <div>
                <p className="text-sm text-zinc-400 mb-4">
                  You are currently on the <span className="text-white font-medium">Premium</span> plan. Enjoy your beautiful profile border!
                </p>
                {user.premiumExpiryDate && (
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-white/80 font-medium">Time remaining</span>
                    <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                      {Math.max(0, Math.ceil((new Date(user.premiumExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-zinc-400 mb-4">
                  You are currently on the <span className="text-white font-medium">Free</span> plan. Upgrade to Premium for exclusive features.
                </p>
                <button
                  onClick={() => { onClose(); navigate('/pricing'); }}
                  className="w-full bg-white hover:bg-white/80 cursor-pointer text-black font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-white/20"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#0A0A0A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-red-500 hover:text-white cursor-pointer text-red-500 font-medium transition-colors border border-red-500/10 hover:border-red-500/20"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
