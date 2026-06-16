import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Video, Headphones, ArrowRight, Shield,
  Zap, MessageSquare, SkipForward, Globe, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── Data ─── */
const features = [
  {
    icon: Shield,
    title: 'Anonymous by default',
    desc: 'No account, no profile, no trace. Connect purely on vibes.',
  },
  {
    icon: Zap,
    title: 'Instant matching',
    desc: 'Our Redis queue matches you with someone in under a second. No waiting rooms.',
  },
  {
    icon: Video,
    title: 'HD video calls',
    desc: 'WebRTC-powered 480p+ video with adaptive bitrate for smooth calls worldwide.',
  },
  {
    icon: Headphones,
    title: 'Voice-only mode',
    desc: 'Keep your camera off. Audio-only for low-bandwidth or private sessions.',
  },
  {
    icon: MessageSquare,
    title: 'Live chat sidebar',
    desc: 'Type while you talk. Messages stay in session — nothing is stored after you leave.',
  },
  {
    icon: SkipForward,
    title: 'Skip anytime',
    desc: 'Not feeling the vibe? Hit skip and you\'re instantly matched with someone new.',
  },
];

const steps = [
  {
    id: 'find',
    label: 'Find a Match',
    number: '01',
    eyebrow: 'FIND A MATCH',
    title: 'One click. You\'re in the queue.',
    body: 'Hit "Start Video Call" or "Voice Only" and our matchmaking engine instantly searches for someone ready to connect. No sign-up, no profile setup — just press go.',
    bullets: [
      'Sub-second matching via Redis queue',
      'Separate queues for video and audio',
      'Guests matched anonymously by socket ID',
    ],
  },
  {
    id: 'call',
    label: 'Start the Call',
    number: '02',
    eyebrow: 'START THE CALL',
    title: 'Real-time WebRTC video or voice.',
    body: 'The moment a match is found, WebRTC negotiation begins automatically. Your camera and mic stream directly — no server relay for media, ultra-low latency.',
    bullets: [
      'WebRTC peer-to-peer via Cloudflare SFU',
      'Mic and camera toggles without dropping the call',
      'Picture-in-picture local preview, drag anywhere',
    ],
  },
  {
    id: 'chat',
    label: 'Chat & Connect',
    number: '03',
    eyebrow: 'CHAT & CONNECT',
    title: 'Talk, type, and actually connect.',
    body: 'Use the live chat panel to type while you talk. Typing indicators let you know when the other person is responding. All messages are ephemeral — gone when the call ends.',
    bullets: [
      'Real-time chat via Socket.io',
      'Live "is typing…" indicator',
      'Unread message badge on the chat button',
    ],
  },
  {
    id: 'skip',
    label: 'Skip or Stay',
    number: '04',
    eyebrow: 'SKIP OR STAY',
    title: 'Every conversation is your choice.',
    body: 'Not feeling it? Skip and you\'re back in the queue instantly. The other person is automatically re-queued too. No awkward goodbyes — just move on.',
    bullets: [
      'Skip re-queues both users simultaneously',
      'Report button for safety',
      'End call returns you cleanly to the home screen',
    ],
  },
];

const metrics = [
  {
    title: 'Matched in under 1 second',
    body: 'Our Redis-backed queue pops users in real time. From pressing the button to live call — the fastest random chat on the web.',
  },
  {
    title: 'Zero data retained after the call',
    body: 'No recordings, no logs, no chat history. When the call ends, it\'s gone. We build for privacy by default, not as an afterthought.',
  },
  {
    title: 'Same quality for every user',
    body: 'Video or voice, guest or returning user — everyone gets the same low-latency, high-quality experience. No tiers, no paywalls.',
  },
];

/* ─── Component ─── */
export default function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('find');
  const activeStepData = steps.find((s) => s.id === activeStep)!;

  return (
    <div className="min-h-screen bg-[#15171B] text-white flex flex-col font-sans">

      {/* ─── Dot Grid ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, white 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 max-w-4xl mx-auto w-full">

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[15px] tracking-[0.2em] text-zinc-400 font-medium uppercase"
          >
            Random Video &amp; Voice Chat
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.1] mb-8"
            style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Meet someone new.
            <br />
            Right now.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base text-zinc-400 mb-10 max-w-xl leading-relaxed text-xl"
          >
            Anonymous real-time video and voice calls with strangers from around the world.
            No sign-up. No profile. Just press start.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => navigate('/setup/video')}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-medium hover:bg-zinc-100 transition-colors"
            >
              Start Video Call
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/setup/audio')}
              className="flex items-center gap-2 bg-zinc-800/60 text-white border border-zinc-700 px-6 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-colors"
            >
              <Headphones size={16} />
              Voice Only
            </button>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 1.5 — FLOATING PANELS UI
        ══════════════════════════════════════════ */}
        <section className="relative w-full max-w-[1200px] mx-auto px-6 pb-20 flex flex-col items-center overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-normal text-center max-w-3xl leading-tight mb-20 z-20 relative"
            style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            One platform for all your spontaneous connections
          </motion.h2>

          <div className="relative w-full h-[500px] md:h-[600px] flex justify-center items-center mt-[-40px]">
            {/* Left Card - Settings/Rules */}
            <motion.div
              className="absolute left-[2%] md:left-[10%] top-[20%] w-[260px] md:w-[320px] bg-[#131313] border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-5 z-10 hidden sm:block"
              initial={{ rotate: -15, x: -80, opacity: 0 }}
              whileInView={{ rotate: -8, x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                  <Shield size={16} />
                  <span className="text-sm font-semibold">Privacy Rules</span>
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'End-to-End Encryption', active: true },
                  { name: 'Anonymous Identity', active: true },
                  { name: 'Data Retention', active: false },
                  { name: 'High-Quality Media', active: true }
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-xs text-zinc-300 flex items-center gap-2">
                      <div className="w-3 h-4 bg-white/5 rounded-sm border border-white/10 flex items-center justify-center">
                        <div className="w-1.5 h-0.5 bg-white/30 rounded-full" />
                      </div>
                      {item.name}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${item.active ? 'bg-white' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${item.active ? 'right-0.5 bg-black' : 'left-0.5 bg-zinc-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Card - Live Chat */}
            <motion.div
              className="absolute right-[2%] md:right-[10%] top-[15%] w-[260px] md:w-[320px] bg-[#131313] border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-5 z-10 hidden sm:block"
              initial={{ rotate: 15, x: 80, opacity: 0 }}
              whileInView={{ rotate: 8, x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring', bounce: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare size={16} />
                  <span className="text-sm font-semibold">Live Chat</span>
                </div>
                <span className="text-[10px] text-zinc-500">2 connected</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-center p-2.5 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">S</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white flex justify-between">Stranger <span className="text-[10px] text-zinc-500 font-normal">Now</span></div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Hi there! Anyone around?</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center p-2.5 rounded-xl bg-white/[0.03] border border-white/10 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-medium shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]">Y</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white flex justify-between">You <span className="text-[10px] text-zinc-500 font-normal">Just now</span></div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Hey! Just joined the queue.</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center p-2.5 rounded-xl hover:bg-white/5 border border-transparent transition-colors opacity-50">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-medium shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">S</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white flex justify-between">Stranger</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5 italic">is typing...</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center Card - Video Session (Main Focus) */}
            <motion.div
              className="absolute z-20 w-full max-w-[500px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#111]">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-zinc-300" />
                  <span className="text-sm font-medium text-white">Live Session</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Match Found
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Video Feed Placeholder */}
                <div className="relative w-full aspect-video bg-[#111] rounded-xl border border-white/5 overflow-hidden mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Video size={24} className="text-white/40" />
                     </div>
                     <span className="text-xs text-zinc-500 font-medium">Remote stream connected</span>
                  </div>
                  
                  {/* Local PiP Preview */}
                  <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-[#1A1A1A] rounded-lg border border-white/20 shadow-lg overflow-hidden flex items-center justify-center">
                     <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
                     <Video size={14} className="text-white/30" />
                     <div className="absolute bottom-1 left-1.5 text-[8px] bg-black/60 px-1 rounded text-white">You</div>
                  </div>
                </div>
                
                {/* Action Bar */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                    <button className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Video size={16} className="text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Headphones size={16} className="text-zinc-400" />
                    </button>
                  </div>
                  
                  <div className="relative w-full max-w-[200px] ml-4">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                      readOnly
                    />
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center">
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — QUOTE CARD
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-28 max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white text-black rounded-2xl p-10 text-center shadow-xl"
          >
            <p className="text-xl md:text-2xl font-medium leading-snug mb-5"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              In a world of curated feeds and filtered connections, a random encounter with a stranger is not a distraction. It's a reminder that the world is bigger than your algorithm.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xl mx-auto">
              We built Vibe for the unscripted moment. The unexpected laugh.
              The conversation you didn't plan and couldn't forget.
              That's who we build for.
            </p>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — FEATURE CARDS
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-28 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-semibold mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Connections that happen in real time
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
              Everything is built for the moment — anonymous, instant, and ephemeral.
              No friction between you and the next conversation.
            </p>
          </motion.div>

          {/* Feature Card Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map(({ icon: Icon, title, desc }, i) => {
              const isHighlighted = i === 1; // "Instant matching" highlighted
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-2xl p-6 border transition-all ${
                    isHighlighted
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900/50 text-white border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`mb-4 ${isHighlighted ? 'text-zinc-500' : 'text-zinc-500'}`}
                  />
                  <p className={`font-semibold text-base mb-2 ${isHighlighted ? 'text-black' : 'text-white'}`}>
                    {title}
                  </p>
                  <p className={`text-sm leading-relaxed ${isHighlighted ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — HOW IT WORKS (Sticky Scroll)
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-32 max-w-6xl mx-auto w-full relative z-10">
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 md:mb-24"
            >
              <h2
                className="text-4xl md:text-5xl font-normal mb-5"
                style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
              >
                From zero to connected
              </h2>
              <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
                No setup. No registration. No friction built into every step from the first click to the last goodbye.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start relative">
              {/* Left Sidebar - Sticky */}
              <div className="flex flex-col gap-2 min-w-[220px] shrink-0 sticky top-32 hidden md:flex">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`text-left px-5 py-3.5 rounded-xl text-sm transition-all duration-300 ${
                      activeStep === step.id
                        ? 'bg-white text-black font-semibold shadow-lg scale-105'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              {/* Right Detail - Scrollable List */}
              <div className="flex-1 flex flex-col gap-32 md:pb-32">
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    id={`step-${step.id}`}
                    onViewportEnter={() => setActiveStep(step.id)}
                    viewport={{ margin: "-40% 0px -40% 0px", amount: 'some' }}
                    className="flex flex-col transition-opacity duration-500"
                    style={{ opacity: activeStep === step.id ? 1 : 0.4 }}
                  >
                    <p className="text-[11px] tracking-[0.2em] text-zinc-500 font-semibold uppercase mb-4">
                      {step.number} &nbsp; {step.eyebrow}
                    </p>
                    <h3
                      className="text-3xl md:text-4xl font-normal text-white mb-6 leading-tight"
                      style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-xl">
                      {step.body}
                    </p>
                    <ul className="space-y-4">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-zinc-300">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                             <Check size={12} className="text-white" />
                          </div>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — WHAT WE MEASURE
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-28 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              What we measure
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
              Every call starts with speed and ends with privacy. Reduced wait times,
              eliminated data retention, and a consistent experience for everyone.
            </p>
          </motion.div>

          {/* 3 metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6"
              >
                <p className="font-semibold text-sm text-white mb-3">{title}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom quote card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white text-black rounded-2xl p-8 text-center"
          >
            <p className="text-base md:text-lg text-zinc-700 leading-relaxed max-w-2xl mx-auto">
              Social algorithms know what you like. They keep showing you more of it. Vibe is the opposite —
              the person on the other side is someone you'd never have found any other way.
              That's not a bug. <strong className="text-black">That's the feature.</strong>
            </p>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — FINAL CTA
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-28 max-w-3xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl font-semibold mb-5"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              The next conversation is<br />one click away.
            </h2>
            <p className="text-zinc-500 text-sm mb-8">
              No account needed. Works in any modern browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/setup/video')}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-zinc-100 transition-colors text-base"
              >
                <Video size={18} />
                Start a Video Call
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/setup/audio')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                <Globe size={14} />
                Voice Only Mode
              </button>
            </div>
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <Footer />
      </div>
    </div>
  );
}
