// Forum data — Supabase-ready interfaces with seed data for V2
export type ForumCategory =
  | "applications"
  | "essays"
  | "financialAid"
  | "visas"
  | "decisions"
  | "international";

export interface User {
  id: string;
  name: string;
  avatar: string;
  isConsultant: boolean;
  school?: string;
  country?: string;
  countryFlag?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  replies: Comment[];
}

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: ForumCategory;
  images: string[];
  createdAt: Date;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  pinned?: boolean;
}

export const guestUser: User = {
  id: "guest",
  name: "Guest",
  avatar: "👤",
  isConsultant: false,
};

export function createAuthUser(id: string, name: string): User {
  return { id, name, avatar: "👤", isConsultant: false };
}

export function createComment(
  id: string,
  author: User,
  content: string,
  replies: Comment[] = []
): Comment {
  return {
    id,
    author,
    content,
    createdAt: new Date(),
    likes: 0,
    likedBy: [],
    replies,
  };
}

// --- Seed users ---

const jessicaK: User = {
  id: "jessica-kim",
  name: "Jessica Kim",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica-kim&backgroundColor=b6e3f4",
  isConsultant: true,
  school: "Stanford",
  country: "South Korea",
  countryFlag: "🇰🇷",
};

const marcusC: User = {
  id: "marcus-chen",
  name: "Marcus Chen",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-chen&backgroundColor=c0aede",
  isConsultant: true,
  school: "Harvard",
  country: "China",
  countryFlag: "🇨🇳",
};

const yukiT: User = {
  id: "yuki-tanaka",
  name: "Yuki Tanaka",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki-tanaka&backgroundColor=d1f4e0",
  isConsultant: true,
  school: "MIT",
  country: "Japan",
  countryFlag: "🇯🇵",
};

const aikoN: User = {
  id: "aiko-nakamura",
  name: "Aiko Nakamura",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiko-nakamura&backgroundColor=d1f4e0",
  isConsultant: true,
  school: "Cornell",
  country: "Japan",
  countryFlag: "🇯🇵",
};

const weiZ: User = {
  id: "wei-zhang",
  name: "Wei Zhang",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wei-zhang&backgroundColor=c0aede",
  isConsultant: true,
  school: "Duke",
  country: "China",
  countryFlag: "🇨🇳",
};

const student1: User = {
  id: "minjun-park",
  name: "Min-jun P.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minjun",
  isConsultant: false,
  country: "South Korea",
  countryFlag: "🇰🇷",
};

const student2: User = {
  id: "yifan-zhao",
  name: "Yifan Z.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yifan",
  isConsultant: false,
  country: "China",
  countryFlag: "🇨🇳",
};

const student3: User = {
  id: "haruto-sato",
  name: "Haruto S.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=haruto",
  isConsultant: false,
  country: "Japan",
  countryFlag: "🇯🇵",
};

const student4: User = {
  id: "rohan-mehta",
  name: "Rohan M.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan",
  isConsultant: false,
  country: "India",
  countryFlag: "🇮🇳",
};

// --- 8 International Forum Posts ---

export const samplePosts: Post[] = [
  {
    id: "post-1",
    author: student1,
    title: "How do I explain Korean high school grades to US admissions? My GPA looks different",
    content: `I'm a Grade 12 student from Seoul applying to US universities. My grades are excellent by Korean standards (상위 1% in my class), but when I try to convert them to a 4.0 GPA scale it looks like a 3.7 which doesn't seem impressive for T20 schools.

How have other Korean students handled this? Do I need to explain the Korean grading system? Should I include a note in the additional info section?

Also — my school doesn't rank students officially. How do I handle that?`,
    category: "applications",
    images: [],
    createdAt: new Date("2026-03-10T09:00:00"),
    likes: 47,
    likedBy: [],
    pinned: true,
    comments: [
      {
        id: "c1-1",
        author: jessicaK,
        content: `Great question — this is one of the most common concerns for Korean applicants! A few things:\n\n1. US admissions officers at T20 schools are very familiar with the Korean grading system. A 3.7 GPA equivalent from a top Korean school signals "near top of class" to them, not mediocrity.\n\n2. YES — definitely use the additional info section to explain your school's grading scale. Something like: "Korean high schools use a percentage-based system. My grades place me in the top 1% of my 300-student class."\n\n3. For no official rank: just write "School does not rank" in the rank field. Many Korean schools don't rank. That's totally fine.\n\nThe most important thing: let your counsellor know your school's context when they write your recommendation. That letter can do a lot of the explaining for you.`,
        createdAt: new Date("2026-03-10T11:30:00"),
        likes: 23,
        likedBy: [],
        replies: [
          {
            id: "c1-1-r1",
            author: student1,
            content: "This is incredibly helpful, thank you! I'll definitely add something to the additional info section. Did you mention your class rank in your personal statement too?",
            createdAt: new Date("2026-03-10T14:00:00"),
            likes: 3,
            likedBy: [],
            replies: [],
          },
        ],
      },
      {
        id: "c1-2",
        author: student2,
        content: "Chinese student here — same issue with different grading system. I ended up using the Common App additional info section to include a brief paragraph about my school's grading breakdown. Admissions definitely appreciated it. Got into Columbia!",
        createdAt: new Date("2026-03-11T08:00:00"),
        likes: 12,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-2",
    author: student2,
    title: "Financial aid as an international student — which schools actually give aid to Chinese applicants?",
    content: `I've been researching financial aid for international students and the situation looks pretty bleak. Most schools say "need-blind for internationals" but then I find out they only have 10 spots.

My family can contribute about $20k/year. I need at least $50k in aid to make US universities affordable.

Has anyone actually gotten significant financial aid from a US university as a Chinese citizen? Which schools are worth applying to? I've heard MIT, Harvard, Yale meet full demonstrated need but is that actually true for international students?`,
    category: "financialAid",
    images: [],
    createdAt: new Date("2026-03-08T14:00:00"),
    likes: 89,
    likedBy: [],
    pinned: true,
    comments: [
      {
        id: "c2-1",
        author: marcusC,
        content: `I got significant financial aid from Harvard as a Chinese student, so yes — it's real, but you have to be strategic.\n\nThe schools that are genuinely need-blind for internationals AND meet full demonstrated need: Harvard, Yale, Princeton, MIT, Dartmouth, Amherst, Bowdoin. That's basically it for the tier that covers 100% of demonstrated need.\n\nFor your situation ($50k+ needed): focus your applications on those 7. The CSS Profile is your key document — be detailed and honest. Harvard's financial aid office uses an "expected family contribution" model that's quite generous for middle-income families internationally.\n\nOne thing most people miss: international students can get BETTER aid packages than domestic students at some schools because they're a smaller applicant pool with dedicated scholarship funds.`,
        createdAt: new Date("2026-03-08T16:00:00"),
        likes: 41,
        likedBy: [],
        replies: [],
      },
      {
        id: "c2-2",
        author: student4,
        content: "Indian student who got a full scholarship to Williams — look at small liberal arts colleges. They're often more generous than big universities and the financial aid offices are easier to work with. QuestBridge is also worth looking at if your family income qualifies.",
        createdAt: new Date("2026-03-09T10:00:00"),
        likes: 28,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-3",
    author: student3,
    title: "Writing college essays when 'standing out' feels culturally wrong — advice for Japanese students?",
    content: `In Japan we're taught that modesty is a virtue. "The nail that sticks up gets hammered down." But US college essays seem to require the opposite — bragging about yourself, saying you're special, being bold.

Every essay I write feels either fake (when I try to be American-style confident) or too humble (when I'm being authentic).

How do Japanese students find a middle ground? Is there a way to write a compelling personal statement that doesn't require me to pretend to be someone I'm not?`,
    category: "essays",
    images: [],
    createdAt: new Date("2026-03-05T07:00:00"),
    likes: 134,
    likedBy: [],
    comments: [
      {
        id: "c3-1",
        author: yukiT,
        content: `This is the exact question I struggled with before getting into MIT. Here's what helped me:\n\nAmerican college essays aren't asking you to brag. They're asking you to share genuine perspective. The moment I understood that distinction, everything changed.\n\nInstead of "I am exceptional because X," try "Here is something I noticed / experienced / thought about that shaped how I see the world."\n\nMy MIT essay was about staying up until 3am building robots — not because I wanted to win competitions, but because I found it genuinely magical. That's not bragging. That's being specific and honest about what drives you.\n\nThe best essays I've read from Japanese students were the ones that leaned INTO Japanese perspective rather than trying to sound American. Write about silence, about wa (harmony), about the beauty of imperfection. Those essays stand out precisely because they offer something most American applicants can't.`,
        createdAt: new Date("2026-03-05T09:00:00"),
        likes: 67,
        likedBy: [],
        replies: [
          {
            id: "c3-1-r1",
            author: student3,
            content: "This reframe really helped. 'Share genuine perspective' rather than 'prove you're special' — that's a completely different writing mode. Thank you.",
            createdAt: new Date("2026-03-05T11:00:00"),
            likes: 18,
            likedBy: [],
            replies: [],
          },
        ],
      },
    ],
  },

  {
    id: "post-4",
    author: student4,
    title: "ED vs EA as an international student — does applying Early Decision actually help?",
    content: `I keep hearing that ED gives a significant admissions advantage. But I also hear that international students can't afford to commit to a school before seeing financial aid.

Is there any way to do ED safely as an international student? Some schools say they'll release you from ED if the financial aid isn't sufficient — is that actually true in practice? Has anyone had that experience?

I'm considering ED to Columbia but I'm nervous about committing without knowing the financial aid package.`,
    category: "decisions",
    images: [],
    createdAt: new Date("2026-03-03T11:00:00"),
    likes: 62,
    likedBy: [],
    comments: [
      {
        id: "c4-1",
        author: marcusC,
        content: `I applied ED to Harvard (need-blind for internationals) and got in. Here's my honest take:\n\nED advantage is real — roughly 10-20% higher acceptance rate at most schools. But it's only worth it if:\n1. The school is genuinely need-blind for internationals (Harvard, Yale, Princeton, MIT, Dartmouth)\n2. You've researched their financial aid enough to know it's likely to work for your family\n\nFor Columbia specifically: Columbia is need-aware for internationals in ED, which means your need for financial aid can hurt your chances. That's an important distinction.\n\nThe ED release clause does exist and schools do honor it — but you need to formally apply, get the package, and formally reject it within a specific window. It's real but it's also a process.`,
        createdAt: new Date("2026-03-03T13:30:00"),
        likes: 34,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-5",
    author: student2,
    title: "Chinese high school vs IB/AP — will US schools disadvantage me for not doing IB?",
    content: `My high school in Beijing doesn't offer IB or AP curriculum. I'm doing the standard Chinese high school system (人教版 curriculum) which is rigorous but completely unfamiliar to US admissions officers.

Will I be disadvantaged against students who have 10+ APs or IB diplomas? How do I explain my academic rigor to admissions? I scored 140/150 on my high school finals which is the top 0.3% nationally but that means nothing to an American admissions officer.`,
    category: "international",
    images: [],
    createdAt: new Date("2026-02-28T09:00:00"),
    likes: 78,
    likedBy: [],
    comments: [
      {
        id: "c5-1",
        author: weiZ,
        content: `I was in the exact same situation from Beijing. Duke accepted me without AP or IB — here's what matters:\n\nAdmissions officers evaluate you "in context of your school." They know many Chinese schools don't offer AP/IB, and they don't penalize you for that. What they DO look for is: did you take the most rigorous curriculum AVAILABLE at your school?\n\nFor the national exam scores: include them. In the additional info section, write a brief note explaining what your score means — "140/150 places me in the top 0.3% of Chinese high school students nationally, approximately 3,000 students out of 900,000." Numbers help.\n\nAlso: consider taking SAT Subject Tests (if still available) or AP exams independently as an external student. It signals initiative and gives admissions a standardized comparison point.`,
        createdAt: new Date("2026-02-28T11:00:00"),
        likes: 39,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-6",
    author: student3,
    title: "Portfolio advice for Japanese students applying to architecture programs",
    content: `I'm applying to US architecture BArch programs (Cornell, Columbia GSAPP, USC, Rice). My portfolio contains 12 projects — a mix of hand drawings, physical model photos, and some digital work.

My current portfolio feels technically strong but my architect mentor says it lacks a "narrative thread." I'm not sure what that means or how to create it.

Also: should I include work that shows Japanese aesthetic influences (wabi-sabi, ma, minimalism) or will that come across as stereotyping myself?`,
    category: "essays",
    images: [],
    createdAt: new Date("2026-02-25T14:00:00"),
    likes: 45,
    likedBy: [],
    comments: [
      {
        id: "c6-1",
        author: aikoN,
        content: `Fellow Japanese architecture student here — I got into Cornell with a portfolio that HEAVILY featured Japanese spatial philosophy, so I have strong feelings about this:\n\nABSOLUTELY include your Japanese aesthetic influences. But the key is to present them as a lens, not as a style.\n\nInstead of "I designed this minimalist building," try: "I designed this building around the concept of ma — the productive void. Here's how that shaped every spatial decision."\n\nFor the narrative thread your mentor mentioned: look at your 12 projects and ask — what question am I always trying to answer? For me it was: "How does architecture make space for silence?" Once I found that question, I restructured my portfolio so each project was an answer to it. That's a narrative thread.\n\nCornell's architecture program actively values international perspectives. Your Japanese background is not a liability — it's your differentiator.`,
        createdAt: new Date("2026-02-25T16:30:00"),
        likes: 29,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-7",
    author: student4,
    title: "F-1 visa process — timeline and what actually gets you rejected?",
    content: `I've been accepted to a US university (starting Fall 2026) and now need to apply for F-1 student visa. My consulate appointment is in June.

I've heard horror stories about F-1 rejections for "immigrant intent." I'm from India and will be returning after my studies — but how do I prove that convincingly?

What documentation is most important? What questions do consulate officers typically ask? Is there anything that commonly triggers rejection that I should be aware of?`,
    category: "visas",
    images: [],
    createdAt: new Date("2026-02-20T08:00:00"),
    likes: 96,
    likedBy: [],
    comments: [
      {
        id: "c7-1",
        author: jessicaK,
        content: `Korean student here — went through F-1 process last year. A few key things:\n\nThe "immigrant intent" question is about demonstrating ties to your home country. Strong evidence: family still in India, property in family name, acceptance letter to a job/graduate program post-graduation (if you have one), clear articulation of why you're returning.\n\nMost important documents: I-20 from your university, proof of financial support (bank statements showing you can cover tuition + living for all 4 years), acceptance letter.\n\nCommon rejection triggers: vague answers about post-graduation plans, financial documents that look inconsistent, applying too close to your start date (apply at least 120 days before).\n\nBiggest tip: be specific and consistent. If they ask why you chose this university, have a real answer. Vague answers raise flags.`,
        createdAt: new Date("2026-02-20T10:00:00"),
        likes: 52,
        likedBy: [],
        replies: [],
      },
    ],
  },

  {
    id: "post-8",
    author: student1,
    title: "Is $35/session really worth it? Comparing PathPal to Korean hagwon college prep (입시컨설팅)",
    content: `My parents want me to use a Korean 입시컨설팅 (admissions consulting) agency. The packages cost ₩15,000,000–₩25,000,000 (about $11,000–$18,000 USD) for full service.

I've been using PathPal sessions at $35 each instead. After 8 sessions (total $280) I feel like I've gotten more personalized advice than I did in the first month with the Korean agency.

The agency assigned me to a staff member who had never applied to a US university. PathPal connected me to a Korean student at Stanford who went through the exact same process I'm going through.

Wondering if others have had similar experiences comparing these options?`,
    category: "applications",
    images: [],
    createdAt: new Date("2026-02-15T12:00:00"),
    likes: 112,
    likedBy: [],
    comments: [
      {
        id: "c8-1",
        author: jessicaK,
        content: `This matches what I hear from almost every Korean student I work with. The big agencies hire recent college graduates or career counsellors who've never navigated the process themselves as an international student.\n\nThere's a specific type of insight you can only get from someone who has BEEN the international applicant — understanding how to explain your Korean background, knowing which schools are actually receptive to Korean students, knowing what "cultural fit" means in practice.\n\nI'm not saying agencies are useless — some have good essay coaches. But the strategic guidance for international students specifically? Peer counselling fills that gap much better.`,
        createdAt: new Date("2026-02-15T14:00:00"),
        likes: 58,
        likedBy: [],
        replies: [
          {
            id: "c8-1-r1",
            author: student1,
            content: "Exactly. The agency gave me generic advice like 'show leadership' and 'be unique.' Jessica asked me specific questions about my actual life and helped me find a story I didn't even know I had.",
            createdAt: new Date("2026-02-15T16:00:00"),
            likes: 31,
            likedBy: [],
            replies: [],
          },
        ],
      },
    ],
  },
];
