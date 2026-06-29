"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Blog_1 = require("../models/Blog");
const env_1 = require("../config/env");
const topics = [
    "Random Video Chat", "Omegle Alternatives", "Meeting Strangers Online", "WebRTC Technology", "Online Safety",
    "Voice Chat Apps", "Social Anxiety", "Making Friends Online", "Digital Privacy", "Internet Culture", "The End of Omegle",
    "Free Video Chat With Strangers", "Cam to Cam Chat", "Anonymous Chat Rooms", "Chatroulette Alternatives",
    "OmeTV App Alternatives", "Bazoocam Alternatives", "Emerald Chat Alternatives", "Monkey App Alternatives",
    "Chathub Alternatives", "Video Chat Roulette", "Talk to Strangers Free", "No Registration Video Call",
    "Video Chat Without Login", "Omegle Unbanned", "Random Audio Call Apps", "WebRTC Peer to Peer Chat",
    "Meet New People Online", "Best Apps to Make Friends"
];
const templates = [
    {
        title: "The Ultimate Guide to {topic} in 2026",
        desc: "Everything you need to know about {topic}. Discover the latest trends, safety tips, and the best platforms.",
        content: "## The Rise of {topic}\n\nThe world of {topic} has evolved rapidly. Users are demanding higher quality connections and better privacy.\n\n### Why it Matters\nWhen engaging with {topic}, the most important factor is finding a platform that uses modern tech. \n\n### Best Practices\n- Always protect your personal data.\n- Look for apps with AI moderation.\n- Be respectful to others.\n\nAs {topic} continues to grow, we can expect even more exciting features in the future."
    },
    {
        title: "5 Reasons Why {topic} is Better Than Ever",
        desc: "Think {topic} is dead? Think again. Here are 5 reasons why it's making a massive comeback.",
        content: "## {topic} is Back\n\nMany people thought the golden age of {topic} ended years ago. But thanks to new platforms like Vibelly, it's back and better than ever.\n\n### 1. HD Quality\nGone are the days of pixelated 360p video.\n\n### 2. Zero Bots\nAI moderation has completely changed {topic}.\n\n### 3. Instant Connections\nNode.js and Redis make matching instant.\n\n### 4. True Anonymity\nNo Facebook login required.\n\n### 5. Global Reach\nTalk to someone in Tokyo, then Paris, then New York.\n\n### Conclusion\nIf you haven't tried {topic} recently, you are missing out."
    },
    {
        title: "How to Stay Safe During {topic}",
        desc: "Safety first. Our top tips for protecting your identity and enjoying {topic} without worry.",
        content: "## Navigating {topic} Safely\n\nWith millions of users engaging in {topic} daily, it's crucial to understand the risks and how to avoid them.\n\n### Rule 1: No Personal Info\nNever share your full name, address, or social media handles during {topic}.\n\n### Rule 2: Use VPNs\nIf you aren't using a modern platform with WebRTC proxies, always use a VPN.\n\n### Rule 3: Trust your gut\nIf a conversation makes you uncomfortable, just hit skip.\n\nStay safe out there!"
    },
    {
        title: "The History of {topic}: From 2009 to Today",
        desc: "Take a trip down memory lane as we explore the wild history and evolution of {topic}.",
        content: "## The Early Days of {topic}\n\nIt all started in the late 2000s. Platforms were clunky, flash-based, and unmoderated. But the magic of {topic} was undeniable.\n\n### The Golden Era\nBy 2012, {topic} was mainstream. Celebrities were doing it, YouTubers were making videos about it, and it was a cultural phenomenon.\n\n### The Decline\nEventually, bad actors and bots ruined the experience. The original pioneers of {topic} failed to adapt.\n\n### The Renaissance\nToday, modern tech stacks have revived {topic}. It's faster, safer, and more beautiful than ever."
    },
    {
        title: "Why Introverts Love {topic}",
        desc: "It might sound counter-intuitive, but {topic} is actually the perfect social outlet for introverts.",
        content: "## {topic} for the Socially Anxious\n\nFor introverts, traditional socializing can be exhausting. That's why {topic} is such a game-changer.\n\n### Low Stakes\nYou don't have to perform. You don't have to maintain a relationship. It's just a 5-minute conversation.\n\n### Complete Control\nIf you get overwhelmed, you just click 'Next'. You are entirely in control of your environment.\n\n### Practice Makes Perfect\nMany users find that {topic} helps them build social skills in a zero-pressure environment."
    }
];
const generateBlogs = () => {
    const blogs = [];
    let counter = 1;
    // Generate 55 blogs (11 topics * 5 templates)
    for (const topic of topics) {
        for (const template of templates) {
            const title = template.title.replace(/{topic}/g, topic);
            const description = template.desc.replace(/{topic}/g, topic);
            const content = template.content.replace(/{topic}/g, topic);
            // Generate a unique slug
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            blogs.push({
                slug,
                title,
                description,
                content,
                author: 'Vibelly Team',
                date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
            counter++;
        }
    }
    // Add a few highly specific SEO ones at the top
    blogs.unshift({
        slug: 'best-omegle-alternative-2026',
        title: 'The Best Omegle Alternative in 2026',
        description: 'Omegle is gone. Here is the absolute best alternative to use right now.',
        content: '## Omegle is Dead\n\nWhen Omegle shut down, it left a huge hole. But Vibelly has stepped up as the ultimate replacement.\n\n### Why Vibelly?\n- No registration\n- Free forever\n- HD Video\n- AI Moderation\n\nTry it today!',
        author: 'Vibelly Editorial',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    return blogs;
};
const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
        console.log('Connected!');
        console.log('Clearing old blogs...');
        await Blog_1.Blog.deleteMany({});
        console.log('Generating new blogs...');
        const blogs = generateBlogs();
        console.log(`Inserting ${blogs.length} blogs into database...`);
        await Blog_1.Blog.insertMany(blogs);
        console.log('Seeding complete! Successfully added 50+ blogs.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDB();
//# sourceMappingURL=seedBlogs.js.map