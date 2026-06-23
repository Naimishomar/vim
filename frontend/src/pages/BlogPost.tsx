import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
}

const renderMarkdown = (content: string) => {
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold mt-10 mb-4 text-white" style={{ fontFamily: 'Georgia, serif' }}>{trimmed.slice(4)}</h3>;
    if (trimmed.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold mt-12 mb-6 text-white" style={{ fontFamily: 'Georgia, serif' }}>{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith('- ')) return <li key={i} className="ml-6 list-disc mb-2 text-zinc-300">{trimmed.slice(2)}</li>;
    if (trimmed.match(/^[0-9]+\.\s/)) return <h3 key={i} className="text-xl font-semibold mt-8 mb-4 text-white">{trimmed}</h3>;
    if (trimmed === '') return null;
    
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="mb-5 leading-relaxed text-zinc-400 text-lg">
        {parts.map((p, j) => p.startsWith('**') ? <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong> : p)}
      </p>
    );
  });
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlog = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15171B] flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#15171B] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-zinc-400 hover:text-white underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15171B] text-white flex flex-col font-sans">
      <SEO 
        title={`${post.title} | Vibelly Blog`}
        description={post.description}
        canonicalUrl={`/blog/${post.slug}`}
        type="article"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 py-20 md:py-32 max-w-3xl mx-auto w-full">
          <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12">
            <ArrowLeft size={16} />
            Back to all articles
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-zinc-500 font-medium mb-4">{post.date} • By {post.author}</div>
            <h1 className="text-4xl md:text-5xl font-normal leading-tight mb-8" style={{ fontFamily: '"Playfair Display", "Merriweather", "Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              {post.title}
            </h1>
            
            <div className="w-full h-px bg-white/10 mb-12"></div>

            <div className="article-content">
              {renderMarkdown(post.content)}
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
