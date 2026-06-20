import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Send, Users, ArrowLeft, Copy, Check, Settings, X, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme } from 'emoji-picker-react';

export default function GroupChat() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [group, setGroup] = useState<any>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Admin Editing State
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    const fetchGroupData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/groups/${roomId}`);
        const data = await res.json();
        if (data.group) {
          setGroup(data.group);
          setEditName(data.group.name);
          setEditDesc(data.group.description);
          setEditPhotoPreview(data.group.photo);
          setEditIsPublic(data.group.isPublic ?? true);
        } else {
          navigate('/groups');
        }
      } catch (err) {
        console.error('Failed to fetch group', err);
        navigate('/groups');
      }
    };

    fetchGroupData();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-group', { roomId, user });
    });

    newSocket.on('group-history', (data: { messages: any[] }) => {
      setMessages(data.messages);
      scrollToBottom();
    });

    newSocket.on('new-group-message', (msg: any) => {
      setMessages((prev) => [...prev, msg].slice(-200));
      scrollToBottom();
    });

    newSocket.on('group-count-update', (data: { count: number }) => {
      setMemberCount(data.count);
    });

    newSocket.on('new-group-reaction', (data: { emoji: string; id: number }) => {
      const leftOffset = Math.floor(Math.random() * 40) - 20; 
      setReactions(prev => [...prev, { id: data.id, emoji: data.emoji, left: leftOffset }]);
      
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== data.id));
      }, 2000);
    });

    newSocket.on('group-deleted', () => {
      navigate('/groups');
    });

    return () => {
      newSocket.emit('leave-group', { roomId });
      newSocket.disconnect();
    };
  }, [roomId, user, isAuthenticated, navigate]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !socket || !user) return;

    socket.emit('group-message', {
      roomId,
      message: inputText.trim(),
      user
    });

    setInputText('');
  };

  const sendReaction = (emoji: string) => {
    if (!socket || !roomId) return;
    socket.emit('group-reaction', { roomId, emoji });
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(roomId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Admin Actions
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditPhoto(file);
      setEditPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSaving(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = useAuthStore.getState().accessToken || localStorage.getItem('vibe_token');
      
      let photoUrl = group.photo;
      if (editPhoto) {
        const formData = new FormData();
        formData.append('file', editPhoto);
        const uploadRes = await fetch(`${backendUrl}/api/upload/group`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) photoUrl = uploadData.url;
      }

      const res = await fetch(`${backendUrl}/api/groups/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          photo: photoUrl,
          isPublic: editIsPublic
        })
      });

      const data = await res.json();
      if (data.group) {
        setGroup(data.group);
        setIsAdminOpen(false);
      }
    } catch (err) {
      console.error('Failed to update group', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this group?")) return;
    
    setIsDeleting(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = useAuthStore.getState().accessToken || localStorage.getItem('vibe_token');
      
      await fetch(`${backendUrl}/api/groups/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Will be redirected by socket event 'group-deleted'
    } catch (err) {
      console.error('Failed to delete group', err);
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated || !group) return null;

  const isAdmin = user?._id === group.adminId;

  return (
    <div className="fixed inset-2 sm:inset-x-8 sm:inset-y-4 md:inset-x-16 md:inset-y-6 lg:inset-x-32 z-[100] bg-[#0A0A0A]/95 backdrop-blur-3xl rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
      <SEO title={`${group?.name || 'Group Chat'} | Vibelly`} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-20 min-w-0 min-h-0 h-full bg-transparent overflow-hidden">
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-zinc-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-1 sm:gap-4">
          <button 
            onClick={() => navigate('/groups')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-zinc-400 hover:text-white shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {group.photo ? (
              <img src={group.photo} alt={group.name} className="w-full h-full object-cover" />
            ) : (
              <Users size={14} className="text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 ml-1">
            <h1 className="text-lg font-bold flex items-center gap-2 truncate">
              {group.name} <span className="text-zinc-500 font-mono text-xs px-1.5 py-0.5 bg-white/5 rounded-md shrink-0 hidden sm:inline">{roomId}</span>
            </h1>
            <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {memberCount} active {memberCount === 1 ? 'member' : 'members'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={copyInviteCode}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer text-sm font-medium"
            title="Copy Invite Code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer text-sm font-medium text-zinc-300 hover:text-white"
              title="Group Settings"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto relative z-10 p-4 md:p-6 custom-scrollbar min-h-0 h-full"
        data-lenis-prevent
      >
        <div className="flex flex-col space-y-4">
          {/* Welcome message / Group Description */}
          <div className="w-full flex justify-center py-6">
            <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 max-w-md text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden mx-auto mb-4">
                {group.photo ? (
                  <img src={group.photo} alt={group.name} className="w-full h-full object-cover" />
                ) : (
                  <Users size={24} className="text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{group.name}</h2>
              {group.description && <p className="text-zinc-400 text-sm mb-4">{group.description}</p>}
              <p className="text-xs text-zinc-500 font-mono bg-black/40 py-2 px-4 rounded-lg inline-block border border-white/5">
                Code: {roomId}
              </p>
            </div>
          </div>

          {messages.map((msg) => {
            const isMe = msg.user._id === user?._id || msg.user.username === user?.username;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%]`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center">
                      {msg.user.profileImage ? (
                        <img src={msg.user.profileImage} alt={msg.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold">{msg.user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[10px] text-zinc-500 mb-1 ml-1 font-medium">{msg.user.name}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-[15px] ${
                      isMe 
                        ? 'bg-white text-black rounded-br-sm shadow-sm' 
                        : 'bg-zinc-800/90 border border-white/5 text-white rounded-bl-sm shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-600 mt-1 opacity-80">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4 shrink-0" />
        </div>
      </div>

      {/* Floating Reactions Container */}
      <div className="absolute bottom-24 right-8 z-50 pointer-events-none w-16 h-64 overflow-visible flex flex-col justify-end items-center">
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 1, y: 0, x: reaction.left, scale: 0.5 }}
              animate={{ opacity: 0, y: -200, x: reaction.left + (Math.random() * 20 - 10), scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute bottom-0 text-3xl select-none"
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-2 sm:p-3 bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="w-full flex flex-row items-center gap-3">
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2 bg-[#131313] border border-white/10 p-1.5 rounded-2xl shadow-inner min-w-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-3 py-1.5 text-white outline-none placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all cursor-pointer"
            >
              <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>

          {/* Reaction Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-visible pb-1 sm:pb-0 relative">
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-12 right-0 shadow-2xl z-50"
                >
                  <EmojiPicker 
                    theme={Theme.DARK}
                    onEmojiClick={(emojiData) => {
                      sendReaction(emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {['❤️', '👍', '😂', '😮', '🔥', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-colors cursor-pointer text-sm sm:text-base hover:scale-110 active:scale-95 shrink-0"
              >
                {emoji}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white hover:scale-110 active:scale-95 shrink-0"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Admin Settings Modal */}
      <AnimatePresence>
        {isAdminOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAdminOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#131313] border border-white/10 rounded-3xl p-5 w-full max-w-md relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              data-lenis-prevent
            >
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-3 right-3 p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Settings size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold mb-1">Group Settings</h2>
                <p className="text-xs text-zinc-400">Manage your group details.</p>
              </div>

              <form onSubmit={handleUpdateGroup} className="space-y-3 mb-5">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <div 
                      className="w-14 h-14 bg-zinc-900 border border-white/10 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors relative overflow-hidden mx-auto"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {editPhotoPreview ? (
                        <img src={editPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-zinc-500" />
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Group Name *</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none h-14"
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl mt-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">Public Group</p>
                    <p className="text-xs text-zinc-400">Anyone can see and join this group.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditIsPublic(!editIsPublic)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-1 shrink-0 ${editIsPublic ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full transition-transform ${editIsPublic ? 'bg-black translate-x-5' : 'bg-zinc-400 translate-x-0'}`} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!editName.trim() || isSaving}
                  className="w-full bg-white text-black font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-sm">Save Changes</span>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-red-500/20">
                <h3 className="text-red-500 font-semibold mb-2 text-xs">Danger Zone</h3>
                
                <div className="mb-3">
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                    Type <span className="text-white font-bold">"{group?.name}"</span> to confirm deletion
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder={group?.name}
                    className="w-full bg-zinc-900 border border-red-500/20 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDeleteGroup}
                  disabled={isDeleting || deleteConfirmation !== group?.name}
                  className="w-full bg-red-500/10 text-red-500 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border border-red-500/20"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">{isDeleting ? "Deleting..." : "Delete Group"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
