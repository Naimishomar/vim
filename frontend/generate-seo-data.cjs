const fs = require('fs');
const path = require('path');

const platforms = [
  'Omegle', 'OmeTV', 'Chatroulette', 'CooMeet', 'Emerald Chat', 
  'Monkey App', 'Chatki', 'ChatRandom', 'Shagle', 'CamSurf'
];

const locations = [
  // US States
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
  'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Wisconsin',
  'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah',
  
  // Top US Cities
  'New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington DC',
  'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
  'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento', 'Atlanta', 'Kansas City', 'Colorado Springs', 'Miami',
  'Raleigh', 'Omaha', 'Long Beach', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans',

  // Top UK Cities & Regions
  'London', 'Birmingham', 'Manchester', 'Glasgow', 'Newcastle', 'Sheffield', 'Liverpool', 'Leeds', 'Bristol', 'Edinburgh',
  'Leicester', 'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Nottingham', 'Derby', 'Southampton', 'Portsmouth', 'Plymouth',
  'Scotland', 'Wales', 'Northern Ireland', 'England',

  // Top Canada Cities & Provinces
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
  'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Nova Scotia',

  // Top Australia Cities & States
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle AU', 'Wollongong', 'Logan City',
  'New South Wales', 'Victoria', 'Queensland', 'Western Australia',

  // Top India Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',

  // Other Global Countries & Regions
  'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Mexico', 'South Africa', 'New Zealand', 'Ireland', 'Philippines',
  'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Turkey', 'Egypt', 'Nigeria',
  'Argentina', 'Colombia', 'Chile', 'Peru', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Poland', 'Greece', 'Portugal', 'Saudi Arabia', 'UAE', 'Dubai', 'Israel', 'Morocco',
  
  // Extra Global Cities
  'Paris', 'Berlin', 'Rome', 'Madrid', 'Barcelona', 'Milan', 'Munich', 'Frankfurt', 'Amsterdam', 'Brussels',
  'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Warsaw', 'Prague', 'Budapest', 'Vienna', 'Athens', 'Lisbon',
  'Tokyo', 'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 'Taipei', 'Bangkok', 'Manila', 'Jakarta', 'Kuala Lumpur',
  'Sao Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Bogota', 'Lima', 'Santiago', 'Mexico City', 'Cairo', 'Lagos', 'Istanbul'
];

const niches = [
  'Anime', 'Gaming', 'Music', 'Movies', 'Sports', 'Art', 'Kpop', 'Tech', 'Fitness', 'Travel', 'Coding', 'Roleplay', 
  'Language Learning', 'Studying', 'Cosplay', 'LGBTQ', 'Introverts', 'Extroverts', 'College Students', 'Teens',
  'Adults', 'Singles', 'Couples', 'Gamers', 'Musicians', 'Artists', 'Writers', 'Developers', 'Designers', 'Entrepreneurs',
  'Crypto', 'Web3', 'AI Enthusiasts', 'Dog Lovers', 'Cat Lovers', 'Foodies', 'Vegans', 'Gym Bros', 'Astrology', 'Fashion',
  'Makeup', 'Skincare', 'Photography', 'Videography', 'Vlogging', 'Streaming', 'Twitch', 'YouTube', 'TikTok', 'Instagram'
];

const verbs = ['Talk', 'Chat', 'Speak', 'Meet', 'Connect', 'Video Call', 'Voice Chat', 'Text Chat', 'Hang Out', 'Make Friends'];
const nouns = ['Strangers', 'New People', 'Girls', 'Boys', 'Friends', 'Locals', 'Foreigners', 'Students', 'Singles', 'Like-minded people'];
const features = ['Without Login', 'For Free', 'Anonymous', 'HD Video', 'Online', 'No Sign Up', 'Fast Connection', 'Safe', 'Private', 'Without App'];

const seoData = {};

function addPage(slug, data) {
  seoData[slug] = data;
}

// 1. Platform Alternatives by Location (10 * 200 = 2000 pages)
platforms.forEach(platform => {
  locations.forEach(loc => {
    const slug = `${platform.toLowerCase().replace(/\s+/g, '-')}-alternative-${loc.toLowerCase().replace(/\s+/g, '-')}`;
    addPage(slug, {
      title: `${platform} Alternative ${loc} | Free Video Chat`,
      desc: `Looking for the best ${platform} alternative in ${loc}? Meet strangers instantly with our free random video chat app tailored for ${loc} users.`,
      tagline: `The #1 ${platform} Alternative in ${loc}`,
      h1: `${platform} Alternative ${loc}`,
      subH1: `Connect instantly with thousands of users across ${loc}.`
    });
  });
});

// 2. Random Video Chat by Location (1 * 200 = 200 pages)
locations.forEach(loc => {
  const slug = `random-video-chat-${loc.toLowerCase().replace(/\s+/g, '-')}`;
  addPage(slug, {
    title: `Random Video Chat in ${loc} | Meet Strangers Online`,
    desc: `Find friends and meet strangers in ${loc}. The best free random video chat platform for people in ${loc} to connect instantly.`,
    tagline: `Video Chat in ${loc}`,
    h1: `Random Video Chat ${loc}`,
    subH1: `Meet amazing people who live in or love ${loc}.`
  });
});

// 3. Random Video Chat by Niche (1 * 50 = 50 pages)
niches.forEach(niche => {
  const slug = `random-video-chat-${niche.toLowerCase().replace(/\s+/g, '-')}`;
  addPage(slug, {
    title: `Random Video Chat for ${niche} Fans | Meet Strangers`,
    desc: `Find friends who love ${niche}. The best random video chat and anonymous messaging platform for ${niche} enthusiasts worldwide.`,
    tagline: `Connect over ${niche}`,
    h1: `Random Video Chat for ${niche}`,
    subH1: `Meet people who share your passion for ${niche}.`
  });
});

// 4. Platform Alternatives by Niche (10 * 50 = 500 pages)
platforms.forEach(platform => {
  niches.forEach(niche => {
    const slug = `${platform.toLowerCase().replace(/\s+/g, '-')}-alternative-for-${niche.toLowerCase().replace(/\s+/g, '-')}`;
    addPage(slug, {
      title: `${platform} Alternative for ${niche} | Free Video Chat`,
      desc: `The perfect ${platform} alternative for ${niche} lovers. Connect instantly via random video chat with people who share your interests.`,
      tagline: `${platform} Alternative: ${niche}`,
      h1: `${platform} Alternative for ${niche}`,
      subH1: `The best place to meet other ${niche} fans online.`
    });
  });
});

// 5. Feature based keywords (1 * 10 = 10 pages)
features.forEach(feature => {
  const slug = `free-random-video-chat-${feature.toLowerCase().replace(/\s+/g, '-')}`;
  addPage(slug, {
    title: `Free Random Video Chat ${feature} | Instant Connection`,
    desc: `Experience the best free random video chat ${feature.toLowerCase()}. Talk to strangers globally with one click and zero hassle.`,
    tagline: `Video Chat ${feature}`,
    h1: `Random Video Chat ${feature}`,
    subH1: `The fastest way to talk to strangers ${feature.toLowerCase()}.`
  });
});

// 6. Action based combinations (10 * 10 = 100 pages)
verbs.forEach(verb => {
  nouns.forEach(noun => {
    const slug = `${verb.toLowerCase().replace(/\s+/g, '-')}-to-${noun.toLowerCase().replace(/\s+/g, '-')}-online`;
    addPage(slug, {
      title: `${verb} to ${noun} Online | Free Chat`,
      desc: `Want to ${verb.toLowerCase()} to ${noun.toLowerCase()} online? Our random video chat makes it incredibly easy and safe to meet people across the globe.`,
      tagline: `${verb.toUpperCase()} TO ${noun.toUpperCase()}`,
      h1: `${verb} to ${noun} Online`,
      subH1: `Start connecting and meeting new people in seconds.`
    });
  });
});

// 7. Action + Location (10 * 10 * 200 = 20,000 pages - TOO MANY, Let's limit to top 5 verbs and top 5 nouns for top 50 locations)
const topVerbs = ['Talk', 'Chat', 'Meet', 'Video Call'];
const topNouns = ['Strangers', 'Girls', 'Boys', 'Locals'];
const topLocs = locations.slice(0, 50);

topVerbs.forEach(verb => {
  topNouns.forEach(noun => {
    topLocs.forEach(loc => {
      const slug = `${verb.toLowerCase().replace(/\s+/g, '-')}-to-${noun.toLowerCase().replace(/\s+/g, '-')}-in-${loc.toLowerCase().replace(/\s+/g, '-')}`;
      addPage(slug, {
        title: `${verb} to ${noun} in ${loc} | Free Video Chat`,
        desc: `Looking to ${verb.toLowerCase()} to ${noun.toLowerCase()} in ${loc}? Join thousands of users on the safest random video chat platform.`,
        tagline: `${verb} to ${noun} - ${loc}`,
        h1: `${verb} to ${noun} in ${loc}`,
        subH1: `The fastest way to meet people from ${loc}.`
      });
    });
  });
}); // 4 * 4 * 50 = 800 pages

// Total Pages Generated: 2000 + 200 + 50 + 500 + 10 + 100 + 800 = 3660 pages. Let's add more locations or combos to hit 5000+

// 8. OmeTV Alternative by Location (1 * 200 = 200) - already covered in loop 1.
// 9. "Chat with Strangers" + feature (1 * 10 = 10)
features.forEach(feature => {
  const slug = `chat-with-strangers-${feature.toLowerCase().replace(/\s+/g, '-')}`;
  addPage(slug, {
    title: `Chat with Strangers ${feature} | Free Random Chat`,
    desc: `Chat with strangers ${feature.toLowerCase()} online. Connect instantly via text or high-quality video.`,
    tagline: `Chat ${feature}`,
    h1: `Chat with Strangers ${feature}`,
    subH1: `Experience anonymous connections instantly.`
  });
});

// 10. "Omegle App" / "OmeTV App" keywords
platforms.forEach(platform => {
  const slug = `best-${platform.toLowerCase().replace(/\s+/g, '-')}-app`;
  addPage(slug, {
    title: `Best ${platform} App Alternative | Mobile Video Chat`,
    desc: `Looking for the best ${platform} app alternative for iOS and Android? Vibelly works flawlessly on mobile browsers.`,
    tagline: `Best ${platform} App`,
    h1: `Best ${platform} App Alternative`,
    subH1: `Works on all devices without any downloads.`
  });
});

// Ensure directory exists
const dir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'seoPages.json'), JSON.stringify(seoData, null, 2));

console.log(`Generated ${Object.keys(seoData).length} SEO pages.`);
