import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Video, Headphones, ArrowRight, Shield,
  Zap, MessageSquare, SkipForward, Globe, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">

      {/* ─── Dot Grid ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
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
            className="text-[10px] tracking-[0.25em] text-zinc-500 font-semibold uppercase mb-7"
          >
            Random Video &amp; Voice Chat
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.08] mb-7"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Meet someone new.
            <br />
            Right now.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base text-zinc-400 mb-10 max-w-lg leading-relaxed"
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
              onClick={() => navigate('/call/video')}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-medium hover:bg-zinc-100 transition-colors"
            >
              Start Video Call
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/call/audio')}
              className="flex items-center gap-2 bg-zinc-800/60 text-white border border-zinc-700 px-6 py-2.5 rounded-md font-medium hover:bg-zinc-800 transition-colors"
            >
              <Headphones size={16} />
              Voice Only
            </button>
          </motion.div>
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
            SECTION 4 — HOW IT WORKS (step sidebar)
        ══════════════════════════════════════════ */}
        <section className="px-6 pb-28 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl md:text-4xl font-semibold mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              From zero to connected
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
              No setup. No registration. No friction built into every step from the first click to the last goodbye.
            </p>
          </motion.div>

          <div className="flex gap-10">
            {/* Step Nav — left sidebar */}
            <div className="flex flex-col gap-1 min-w-[180px] shrink-0">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                    activeStep === step.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Step Detail — right */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 border-t border-zinc-800 pt-6"
            >
              <p className="text-[10px] tracking-[0.2em] text-zinc-600 font-semibold uppercase mb-3">
                {activeStepData.number} &nbsp; {activeStepData.eyebrow}
              </p>
              <h3
                className="text-xl md:text-2xl font-semibold text-white mb-4 leading-snug"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {activeStepData.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-lg">
                {activeStepData.body}
              </p>
              <ul className="space-y-2">
                {activeStepData.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
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
                onClick={() => navigate('/call/video')}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-zinc-100 transition-colors text-base"
              >
                <Video size={18} />
                Start a Video Call
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/call/audio')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                <Globe size={14} />
                Voice Only Mode
              </button>
            </div>
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-700">
          © {new Date().getFullYear()} Vibe &nbsp;·&nbsp; Anonymous video chat &nbsp;·&nbsp; No data retained
        </footer>
      </div>
    </div>
  );
}
