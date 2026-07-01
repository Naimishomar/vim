const fs = require('fs');
const path = require('path');

const templates = [
  {
    name: 'RandomVideoChat.tsx',
    path: '/random-video-chat',
    title: 'Free Random Video Chat Online | Meet Strangers on Vibelly',
    desc: 'The best free random video chat website. Meet strangers instantly online without login. Vibelly provides anonymous chat with HD video and voice.',
    tagline: 'The #1 Free Random Video Chat',
    h1: 'Free Random Video Chat',
    subH1: 'Meet thousands of strangers instantly. No login required.'
  },
  {
    name: 'TalkToStrangers.tsx',
    path: '/talk-to-strangers',
    title: 'Talk to Strangers | Random Stranger Chat Online',
    desc: 'Talk to strangers from around the world on Vibelly. The ultimate random stranger chat app for instant connections, video, and anonymous messaging.',
    tagline: 'Instant Connections Worldwide',
    h1: 'Talk to Strangers Instantly',
    subH1: 'Connect globally with the best random stranger chat platform.'
  },
  {
    name: 'AnonymousChat.tsx',
    path: '/anonymous-chat',
    title: 'Anonymous Chat Website | Free Private Chat Rooms',
    desc: 'Looking for an anonymous chat website? Vibelly offers free, secure, and fully anonymous chat rooms and random video calls to keep your identity private.',
    tagline: '100% Secure & Private',
    h1: 'The Most Secure Anonymous Chat Website',
    subH1: 'Chat freely without giving up your email, phone, or identity.'
  },
  {
    name: 'ChatWithGirls.tsx',
    path: '/chat-with-girls',
    title: 'Random Video Chat Without Login | Vibelly',
    desc: 'Vibelly is the best platform for random video chat without login. Start connecting instantly in secure video rooms with strangers.',
    tagline: 'Skip the Sign-Up',
    h1: 'Random Video Chat Without Login',
    subH1: 'Jump straight into the action. Start chatting instantly in one click.'
  },
  {
    name: 'VideoChatOnline.tsx',
    path: '/video-chat-online',
    title: 'The Best Omegle Alternative 2026 | Video Chat Online',
    desc: 'Looking for a working Omegle alternative 2026? Vibelly is the best video chat online platform for random connections, built for speed and safety.',
    tagline: 'The Modern Era of Chat',
    h1: 'The Best Omegle Alternative in 2026',
    subH1: 'Experience the fastest growing video chat online.'
  }
];

const templateCode = (data) => `import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Video, Zap, MessageSquare, ArrowRight, Lock, Headphones, CheckCircle2, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import BlinkingDotsGrid from '../components/BlinkingDotsGrid';
import { useAuthStore } from '../store/useAuthStore';
import LoginModal from '../components/LoginModal';
import FAQSection from '../components/FAQSection';

const features = [
  {
    icon: Shield,
    title: 'Safe & Moderated',
    desc: 'Unlike Omegle, Vibelly uses AI moderation and user reporting to keep the community safe.',
  },
  {
    icon: Lock,
    title: '100% Anonymous',
    desc: 'No account required. Connect instantly without giving up your email or phone number.',
  },
  {
    icon: Video,
    title: 'HD Video Quality',
    desc: 'Powered by modern WebRTC technology for crystal clear video calls worldwide.',
  },
  {
    icon: MessageSquare,
    title: 'Hidden Groups',
    desc: 'Create private, code-only group chats that algorithms can never track.',
  },
];

export default function ${data.name.replace('.tsx', '')}() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, guestAccessEnabled } = useAuthStore();

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated && !guestAccessEnabled) {
      setIsLoginModalOpen(true);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#15171B] text-white flex flex-col font-sans">
      <SEO 
        title="${data.title}" 
        description="${data.desc}"
        canonicalUrl="${data.path}"
      />
      <BlinkingDotsGrid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-8"
          >
            <Zap size={16} className="text-yellow-400" />
            ${data.tagline}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-8"
            style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            ${data.h1.split(' ').slice(0, -2).join(' ')} <br />
            ${data.h1.split(' ').slice(-2).join(' ')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
          >
            ${data.subH1} Vibelly is the safest, fastest, and most aesthetic platform on the internet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button 
              onClick={() => handleProtectedNavigation('/setup/video')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Video size={20} className="group-hover:scale-110 transition-transform" />
              Video Chat
            </button>
            <button 
              onClick={() => handleProtectedNavigation('/setup/audio')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-white/10 hover:border-white/20"
            >
              <Headphones size={20} className="group-hover:scale-110 transition-transform" />
              Text & Audio
            </button>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-20 bg-[#0f1115] border-y border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        <div className="mt-auto relative z-20">
          <Footer />
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
`;

templates.forEach(t => {
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', t.name), templateCode(t));
});
console.log('Generated SEO pages.');
