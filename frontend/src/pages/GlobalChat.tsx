import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { io, Socket } from 'socket.io-client';
import { Users, Search, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import DirectChatWindow from '../components/Chat/DirectChatWindow';
import SEO from '../components/SEO';
import BlinkingDotsGrid from '../components/BlinkingDotsGrid';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function GlobalChat() {
  const { user, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'online' | 'search'>('inbox');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [inboxUsers, setInboxUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const handleClearChat = async (e: React.MouseEvent, targetUserId: string) => {
    e.stopPropagation();
    
    // Clear unread count locally
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[targetUserId];
      return newCounts;
    });

    // Clear selected user if it's the one we are deleting
    if (selectedUser?.userId === targetUserId) {
      setSelectedUser(null);
    }

    try {
      if (!user) return;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const myId = user._id || user.username;
      await fetch(`${backendUrl}/api/chat/history/${myId}/${targetUserId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to clear chat history', err);
    }
  };
  
  // Use ref to track selectedUser inside socket listener to avoid stale closures
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Inbox
  const fetchInboxUsers = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = useAuthStore.getState().accessToken || localStorage.getItem('vibe_token');
      const res = await fetch(`${backendUrl}/api/chat/inbox`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.inbox) {
         const mappedUsers = data.inbox.map((u: any) => ({
           userId: u._id,
           name: u.name,
           username: u.username,
           profileImage: u.profileImage,
           premiumStatus: u.premiumStatus
         }));
         setInboxUsers(mappedUsers);
      }
    } catch (e) {
      console.error('Failed to fetch inbox users', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchInboxUsers();
  }, [isAuthenticated]);

  // Refresh inbox when switching to it
  useEffect(() => {
    if (activeTab === 'inbox') {
      fetchInboxUsers();
    }
  }, [activeTab]);

  // Initialize Lenis for the sidebar
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild as HTMLElement || scrollRef.current,
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Search API effect
  useEffect(() => {
    if (activeTab !== 'search' || !searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const token = useAuthStore.getState().accessToken || localStorage.getItem('vibe_token');
        const res = await fetch(`${backendUrl}/api/users/search?q=${encodeURIComponent(searchTerm)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.users) {
           const mappedUsers = data.users.map((u: any) => ({
             userId: u._id,
             name: u.name,
             username: u.username,
             profileImage: u.profileImage,
             premiumStatus: u.premiumStatus
           }));
           // Filter out self
           const myId = user?._id || user?.username;
           setSearchResults(mappedUsers.filter((u: any) => u.userId !== myId));
        }
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsSearching(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, user]);

  // Establish socket connection and register presence
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('identify', {
        userId: user._id || user.username,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
        premiumStatus: user.premiumStatus
      });
    });

    // We can fetch initial online users via REST
    const fetchOnlineUsers = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/chat/online`);
        const data = await res.json();
        if (data.onlineUsers) {
          // Filter out self
          const myId = user._id || user.username;
          setOnlineUsers(data.onlineUsers.filter((u: any) => u.userId !== myId));
        }
      } catch (e) {
        console.error('Failed to fetch online users', e);
      }
    };

    fetchOnlineUsers();

    // Listen for presence updates
    newSocket.on('user-online', (newUser: any) => {
      const myId = user._id || user.username;
      if (newUser.userId !== myId) {
        setOnlineUsers(prev => {
           if (prev.find(u => u.userId === newUser.userId)) return prev;
           return [...prev, newUser];
        });
      }
    });

    newSocket.on('user-offline', (userId: string) => {
      setOnlineUsers(prev => prev.filter(u => u.userId !== userId));
    });

    newSocket.on('receive-direct-message', (msg: any) => {
      if (selectedUserRef.current?.userId !== msg.senderId) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1
        }));
      }
      
      // Refresh inbox when a new message is received to update the order/list
      fetchInboxUsers();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#131313] text-white font-sans flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500">Please sign in to access global chat.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = onlineUsers
    .filter(u => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (u.name?.toLowerCase() || '').includes(term) || 
             (u.username?.toLowerCase() || '').includes(term);
    })
    .sort((a, b) => {
      const aUnread = unreadCounts[a.userId] || 0;
      const bUnread = unreadCounts[b.userId] || 0;
      if (aUnread !== bUnread) return bUnread - aUnread; // Sort unread first
      return (a.name || '').localeCompare(b.name || '');
    });

  const displayUsers = activeTab === 'inbox' 
    ? inboxUsers.sort((a, b) => {
        const aUnread = unreadCounts[a.userId] || 0;
        const bUnread = unreadCounts[b.userId] || 0;
        return bUnread - aUnread; // Sort unread first, otherwise keep Redis sorted order
      })
    : activeTab === 'online' ? filteredUsers : searchResults;

  return (
    <div className="h-screen bg-[#15171B] text-white font-sans flex flex-col overflow-hidden">
      <SEO 
        title="Global Chat Room | Talk to Strangers Online - Vibelly" 
        description="Join Vibelly's global chat room to meet strangers, make friends, and chat anonymously with people all over the world."
        canonicalUrl="/chat"
      />
      {/* ─── Dot Grid Background ─── */}
      <BlinkingDotsGrid />

      <div className="flex-1 flex w-full relative z-10 overflow-hidden border-t border-white/5 bg-[#15171B]">
        
        {/* Sidebar */}
        <div className={`w-full md:w-[380px] bg-[#0A0A0A] border-r border-white/5 flex flex-col z-20 shrink-0 ${!showSidebar ? 'hidden md:flex' : ''}`}>
          <div className="p-8 pb-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-normal flex items-center gap-2" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                <Users size={24} className="text-zinc-500" />
                <span className="text-white">Contacts</span>
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#131313] border border-white/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-zinc-400">{onlineUsers.length + 1} Online</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4 border-b border-white/5 pb-4 px-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
              <button 
                onClick={() => setActiveTab('inbox')}
                className={`text-sm font-medium transition-colors relative ${activeTab === 'inbox' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Recent Chats
                {activeTab === 'inbox' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-white rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('online')}
                className={`text-sm font-medium transition-colors relative flex items-center gap-1.5 ${activeTab === 'online' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Online
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mb-0.5"></div>
                {activeTab === 'online' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-white rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('search')}
                className={`text-sm font-medium transition-colors relative ${activeTab === 'search' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Find Users
                {activeTab === 'search' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-white rounded-t-full" />}
              </button>
            </div>

            {activeTab === 'search' && (
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search database..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-all duration-300"
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar" ref={scrollRef}>
            <div className="p-4 space-y-1">
              {activeTab === 'search' && isSearching ? (
                <div className="flex flex-col items-center justify-center text-center mt-10 p-6 bg-[#131313] rounded-2xl border border-white/5">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
                  <p className="text-zinc-400 text-sm">Searching users...</p>
                </div>
              ) : displayUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-10 p-6 bg-[#131313] rounded-2xl border border-white/5">
                  <Search size={24} className="text-zinc-600 mb-3" />
                  <p className="text-zinc-400 text-sm">
                    {activeTab === 'search' 
                      ? (searchTerm ? 'No users found in database.' : 'Type a username or name to search.') 
                      : activeTab === 'inbox' 
                        ? 'No recent chats. Start a conversation!'
                        : 'No users online.'}
                  </p>
                </div>
              ) : (
                displayUsers.map((u) => (
                  <button
                    key={u.userId}
                    onClick={() => {
                      setSelectedUser(u);
                      setUnreadCounts(prev => ({ ...prev, [u.userId]: 0 }));
                      setShowSidebar(false);
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border group ${
                      selectedUser?.userId === u.userId 
                        ? 'bg-white/5 border-white/10' 
                        : 'border-transparent hover:bg-[#131313]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-full border bg-[#1A1A1A] p-0.5 ${u.premiumStatus ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/10'}`}>
                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-lg">{u.name?.charAt(0).toUpperCase() || '?'}</span>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full" />
                    </div>
                    <div className="text-left flex-1 min-w-0 flex justify-between items-center">
                      <div>
                        <p className={`font-medium text-sm truncate ${unreadCounts[u.userId] ? 'text-white' : 'text-zinc-300'}`}>{u.name || 'Anonymous'}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">@{u.username}</p>
                      </div>
                      {!!unreadCounts[u.userId] && (
                        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {unreadCounts[u.userId]}
                        </div>
                      )}
                      <button 
                        onClick={(e) => handleClearChat(e, u.userId)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Hide chat"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
            {/* Padding for BottomNav on mobile */}
            <div className="h-16 md:hidden"></div>
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedUser ? (
          <div className={`flex-1 w-full ${showSidebar ? 'hidden md:flex' : 'flex'}`}>
            <DirectChatWindow socket={socket} currentUser={user} selectedUser={selectedUser} onBack={() => setShowSidebar(true)} />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-transparent relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="bg-[#131313] p-8 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl relative z-10 text-center">
              <Users size={32} className="text-zinc-500 mb-4" />
              <h2 className="text-xl text-white font-medium mb-2">Select a Conversation</h2>
              <p className="text-zinc-500 text-sm">Choose someone from the list to start chatting.</p>
            </div>
          </div>
        )}

      </div>

      {!selectedUser && (
        <BottomNav onRequiresAuth={() => navigate('/')} />
      )}
    </div>
  );
}
