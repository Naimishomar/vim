import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
}

export default function SEO({ 
  title, 
  description = 'Vibelly is the ultimate free alternative to Omegle and OmeTV. Instantly connect with strangers worldwide through high-quality random video calling and chat.', 
  canonicalUrl,
  type = 'website',
  imageUrl = 'https://i.pinimg.com/736x/bf/f9/90/bff990bfc21bdc142b69c6ed28b53b6d.jpg'
}: SEOProps) {
  const siteUrl = 'https://vibelly.vercel.app';
  const url = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data for Articles */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [imageUrl],
            "datePublished": new Date().toISOString(),
            "author": [{
              "@type": "Organization",
              "name": "Vibelly",
              "url": siteUrl
            }]
          })}
        </script>
      )}
    </Helmet>
  );
}
