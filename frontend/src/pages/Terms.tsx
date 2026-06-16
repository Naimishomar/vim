import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#15171B] text-white font-sans flex flex-col relative">
      <SEO 
        title="Terms of Service & Privacy Policy | Vibelly" 
        description="Read the terms of service and privacy policy for Vibelly. We prioritize your anonymity and data protection."
        canonicalUrl="/terms"
      />
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
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full pt-20 px-6 pb-32">
        <h1 className="text-5xl md:text-6xl font-normal mb-8" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>Terms & Conditions</h1>
        <div className="space-y-6 text-zinc-300 leading-relaxed bg-black/20 p-8 md:p-12 rounded-[2rem] border border-white/5 backdrop-blur-sm shadow-2xl">
          <p className="text-lg">Welcome to Vibelly. By accessing our application, you agree to be bound by these terms. Please read them carefully before using our anonymous communication services.</p>
          
          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>1. Acceptable Use</h2>
          <p>You agree not to use the application for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the application in any way that could damage the site, the services or the general business of Vibelly. You must be at least 18 years old to use our platform.</p>
          
          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>2. Premium Subscriptions</h2>
          <p>Premium subscriptions are billed as specified at the time of purchase. All sales are final and non-refundable unless required by law. Subscriptions automatically grant access to premium features (like location selection and exclusive UI borders) for the precise duration of the billing cycle. If you purchase additional time while active, the remaining days will be mathematically added to your new expiry date.</p>
          
          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>3. User Conduct</h2>
          <p>Vibelly is a platform for respectful communication. We reserve the right to ban users who exhibit inappropriate behavior, harassment, hate speech, or violate community guidelines on video and audio calls. Nudity and explicit content on camera are strictly forbidden.</p>

          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>4. Ephemeral Data & Privacy</h2>
          <p>By default, Vibelly operates as an anonymous communication tool. Your peer-to-peer video streams and socket-based text chats are ephemeral. We do not record or retain chat history or video feeds after the session is terminated. However, we do store account identifiers, premium status, and reporting metadata to enforce community safety.</p>

          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>5. Account Termination</h2>
          <p>We reserve the right to suspend or terminate your account without notice or liability for any reason, including if you breach the Terms. Upon termination, your right to use the Service will immediately cease. Premium subscription fees will not be refunded in the event of an account ban due to Terms of Service violations.</p>

          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>6. Limitation of Liability</h2>
          <p>In no event shall Vibelly, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          
          <h2 className="text-3xl md:text-4xl font-normal text-white mt-12 mb-6" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>7. Dispute Resolution</h2>
          <p>Any disputes arising out of or related to these Terms or the Service will be governed by the laws of the State of California, United States, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located within Silicon Valley, California for the purpose of litigating all such claims or disputes.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
