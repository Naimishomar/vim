import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Video, Zap, MessageSquare, ArrowRight, Lock, CheckCircle2, XCircle, Headphones } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import BlinkingDotsGrid from '../components/BlinkingDotsGrid';
import { useAuthStore } from '../store/useAuthStore';
import LoginModal from '../components/LoginModal';

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

export default function OmegleAlternative() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
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
        title="The Best Free Omegle Alternative in 2026 | Vibelly" 
        description="Looking for an Omegle alternative? Vibelly is the best free random video call app. Meet strangers instantly with HD video, voice chat, and strict safety measures."
        canonicalUrl="/omegle-alternative"
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
            The #1 Alternative to Omegle & OmeTV
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-8"
            style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Miss Omegle?<br />
            Meet the modern upgrade.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
          >
            Omegle shut down, but the need to talk to strangers didn't. 
            Vibelly is the safest, fastest, and most aesthetic random video call app on the internet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => handleProtectedNavigation('/setup/video')}
              className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Video Call Now
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => handleProtectedNavigation('/setup/audio')}
              className="flex items-center gap-2 bg-zinc-800/60 text-white border border-zinc-700 px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              <Headphones size={18} />
              Voice Only
            </button>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="px-6 py-20 max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Why choose Vibelly over OmeTV?
            </h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto">
              We took everything you loved about random video chat and fixed everything you hated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 py-20 max-w-4xl mx-auto w-full">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center z-10 relative">
              The Ultimate Showdown
            </h2>

            <div className="relative z-10 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/10 text-zinc-500 font-medium">Feature</th>
                    <th className="p-4 border-b border-white/10 text-white font-semibold text-center text-lg">Vibelly</th>
                    <th className="p-4 border-b border-white/10 text-zinc-500 font-medium text-center">Omegle</th>
                    <th className="p-4 border-b border-white/10 text-zinc-500 font-medium text-center">OmeTV</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { label: "Account Required", v: true, o: true, t: false },
                    { label: "HD Video Quality", v: true, o: false, t: false },
                    { label: "Dark Mode Aesthetic", v: true, o: false, t: false },
                    { label: "Hidden Group Chats", v: true, o: false, t: false },
                    { label: "Active Moderation", v: true, o: false, t: true },
                    { label: "Mobile Optimized", v: true, o: false, t: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 border-b border-white/5 text-zinc-300 font-medium">{row.label}</td>
                      <td className="p-4 border-b border-white/5 text-center bg-white/5">
                        {row.v ? <CheckCircle2 className="mx-auto text-green-400" size={20} /> : <XCircle className="mx-auto text-red-400" size={20} />}
                      </td>
                      <td className="p-4 border-b border-white/5 text-center">
                        {row.o ? <CheckCircle2 className="mx-auto text-zinc-600" size={20} /> : <XCircle className="mx-auto text-zinc-600" size={20} />}
                      </td>
                      <td className="p-4 border-b border-white/5 text-center">
                        {row.t ? <CheckCircle2 className="mx-auto text-zinc-600" size={20} /> : <XCircle className="mx-auto text-zinc-600" size={20} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SEO Text Block for Keyword Density */}
        <section className="px-6 py-20 max-w-3xl mx-auto w-full text-center">
          <h2 className="text-2xl font-bold mb-6 text-zinc-300">Start your Random Video Call today</h2>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">
            Finding a reliable Omegle alternative doesn't have to be hard. Whether you are looking for a random video chat, a text-based chatroulette alternative, or just a place to talk to strangers online safely, Vibelly is designed for you. Our platform runs entirely in your browser, meaning you don't need to download any sketchy apps. 
          </p>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Experience the internet the way it was meant to be—anonymous, fun, and completely free. Start your random video call now and connect with someone on the other side of the world in less than a second.
          </p>
        </section>

        <Footer />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    </div>
  );
}
