import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Headphones, Zap } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto w-full text-sm text-zinc-400">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-base tracking-tight">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
          <Zap size={15} className="text-white" fill="white" />
        </div>
        <span>Vibe</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/mcp" className="hover:text-white transition-colors">MCP Registry</Link>
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/call/audio')}
          className="hidden sm:flex items-center gap-1.5 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 px-3.5 py-1.5 rounded-lg transition-colors text-sm"
        >
          <Headphones size={14} />
          Voice
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/call/video')}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors text-sm shadow-lg shadow-violet-600/20"
        >
          <Video size={14} />
          Start Video
        </motion.button>
      </div>
    </nav>
  );
}
