import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <div className="w-full px-4 md:px-6 pb-8 mt-12">
      <footer className="w-full max-w-7xl mx-auto bg-[#15171B] border border-white/10 rounded-[2rem] py-12 px-8 lg:px-12 text-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-base tracking-tight">
            <img 
              src="https://i.pinimg.com/736x/bf/f9/90/bff990bfc21bdc142b69c6ed28b53b6d.jpg" 
              alt="Vibelly Logo" 
              className="w-10 h-10 rounded-full object-cover shadow-lg shadow-black/50" 
            />
            <span className='text-2xl font-serif font-black'>Vibelly</span>
          </Link>
          <p className="text-zinc-500 leading-relaxed max-w-xs">
            Connect instantly with verified users globally. Next-gen premium matching for real conversations.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact Us</Link>
          <Link to="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms & Conditions</Link>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <h4 className="text-white font-semibold mb-2">Contact Us</h4>
          <div className="flex items-start gap-3 text-zinc-400">
            <MapPin className="w-5 h-5 shrink-0 text-white mt-0.5" />
            <p>123 Innovation Drive, Tech Park<br/>Silicon Valley, CA 94025<br/>United States</p>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Mail className="w-5 h-5 shrink-0 text-white" />
            <p>support@vibeapp.com</p>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Phone className="w-5 h-5 shrink-0 text-white" />
            <p>+1 (555) 123-4567</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500">
        <p>© {new Date().getFullYear()} Vibelly Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
        </div>
      </footer>
    </div>
  );
}
