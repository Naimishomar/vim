const fs = require('fs');
const path = require('path');

const keywords = [];
const countries = ['USA', 'UK', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Brazil', 'Mexico', 'Spain', 'Italy', 'South Africa', 'New Zealand', 'Ireland', 'Philippines'];
const interests = ['Anime', 'Gaming', 'Music', 'Movies', 'Sports', 'Art', 'Kpop', 'Tech', 'Fitness', 'Travel', 'Coding', 'Roleplay', 'Language Learning', 'Studying', 'Cosplay'];
const platforms = ['Omegle', 'OmeTV', 'Chatroulette', 'CooMeet', 'Emerald Chat', 'Monkey App'];
const features = ['Without Login', 'With Strangers', 'For Free', 'Anonymous', 'HD Video', 'Online', 'No Sign Up', 'Fast Connection', 'Safe', 'Private'];

const seoData = {};

// 1. Platform Alternatives by Country (e.g. Omegle Alternative USA)
platforms.forEach(platform => {
  countries.forEach(country => {
    const slug = `${platform.toLowerCase().replace(/\s+/g, '-')}-alternative-${country.toLowerCase().replace(/\s+/g, '-')}`;
    seoData[slug] = {
      title: `${platform} Alternative ${country} | Free Video Chat`,
      desc: `Looking for the best ${platform} alternative in ${country}? Meet strangers instantly with our free random video chat app tailored for ${country} users.`,
      tagline: `The #1 ${platform} Alternative in ${country}`,
      h1: `${platform} Alternative ${country}`,
      subH1: `Connect instantly with thousands of users across ${country}.`
    };
  });
});

// 2. Chat by Interest (e.g. Random Video Chat for Gaming)
interests.forEach(interest => {
  const slug = `random-video-chat-${interest.toLowerCase().replace(/\s+/g, '-')}`;
  seoData[slug] = {
    title: `Random Video Chat for ${interest} Fans | Meet Strangers`,
    desc: `Find friends who love ${interest}. The best random video chat and anonymous messaging platform for ${interest} enthusiasts worldwide.`,
    tagline: `Connect over ${interest}`,
    h1: `Random Video Chat for ${interest}`,
    subH1: `Meet people who share your passion for ${interest}.`
  };
});

// 3. Feature based keywords
features.forEach(feature => {
  const slug = `free-random-video-chat-${feature.toLowerCase().replace(/\s+/g, '-')}`;
  seoData[slug] = {
    title: `Free Random Video Chat ${feature} | Instant Connection`,
    desc: `Experience the best free random video chat ${feature.toLowerCase()}. Talk to strangers globally with one click and zero hassle.`,
    tagline: `Video Chat ${feature}`,
    h1: `Random Video Chat ${feature}`,
    subH1: `The fastest way to talk to strangers ${feature.toLowerCase()}.`
  };
});

// 4. Stranger chat variations
['talk', 'chat', 'speak', 'meet'].forEach(verb => {
  ['strangers', 'new people', 'girls', 'boys', 'friends'].forEach(noun => {
    const slug = `${verb}-to-${noun.replace(/\s+/g, '-')}-online`;
    seoData[slug] = {
      title: `${verb.charAt(0).toUpperCase() + verb.slice(1)} to ${noun.charAt(0).toUpperCase() + noun.slice(1)} Online | Free Chat`,
      desc: `Want to ${verb} to ${noun} online? Our random video chat makes it incredibly easy and safe to meet people across the globe.`,
      tagline: `${verb.toUpperCase()} TO ${noun.toUpperCase()}`,
      h1: `${verb.charAt(0).toUpperCase() + verb.slice(1)} to ${noun.charAt(0).toUpperCase() + noun.slice(1)} Online`,
      subH1: `Start connecting and meeting new people in seconds.`
    };
  });
});

// Ensure directory exists
const dir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'seoPages.json'), JSON.stringify(seoData, null, 2));

console.log(`Generated ${Object.keys(seoData).length} SEO pages.`);
