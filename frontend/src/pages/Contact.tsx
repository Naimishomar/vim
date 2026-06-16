import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#15171B] text-white font-sans flex flex-col relative">
      {/* ─── Dot Grid ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, white 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 w-full flex flex-col items-center">
        <Navbar />
      </div>
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full pt-20 px-6 pb-32">
        <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>Contact Us</h1>
        <p className="text-zinc-400 mb-12 text-lg">We're here to help. Reach out to us through any of the channels below.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Office Address</h3>
                <p className="text-zinc-400">123 Innovation Drive, Tech Park<br/>Silicon Valley, CA 94025<br/>United States</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <p className="text-zinc-400">support@vibeapp.com<br/>business@vibeapp.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                <p className="text-zinc-400">+1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm PST</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                <input required type="text" className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                <input required type="email" className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                <textarea required rows={4} className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-xl transition-colors mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
