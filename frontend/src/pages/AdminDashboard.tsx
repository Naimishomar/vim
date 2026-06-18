import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  premiumStatus: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If not admin, redirect immediately
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const token = localStorage.getItem('vibe_token') || useAuthStore.getState().accessToken;
        
        const response = await fetch(`${backendUrl}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white/30 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  Admin Dashboard
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Manage users and oversee platform activity.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2 w-full md:w-80">
            <Search className="text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
              <Users size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Total Users</span>
            </div>
            <p className="text-4xl font-light text-white">{isLoading ? '-' : users.length}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4 text-zinc-400">
              <Shield size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Admins</span>
            </div>
            <p className="text-4xl font-light text-white">{isLoading ? '-' : users.filter(u => u.role === 'admin').length}</p>
          </motion.div>
        </div>

        {/* User Table */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-medium text-white">Registered Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">User</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Email</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Role</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Premium</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{u.name}</span>
                          <span className="text-zinc-500 text-xs">@{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{u.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium tracking-wide uppercase ${
                          u.role === 'admin' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-white/5 text-zinc-400 border border-white/10'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.premiumStatus ? (
                          <span className="text-yellow-400 font-medium text-xs">Premium</span>
                        ) : (
                          <span className="text-zinc-600 text-xs">Free</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
