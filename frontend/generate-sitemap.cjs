const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
const seoDataPath = path.join(__dirname, 'src', 'data', 'seoPages.json');

const seoData = JSON.parse(fs.readFileSync(seoDataPath, 'utf8'));
const slugs = Object.keys(seoData);

const baseUrl = 'https://vibelly.vercel.app';
const currentDate = new Date().toISOString().split('T')[0];

const hardcodedPaths = [
  '/',
  '/pricing',
  '/terms',
  '/contact',
  '/omegle-alternative',
  '/ometv-alternative',
  '/chatroulette-alternative',
  '/omegle-unbanned',
  '/random-video-chat',
  '/talk-to-strangers',
  '/anonymous-chat',
  '/chat-with-girls',
  '/video-chat-online'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add hardcoded paths
hardcodedPaths.forEach(p => {
  xml += `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${p === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '/' ? '1.0' : '0.9'}</priority>
  </url>
`;
});

// Add dynamic paths
slugs.forEach(slug => {
  xml += `  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

xml += `</urlset>
`;

fs.writeFileSync(sitemapPath, xml);
console.log(`Generated sitemap with ${hardcodedPaths.length + slugs.length} URLs.`);
