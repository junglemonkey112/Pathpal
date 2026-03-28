export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface AvailableSlot {
  date: string;
  time: string;
  timezone: string;
}

export interface ServiceTier {
  name: string;
  duration: number; // minutes
  price: number;    // USD
  description: string;
}

export interface Counsellor {
  id: string;
  name: string;
  avatar: string;
  school: string;
  major: string;
  year: string;
  country: string;        // country of origin
  countryFlag: string;
  languages: string[];
  bio: string;
  myStory: string;        // personal narrative
  specialties: string[];
  services: ServiceTier[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  availableSlots: AvailableSlot[];
  studentSuccess: string[];  // schools students got into
  verificationStatus: "verified" | "pending" | "unverified";
  minGPA: number;
}

export const counsellors: Counsellor[] = [
  {
    id: "jessica-kim",
    name: "Jessica Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica-kim&backgroundColor=b6e3f4",
    school: "Stanford University",
    major: "Computer Science",
    year: "Junior",
    country: "South Korea",
    countryFlag: "🇰🇷",
    languages: ["English", "Korean"],
    bio: "CS junior at Stanford helping international students from Korea navigate STEM applications. I scored 1580 SAT, graduated top of my class in Seoul, and know exactly what US admissions officers want to see from Korean applicants.",
    myStory: "Growing up in Seoul, I dreamed of studying at a top US university but had no idea where to start. My parents weren't familiar with the US system, and the local hagwons gave generic advice that didn't fit my story. I spent two years researching on my own, cold-emailing Korean Stanford students, and eventually figuring out how to present my competitive programming background in a way that resonated with American admissions officers. When I got into Stanford, I cried for an hour. Now I'm paying it forward — I want every Korean student to have the guidance I had to piece together alone.",
    specialties: ["STEM Applications", "Competitive Programming", "Korean Student Transitions", "Computer Science Essays", "Research Experience"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min Q&A — school selection, timeline, quick essay feedback" },
      { name: "Deep Dive", duration: 60, price: 40, description: "60-min session — full application strategy, essay brainstorming, mock interviews" },
      { name: "Essay Package", duration: 90, price: 70, description: "90-min intensive — complete essay review, personal statement polish, supplementals" },
    ],
    rating: 4.9,
    reviewCount: 47,
    reviews: [
      { id: "r1", author: "Min-jun Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minjun", rating: 5, content: "Jessica helped me reframe my olympiad experience in a way that felt personal rather than just listing achievements. Got into CMU CS!", date: "2025-12-10" },
      { id: "r2", author: "Soyeon Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=soyeon", rating: 5, content: "She understood exactly what Korean students struggle with in personal statements. My essays became so much more authentic.", date: "2025-11-22" },
    ],
    availableSlots: [
      { date: "2026-04-07", time: "10:00 AM", timezone: "KST" },
      { date: "2026-04-08", time: "2:00 PM", timezone: "KST" },
      { date: "2026-04-10", time: "11:00 AM", timezone: "KST" },
      { date: "2026-04-12", time: "3:00 PM", timezone: "KST" },
    ],
    studentSuccess: ["MIT", "CMU", "Georgia Tech", "UC Berkeley", "UIUC"],
    verificationStatus: "verified",
    minGPA: 3.5,
  },

  {
    id: "marcus-chen",
    name: "Marcus Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-chen&backgroundColor=c0aede",
    school: "Harvard University",
    major: "Economics",
    year: "Senior",
    country: "China",
    countryFlag: "🇨🇳",
    languages: ["English", "Mandarin"],
    bio: "Harvard Economics senior from Shanghai. I navigated China's gaokao system AND the US application process simultaneously. I specialize in helping Chinese students tell their story beyond test scores.",
    myStory: "I was one of those students with near-perfect scores who got rejected from every top school in Round 1. I was devastated. The problem wasn't my academics — it was that my essays read like a list of achievements, not a human story. A Harvard student I found online spent one session with me ripping apart my personal statement, and I rebuilt it from scratch around something small: the reason I collect vintage maps. Harvard noticed. That one session changed everything, and it cost $40. That's why I believe in affordable peer counselling — the insights that matter most don't need to come from a $500/hour agency.",
    specialties: ["Chinese Student Applications", "Economics & Finance Essays", "Ivy League Strategy", "Gaokao to SAT Transition", "Interview Preparation"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min consultation — strategy, school list, quick feedback" },
      { name: "Deep Dive", duration: 60, price: 45, description: "60-min session — essay strategy, personal brand, Ivy positioning" },
      { name: "Application Review", duration: 90, price: 75, description: "Full application audit — all essays, activities list, recommendations strategy" },
    ],
    rating: 4.8,
    reviewCount: 63,
    reviews: [
      { id: "r1", author: "Xiaoyu Wang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoyu", rating: 5, content: "Marcus helped me find my authentic voice. My essays went from robotic to genuinely moving. Harvard waitlist → Yale accepted!", date: "2026-01-05" },
      { id: "r2", author: "Tingting Liu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tingting", rating: 5, content: "As a Chinese student I always struggled with 'standing out.' Marcus showed me exactly how to do it without feeling fake.", date: "2025-12-18" },
    ],
    availableSlots: [
      { date: "2026-04-07", time: "9:00 AM", timezone: "CST" },
      { date: "2026-04-09", time: "4:00 PM", timezone: "CST" },
      { date: "2026-04-11", time: "10:00 AM", timezone: "CST" },
      { date: "2026-04-13", time: "2:00 PM", timezone: "CST" },
    ],
    studentSuccess: ["Yale", "Columbia", "Penn", "Cornell", "Duke"],
    verificationStatus: "verified",
    minGPA: 3.6,
  },

  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki-tanaka&backgroundColor=d1f4e0",
    school: "MIT",
    major: "Electrical Engineering",
    year: "Junior",
    country: "Japan",
    countryFlag: "🇯🇵",
    languages: ["English", "Japanese"],
    bio: "MIT EE junior from Tokyo. I understand the unique challenges Japanese students face — from translating a Japanese school transcript to explaining club activities that don't exist in the US system.",
    myStory: "In Japan, standing out is culturally discouraged. 'The nail that sticks up gets hammered down' — I'd lived that proverb my whole life. When I started writing my MIT application, my essays were painfully humble, almost apologetic. I couldn't figure out how to brag without feeling like I was betraying my upbringing. A mentor helped me understand that American essays aren't about bragging — they're about sharing genuine perspective. Once I understood that, I stopped trying to sound American and started sounding like me: a kid from Tokyo who stayed up until 3am building robots not to win prizes, but because he found it genuinely magical. MIT accepted that kid.",
    specialties: ["Japanese Student Transitions", "Engineering Applications", "Science Olympiad & Research", "Japanese Transcript Interpretation", "STEM Personal Statements"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min Q&A focused on STEM applications and Japanese student challenges" },
      { name: "Deep Dive", duration: 60, price: 40, description: "60-min strategy session — essay development, activity framing, school selection" },
      { name: "Essay Intensive", duration: 90, price: 70, description: "90-min deep dive into personal statement + MIT/Caltech-specific supplements" },
    ],
    rating: 4.9,
    reviewCount: 29,
    reviews: [
      { id: "r1", author: "Haruto Sato", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=haruto", rating: 5, content: "Yuki understood my Japanese school context immediately. He helped me explain my robotics club in a way that made sense to US admissions. Got into Caltech!", date: "2025-12-30" },
      { id: "r2", author: "Aiko Fujimoto", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aikof", rating: 5, content: "Finally someone who understood why I struggled to 'sell myself.' Yuki's advice was culturally sensitive and incredibly practical.", date: "2025-11-14" },
    ],
    availableSlots: [
      { date: "2026-04-08", time: "11:00 AM", timezone: "JST" },
      { date: "2026-04-09", time: "3:00 PM", timezone: "JST" },
      { date: "2026-04-11", time: "9:00 AM", timezone: "JST" },
      { date: "2026-04-14", time: "1:00 PM", timezone: "JST" },
    ],
    studentSuccess: ["Caltech", "MIT", "Carnegie Mellon", "Georgia Tech", "UCSD"],
    verificationStatus: "verified",
    minGPA: 3.7,
  },

  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya-sharma&backgroundColor=ffd5dc",
    school: "Yale University",
    major: "Political Science",
    year: "Senior",
    country: "India",
    countryFlag: "🇮🇳",
    languages: ["English", "Hindi"],
    bio: "Yale Political Science senior from Mumbai. I help Indian students pursuing humanities and social sciences — a path less travelled but deeply rewarding for those whose passion doesn't fit a pre-med mould.",
    myStory: "Every adult in my life told me to do engineering or medicine. I wanted to study politics and international law. The pressure was enormous — relatives at family dinners, teachers, even my parents initially. My application essays were my chance to explain why I was choosing a different path, and to do it in a way that felt true to my Indian context while resonating with Yale's admissions committee. I wrote about the 2019 Indian elections, about sitting with my grandmother watching results come in and realizing that democracy is fragile and precious. Yale admitted me and offered a scholarship. Now I mentor Indian students who are also brave enough to follow less conventional paths.",
    specialties: ["Humanities & Social Science Applications", "Indian Student Context", "Political Science Essays", "Law School Prep", "Scholarship Applications"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min consultation — humanities school selection, essay themes, activity framing" },
      { name: "Deep Dive", duration: 60, price: 40, description: "60-min session — full essay strategy for humanities applicants" },
      { name: "Scholarship Package", duration: 90, price: 70, description: "90-min intensive — scholarship essays, financial aid strategy for Indian students" },
    ],
    rating: 4.8,
    reviewCount: 38,
    reviews: [
      { id: "r1", author: "Rohan Mehta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan", rating: 5, content: "Priya helped me defend my choice to study philosophy against everyone who expected engineering. My essays were honest and compelling. Brown accepted!", date: "2026-01-12" },
      { id: "r2", author: "Ananya Iyer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya", rating: 5, content: "She understood the unique pressure Indian students face to conform. My application finally reflected who I actually am.", date: "2025-12-01" },
    ],
    availableSlots: [
      { date: "2026-04-07", time: "2:00 PM", timezone: "IST" },
      { date: "2026-04-09", time: "10:00 AM", timezone: "IST" },
      { date: "2026-04-12", time: "4:00 PM", timezone: "IST" },
      { date: "2026-04-14", time: "11:00 AM", timezone: "IST" },
    ],
    studentSuccess: ["Brown", "Georgetown", "NYU", "Tufts", "Emory"],
    verificationStatus: "verified",
    minGPA: 3.4,
  },

  {
    id: "david-park",
    name: "David Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david-park&backgroundColor=b6e3f4",
    school: "Columbia University",
    major: "Pre-Medicine / Biology",
    year: "Junior",
    country: "South Korea",
    countryFlag: "🇰🇷",
    languages: ["English", "Korean"],
    bio: "Columbia pre-med junior from Busan. Helping Korean students navigate the pre-med path, from choosing the right US undergrad to building research experience that medical schools notice.",
    myStory: "I wanted to be a doctor since I was twelve, but I didn't know that American pre-med is a completely different system from the Korean path to medicine. In Korea, you apply directly to medical school. In the US, you choose an undergrad, build research experience, take the MCAT, and then apply. I spent months figuring this out alone, calling Korean-American doctors, reading Reddit threads at midnight. When I finally understood the system, I wrote a personal statement about this research journey itself — about the determination to understand a foreign system deeply enough to navigate it. Columbia's admissions committee said it was one of the most memorable essays they'd read. I want to give Korean pre-med hopefuls the roadmap I had to draw myself.",
    specialties: ["Pre-Med Applications", "Biology & Life Sciences", "Research Experience Strategy", "Korean Pre-Med Path", "Medical School Planning"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min Q&A — pre-med school selection, research strategy, timeline" },
      { name: "Deep Dive", duration: 60, price: 40, description: "60-min strategy session — complete pre-med application approach" },
      { name: "Research Strategy", duration: 90, price: 70, description: "90-min intensive — research opportunity finding, lab email templates, CV building" },
    ],
    rating: 4.7,
    reviewCount: 31,
    reviews: [
      { id: "r1", author: "Jisoo Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jisoo", rating: 5, content: "David completely demystified the US pre-med system for me. His roadmap saved me months of confusion. Got into Johns Hopkins!", date: "2025-11-28" },
      { id: "r2", author: "Taehyun Oh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taehyun", rating: 4, content: "Really appreciated someone who knew the Korean context. Practical and honest advice, no sugarcoating.", date: "2025-10-15" },
    ],
    availableSlots: [
      { date: "2026-04-08", time: "10:00 AM", timezone: "KST" },
      { date: "2026-04-10", time: "3:00 PM", timezone: "KST" },
      { date: "2026-04-12", time: "9:00 AM", timezone: "KST" },
      { date: "2026-04-15", time: "2:00 PM", timezone: "KST" },
    ],
    studentSuccess: ["Johns Hopkins", "Cornell", "Emory", "UVA", "Michigan"],
    verificationStatus: "verified",
    minGPA: 3.5,
  },

  {
    id: "sarah-williams",
    name: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-williams&backgroundColor=ffd5dc",
    school: "Princeton University",
    major: "English Literature",
    year: "Senior",
    country: "United States",
    countryFlag: "🇺🇸",
    languages: ["English", "Spanish"],
    bio: "Princeton English senior who has helped 50+ international students craft authentic, culturally resonant essays. I focus on the narrative craft — helping students whose first language isn't English find a voice that's powerful and genuinely theirs.",
    myStory: "I've been a writing tutor since I was sixteen. What I discovered helping international students at Princeton was that the problem was never English ability — it was confidence. Students who could write beautifully in their native language would freeze when writing in English, second-guessing every sentence, every word choice. My job became teaching them to trust their own voice in a second language. The most powerful college essays I've helped write were from a Japanese student who wrote about silence, a Chinese student who wrote about her grandmother's dumplings, and an Indian student who wrote about monsoon season. None of those essays tried to sound American. They sounded like themselves — and that's exactly why they worked.",
    specialties: ["Essay Narrative Craft", "Non-Native English Writers", "Personal Statement Storytelling", "Writing Voice Development", "Liberal Arts Applications"],
    services: [
      { name: "Essay Review", duration: 30, price: 25, description: "30-min focused essay feedback — structure, voice, impact" },
      { name: "Writing Session", duration: 60, price: 40, description: "60-min collaborative writing session — brainstorm, draft, refine" },
      { name: "Full Essay Package", duration: 90, price: 60, description: "90-min intensive — personal statement + 3 supplements, complete revision" },
    ],
    rating: 5.0,
    reviewCount: 54,
    reviews: [
      { id: "r1", author: "Mei Zhang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meiz", rating: 5, content: "Sarah helped me write in English the way I think in Chinese — with texture and feeling. Princeton waitlist, Columbia accepted!", date: "2026-01-20" },
      { id: "r2", author: "Kenji Ito", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kenji", rating: 5, content: "She never tried to make me sound American. She helped me sound more like me. That made all the difference.", date: "2025-12-05" },
    ],
    availableSlots: [
      { date: "2026-04-07", time: "3:00 PM", timezone: "EST" },
      { date: "2026-04-09", time: "11:00 AM", timezone: "EST" },
      { date: "2026-04-11", time: "2:00 PM", timezone: "EST" },
      { date: "2026-04-13", time: "10:00 AM", timezone: "EST" },
    ],
    studentSuccess: ["Columbia", "Brown", "Vassar", "Middlebury", "Hamilton"],
    verificationStatus: "verified",
    minGPA: 3.3,
  },

  {
    id: "wei-zhang",
    name: "Wei Zhang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wei-zhang&backgroundColor=c0aede",
    school: "Duke University",
    major: "Data Science",
    year: "Junior",
    country: "China",
    countryFlag: "🇨🇳",
    languages: ["English", "Mandarin"],
    bio: "Duke Data Science junior from Beijing. I help Chinese students interested in quantitative fields — data science, statistics, applied math — build application profiles that go beyond just showing raw academic ability.",
    myStory: "I was the student who scored 800 on SAT Math and 790 on SAT Reading and still got rejected from my top choices first round. That rejection taught me the most important lesson about US college applications: they're not looking for the best scores, they're looking for the most interesting students. I spent my gap month completely rebuilding my application narrative. Instead of leading with my math awards, I wrote about building a data model to predict Beijing air quality and presenting it to my local government. That project had the same math — but now it had a purpose and a story. Duke said yes. I help Chinese STEM students make the same shift: from impressive to genuinely compelling.",
    specialties: ["Data Science & Statistics", "Chinese STEM Applications", "Quantitative Research Projects", "Activities Narrative", "Duke & Top-25 Strategy"],
    services: [
      { name: "Quick Chat", duration: 30, price: 25, description: "30-min consultation — school list, activities framing, quick strategy" },
      { name: "Deep Dive", duration: 60, price: 42, description: "60-min session — full STEM application strategy and essay development" },
      { name: "Profile Review", duration: 90, price: 70, description: "90-min comprehensive audit — activities list, all essays, research positioning" },
    ],
    rating: 4.8,
    reviewCount: 42,
    reviews: [
      { id: "r1", author: "Chenxi Liu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chenxi", rating: 5, content: "Wei completely changed how I presented my CS projects. Went from 'I built X' to 'here's why I built X and what it meant.' Duke accepted!", date: "2025-12-22" },
      { id: "r2", author: "Yifan Zhao", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yifan", rating: 5, content: "Exactly the mentorship I needed for a STEM application from China. Practical, strategic, and encouraging.", date: "2025-11-08" },
    ],
    availableSlots: [
      { date: "2026-04-08", time: "9:00 AM", timezone: "CST" },
      { date: "2026-04-10", time: "2:00 PM", timezone: "CST" },
      { date: "2026-04-12", time: "11:00 AM", timezone: "CST" },
      { date: "2026-04-14", time: "4:00 PM", timezone: "CST" },
    ],
    studentSuccess: ["Duke", "UNC Chapel Hill", "Vanderbilt", "Rice", "WashU"],
    verificationStatus: "verified",
    minGPA: 3.5,
  },

  {
    id: "aiko-nakamura",
    name: "Aiko Nakamura",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiko-nakamura&backgroundColor=d1f4e0",
    school: "Cornell University",
    major: "Architecture",
    year: "Senior",
    country: "Japan",
    countryFlag: "🇯🇵",
    languages: ["English", "Japanese"],
    bio: "Cornell Architecture senior from Osaka. I help students applying to architecture and design programs — one of the most portfolio-driven, subjective application processes in US higher education.",
    myStory: "Nobody in my high school had ever applied to a US architecture program. My school counsellor had no idea what a portfolio review meant. I had to figure out everything myself: how to photograph my models, how to structure a design statement, which programs actually welcomed international students without English as a first language. I made mistakes — submitted a portfolio that was technically excellent but had no narrative thread connecting the pieces. Cornell waitlisted me. I spent that summer rebuilding my portfolio around a single theme: the relationship between Japanese spatial philosophy (ma — the art of negative space) and modern urban design. Cornell took me off the waitlist and offered me a scholarship. I want Japanese design students to skip the part where I learned the hard way.",
    specialties: ["Architecture & Design Portfolio", "Japanese Design Students", "Visual Arts Applications", "Portfolio Narrative", "Cornell & Top Architecture Programs"],
    services: [
      { name: "Portfolio Critique", duration: 30, price: 25, description: "30-min focused portfolio review — structure, narrative, visual coherence" },
      { name: "Design Strategy", duration: 60, price: 45, description: "60-min session — portfolio curation, design statement, school selection" },
      { name: "Full Application Package", duration: 90, price: 75, description: "90-min intensive — complete portfolio strategy + all written components" },
    ],
    rating: 4.9,
    reviewCount: 22,
    reviews: [
      { id: "r1", author: "Ryo Matsuda", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryo", rating: 5, content: "Aiko's portfolio advice was transformative. She helped me find the story behind my work. RISD accepted!", date: "2026-01-08" },
      { id: "r2", author: "Yuna Kobayashi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuna", rating: 5, content: "As a Japanese design student I felt completely lost in the US application process. Aiko made it feel navigable and even exciting.", date: "2025-12-14" },
    ],
    availableSlots: [
      { date: "2026-04-07", time: "1:00 PM", timezone: "JST" },
      { date: "2026-04-09", time: "4:00 PM", timezone: "JST" },
      { date: "2026-04-11", time: "10:00 AM", timezone: "JST" },
      { date: "2026-04-13", time: "3:00 PM", timezone: "JST" },
    ],
    studentSuccess: ["RISD", "Pratt", "Parsons", "SCI-Arc", "Syracuse Architecture"],
    verificationStatus: "verified",
    minGPA: 3.2,
  },
];

export type { Counsellor as default };
