const fs = require('fs');
const path = require('path');

const filesToFix = [
  'AnonymousChat.tsx',
  'ChatWithGirls.tsx',
  'RandomVideoChat.tsx',
  'TalkToStrangers.tsx',
  'VideoChatOnline.tsx'
];

const faqsTemplate = `faqs={[
          {
            question: "Do I need to sign up?",
            answer: "No, you don't need to sign up or provide any personal information to start using the random video chat. Just click start and instantly connect with strangers worldwide."
          },
          {
            question: "Is it safe to use?",
            answer: "We prioritize user safety above all else. We use advanced moderation tools and allow users to report inappropriate behavior instantly, ensuring a safe and clean environment."
          },
          {
            question: "Can I use it on my phone?",
            answer: "Absolutely. Our platform is fully optimized for mobile browsers, meaning you can enjoy seamless video chat on your iPhone or Android device without downloading any apps."
          }
        ]}`;

for (const file of filesToFix) {
  const filePath = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix imports
  content = content.replace(/ArrowRight,\s*/g, '');
  content = content.replace(/CheckCircle2,\s*/g, '');
  content = content.replace(/XCircle\s*/g, '');
  content = content.replace(/,\s*\} from 'lucide-react'/g, "} from 'lucide-react'");
  
  // Fix FAQSection
  content = content.replace(/<FAQSection \/>/g, `<FAQSection ${faqsTemplate} />`);
  
  fs.writeFileSync(filePath, content);
}

console.log('Fixed TS errors in generated pages.');
