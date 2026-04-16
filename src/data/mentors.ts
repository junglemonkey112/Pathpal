export interface ApplicationResult {
  school: string;
  result: "accepted" | "waitlisted" | "denied";
  type: "ED" | "ED2" | "EA" | "RD";
}

export interface MentorReview {
  id: string;
  author: string;
  author_en: string;
  rating: number;
  date: string;
  content: string;
  content_en: string;
}

export interface MentorService {
  name: string;
  name_en: string;
  duration: number; // minutes
  price: number; // CNY
}

export interface AvailableSlot {
  date: string;
  times: string[];
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  school: string;
  major: string;
  major_en: string;
  year: string;
  year_en: string;
  tagline: string;
  tagline_en: string;
  story: string;
  story_en: string;
  video_url: string;
  application_results: ApplicationResult[];
  service_tags: string[];
  service_tags_en: string[];
  services: MentorService[];
  verified: boolean;
  rating: number;
  review_count: number;
  reviews: MentorReview[];
  available_slots: AvailableSlot[];
  wechat_contact: string;
}

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Lisa Z.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4",
    school: "UCLA",
    major: "计算机科学",
    major_en: "Computer Science",
    year: "大二",
    year_en: "Sophomore",
    tagline: "ED被拒那晚我哭了一整夜，但现在我很感谢那次拒绝",
    tagline_en: "I cried all night after my ED rejection, but now I'm grateful it happened",
    story: `高三那年是我人生中最难熬的一段时间。我妈给我报了一个15万的中介，他们帮我选了6所学校，其中Columbia是ED。我当时觉得自己准备得不错——GPA 3.8，SAT 1520，做了两年机器人社团社长。

但ED被拒了。

那天晚上我躲在被子里哭了一整夜。我妈在门外站了很久，但我不想让她看到我这个样子。第二天早上我跟她说"我没事"，其实我完全不好。接下来的两个月，我每天都在怀疑自己：是不是我不够好？是不是文书写得太差？

后来我才明白，Columbia拒绝我不是因为我不好，而是因为我的文书试图让自己看起来像"他们想要的人"，而不是真实的我。RD申请时我重写了所有文书，写了我真正热爱的事情——不是什么宏大的项目，而是我在bilibili上做编程教程帮助初学者的经历。UCLA录取了我。

现在回头看，那次被拒是最好的事情。它逼我停止表演，开始做自己。`,
    story_en: `Senior year was the hardest period of my life. My mom hired a college consultant that cost 150,000 RMB, and they helped me pick 6 schools — Columbia was my ED choice. I felt pretty confident — GPA 3.8, SAT 1520, two years as president of the robotics club.

But I got rejected ED.

That night I buried myself under the covers and cried until morning. My mom stood outside my door for a long time, but I didn't want her to see me like that. The next morning I told her "I'm fine," but I was anything but. For the next two months, I questioned myself every day: Am I not good enough? Was my essay terrible?

It took me a while to realize that Columbia didn't reject me because I wasn't good enough — it was because my essays were trying to make me look like "the person they wanted" instead of who I really am. When I rewrote all my essays for RD, I wrote about what I truly loved — not some grand project, but how I made coding tutorials on Bilibili to help beginners. UCLA accepted me.

Looking back, that rejection was the best thing that happened to me. It forced me to stop performing and start being myself.`,
    video_url: "",
    application_results: [
      { school: "UCLA", result: "accepted", type: "EA" },
      { school: "UC San Diego", result: "accepted", type: "RD" },
      { school: "Stanford", result: "denied", type: "RD" },
      { school: "Columbia", result: "denied", type: "ED" },
      { school: "NYU", result: "waitlisted", type: "RD" },
    ],
    service_tags: ["选校策略", "文书反馈", "情感支持", "CS专业申请"],
    service_tags_en: ["School Selection Strategy", "Essay Feedback", "Emotional Support", "CS Major Applications"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 199 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 349 },
    ],
    verified: true,
    rating: 4.9,
    review_count: 12,
    reviews: [
      {
        id: "r1",
        author: "小明妈妈",
        author_en: "Xiaoming's Mom",
        rating: 5,
        date: "2026-03-15",
        content: "Lisa特别耐心，我孩子跟她聊完之后明显开朗了很多。最重要的是她真的理解申请季的压力，不是那种站在高处指导的感觉。",
        content_en: "Lisa is incredibly patient. My child was noticeably more positive after talking with her. What matters most is that she truly understands the pressure of application season — it doesn't feel like she's lecturing from above.",
      },
      {
        id: "r2",
        author: "高三学生A",
        author_en: "Senior Student A",
        rating: 5,
        date: "2026-03-02",
        content: "Lisa姐帮我看了文书，给的建议特别具体。她说的'别写你以为他们想看的，写你自己的故事'这句话让我豁然开朗。",
        content_en: "Lisa reviewed my essay and gave really specific feedback. Her advice — 'Don't write what you think they want to read, write your own story' — was a total lightbulb moment for me.",
      },
      {
        id: "r3",
        author: "家长W",
        author_en: "Parent W",
        rating: 5,
        date: "2026-02-20",
        content: "孩子ED被拒后整个人状态很差，Lisa分享了她自己被拒的经历，孩子听完之后一个月来第一次主动跟我聊天。非常感谢。",
        content_en: "After my child's ED rejection, they were in a really dark place. Lisa shared her own rejection experience, and for the first time in a month, my child voluntarily came to talk to me. We're so grateful.",
      },
    ],
    available_slots: [
      { date: "2026-04-20", times: ["10:00", "14:00", "19:00"] },
      { date: "2026-04-21", times: ["11:00", "15:00"] },
      { date: "2026-04-22", times: ["10:00", "16:00", "20:00"] },
    ],
    wechat_contact: "pathpal_lisa",
  },
  {
    id: "2",
    name: "Kevin W.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin&backgroundColor=c0aede",
    school: "University of Michigan",
    major: "商科",
    major_en: "Business",
    year: "大三",
    year_en: "Junior",
    tagline: "从普高到美本，没有中介，全靠自己摸索——所以我知道每一步有多难",
    tagline_en: "From a regular Chinese high school to a U.S. college, no consultant, all on my own — so I know how hard every step is",
    story: `我不是那种从小就规划出国的小孩。高一的时候我还在准备高考，高二才决定转方向申美本。我爸妈是工薪阶层，请不起中介，所以所有的事情都是我自己摸索的。

最崩溃的是标化考试。我在公立高中，英语基础不算好，第一次考SAT只有1280。我妈当时说了一句"要不还是考高考吧"，我知道她不是在打击我，她是心疼我。但那句话让我特别难受。

后来我在网上找了各种免费资源，B站、Reddit、College Confidential，每天学到凌晨一点。SAT最后考到1420，不算高，但够用了。

申请的时候我没有去冲藤校，因为我很清楚自己的位置。我把精力全放在Michigan的文书上，写了我在公立高中组织英语角的故事——怎么从3个人做到每周50个人参加。Michigan给了我录取。

我想告诉学弟学妹：不是每个人都需要进藤校。找到适合自己的学校，比排名更重要。而且，没有中介也完全可以做到。`,
    story_en: `I wasn't one of those kids who planned to study abroad from a young age. Freshman year of high school I was still preparing for the Gaokao. It wasn't until sophomore year that I decided to pivot and apply to U.S. colleges. My parents are working class — they couldn't afford a consultant, so I figured everything out on my own.

The most crushing part was standardized testing. I was at a public high school, and my English foundation wasn't strong. My first SAT score was only 1280. My mom said, "Maybe you should just stick with the Gaokao." I know she wasn't trying to discourage me — she was worried about me. But it still stung.

I found every free resource I could online — Bilibili, Reddit, College Confidential — and studied until 1 AM every night. I eventually got my SAT up to 1420. Not amazing, but enough.

When it came time to apply, I didn't reach for the Ivies because I knew where I stood. I poured all my energy into Michigan's essays, writing about how I started an English Corner at my public high school — growing it from 3 people to 50 people every week. Michigan accepted me.

What I want to tell younger students is this: not everyone needs to get into an Ivy. Finding the school that fits you matters more than rankings. And you can absolutely do it without a consultant.`,
    video_url: "",
    application_results: [
      { school: "University of Michigan", result: "accepted", type: "EA" },
      { school: "Penn State", result: "accepted", type: "RD" },
      { school: "Ohio State", result: "accepted", type: "RD" },
      { school: "UC Berkeley", result: "denied", type: "RD" },
      { school: "NYU", result: "denied", type: "RD" },
    ],
    service_tags: ["无中介DIY申请", "标化考试策略", "奖学金申请", "普高转国际路线"],
    service_tags_en: ["DIY Applications (No Consultant)", "Test Prep Strategy", "Scholarship Applications", "Public School to International Track"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 179 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 299 },
    ],
    verified: true,
    rating: 4.8,
    review_count: 8,
    reviews: [
      {
        id: "r4",
        author: "DIY申请者小李",
        author_en: "DIY Applicant Xiao Li",
        rating: 5,
        date: "2026-03-10",
        content: "Kevin学长自己就是DIY申请的，给的建议特别实在，不像中介说的那些套话。帮我省了十几万中介费。",
        content_en: "Kevin did DIY applications himself, so his advice is super practical — nothing like the cookie-cutter stuff consultants say. He helped me save over 100,000 RMB in consultant fees.",
      },
      {
        id: "r5",
        author: "家长L",
        author_en: "Parent L",
        rating: 5,
        date: "2026-02-28",
        content: "我家孩子也是普高的，之前一直不确定要不要出国。Kevin的经历给了我们很大信心，原来普高背景也完全可以。",
        content_en: "Our child is also from a regular public high school, and we weren't sure about studying abroad. Kevin's story gave us a huge confidence boost — it turns out a public school background is totally fine.",
      },
    ],
    available_slots: [
      { date: "2026-04-20", times: ["09:00", "13:00", "20:00"] },
      { date: "2026-04-23", times: ["10:00", "14:00"] },
    ],
    wechat_contact: "pathpal_kevin",
  },
  {
    id: "3",
    name: "Sophie C.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophie&backgroundColor=ffd5dc",
    school: "MIT",
    major: "电子工程",
    major_en: "Electrical Engineering",
    year: "大一",
    year_en: "Freshman",
    tagline: "我的申请季不是励志故事，是一场漫长的自我怀疑——但我活过来了",
    tagline_en: "My application season wasn't an inspirational story — it was a long battle with self-doubt — but I made it through",
    story: `大家看到MIT可能觉得"哇，学霸"。但申请季的时候，我是班里最焦虑的人。

我从小就是"别人家的孩子"——竞赛拿奖、成绩第一、活动满满。但到了高三要写文书的时候，我突然不知道自己是谁了。我做的所有事情，到底是因为我喜欢，还是因为别人期待我做？

有一段时间我几乎写不出任何东西。我的中介催我交初稿，我妈每天问我"写好了没有"，我爸说"你这么优秀怕什么"。他们都不理解——我不是怕被拒，我是不知道要把哪个版本的自己展示出去。

最后帮我的是我高中的一个学姐，她在Cornell读大二。她跟我说："别想着展示最好的自己，想想你最真实的时刻。"我写了我小时候拆家里收音机的故事，写了我为什么着迷于"东西是怎么工作的"。那篇文书我写得哭了，但写完之后我知道：这才是我。

如果你现在也在经历那种"我到底是谁"的迷茫，我特别理解你。`,
    story_en: `When people see MIT, they probably think "wow, genius." But during application season, I was the most anxious person in my class.

I'd been "that kid" my whole life — competition medals, top grades, a packed extracurricular list. But when senior year came and I had to write my essays, I suddenly had no idea who I was. Everything I'd done — was it because I actually cared, or because it was what everyone expected of me?

For a while I could barely write a single word. My consultant was pressuring me for a first draft, my mom asked every day "Is it done yet?", and my dad said "You're so accomplished, what are you afraid of?" None of them understood — I wasn't afraid of rejection. I just didn't know which version of myself to put on the page.

What finally helped was a senior from my high school who was a sophomore at Cornell. She told me: "Stop trying to show your best self. Think about your most authentic moment." I wrote about taking apart the family radio as a kid, about why I'm fascinated by how things work. I cried writing that essay, but when it was done, I knew: this is me.

If you're going through that "who am I, really?" confusion right now, I completely understand.`,
    video_url: "",
    application_results: [
      { school: "MIT", result: "accepted", type: "EA" },
      { school: "Georgia Tech", result: "accepted", type: "RD" },
      { school: "University of Illinois", result: "accepted", type: "RD" },
      { school: "Caltech", result: "denied", type: "RD" },
    ],
    service_tags: ["文书突破", "理工科申请", "竞赛背景包装", "情感支持"],
    service_tags_en: ["Essay Breakthroughs", "STEM Applications", "Competition Portfolio Positioning", "Emotional Support"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 249 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 449 },
    ],
    verified: true,
    rating: 5.0,
    review_count: 6,
    reviews: [
      {
        id: "r6",
        author: "高三理科生",
        author_en: "Senior STEM Student",
        rating: 5,
        date: "2026-03-18",
        content: "Sophie学姐说的'写你最真实的时刻'彻底改变了我的文书方向。之前我一直在堆砌竞赛成绩，现在我终于知道文书应该怎么写了。",
        content_en: "Sophie's advice to 'write about your most authentic moment' completely changed my essay direction. I used to just pile up competition awards, and now I finally know what an essay should actually be.",
      },
      {
        id: "r7",
        author: "家长Z",
        author_en: "Parent Z",
        rating: 5,
        date: "2026-03-05",
        content: "女儿是典型的'别人家孩子'但其实压力很大，Sophie的经历让她发现原来MIT的学姐也曾经迷茫过，这对她帮助很大。",
        content_en: "My daughter is the classic 'perfect kid' but the pressure is immense. Learning that even an MIT student like Sophie once felt lost helped her tremendously.",
      },
    ],
    available_slots: [
      { date: "2026-04-21", times: ["10:00", "15:00", "20:00"] },
      { date: "2026-04-24", times: ["11:00", "16:00"] },
    ],
    wechat_contact: "pathpal_sophie",
  },
  {
    id: "4",
    name: "David L.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David&backgroundColor=d1d4f9",
    school: "University of Washington",
    major: "心理学",
    major_en: "Psychology",
    year: "大二",
    year_en: "Sophomore",
    tagline: "选了一个'冷门'专业，但这是我做过最对的决定",
    tagline_en: "I chose an 'unconventional' major, and it's the best decision I've ever made",
    story: `我爸是做生意的，从小就跟我说"学商科，将来接我的班"。但我高二的时候做了一次心理咨询——因为跟同学关系处得很差，整天觉得自己不被理解。那次咨询改变了我。

我第一次意识到，原来有人可以靠"理解别人"为职业。我开始疯狂看心理学的书，从《心理学与生活》到弗洛伊德到积极心理学。

申请的时候，我爸知道我要选心理学，沉默了整整三天。后来他说了一句："你自己想清楚就行。"我知道他不开心，但他没有阻止我。

现在我在UW读心理学，这学期在做一个关于"国际学生文化适应焦虑"的研究项目。说实话，UW不是什么顶校，但心理学专业排名很好，更重要的是我每天都在做自己真正喜欢的事情。

我特别想帮那些被家长push学商科、学计算机，但心里其实有别的梦想的学弟学妹。选专业这件事，排名不是唯一标准。`,
    story_en: `My dad is a businessman, and growing up he always told me, "Study business, take over the family company someday." But during my sophomore year of high school, I went to a counseling session — I was struggling with classmates and constantly felt misunderstood. That session changed everything.

For the first time, I realized that someone could make a career out of understanding people. I became obsessed with psychology books — from "Psychology and Life" to Freud to positive psychology.

When my dad found out I wanted to major in psychology, he went silent for three full days. Eventually he said, "As long as you've thought it through." I knew he wasn't happy, but he didn't stop me.

Now I'm studying psychology at UW, and this semester I'm working on a research project about cultural adjustment anxiety among international students. Honestly, UW isn't a top-tier school overall, but it has an excellent psychology program — and more importantly, I'm doing what I genuinely love every day.

I especially want to help those students whose parents are pushing them toward business or CS, but who secretly dream of something else. When it comes to choosing a major, rankings aren't the only thing that matters.`,
    video_url: "",
    application_results: [
      { school: "University of Washington", result: "accepted", type: "RD" },
      { school: "University of Wisconsin", result: "accepted", type: "RD" },
      { school: "UCLA", result: "denied", type: "RD" },
      { school: "University of Michigan", result: "denied", type: "RD" },
    ],
    service_tags: ["专业选择", "与家长沟通", "心理学/文科申请", "情感支持"],
    service_tags_en: ["Major Selection", "Communicating with Parents", "Psychology / Liberal Arts Applications", "Emotional Support"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 169 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 279 },
    ],
    verified: true,
    rating: 4.9,
    review_count: 10,
    reviews: [
      {
        id: "r8",
        author: "迷茫的高二生",
        author_en: "A Confused Sophomore",
        rating: 5,
        date: "2026-03-12",
        content: "David学长让我意识到选专业不是只看排名和薪资。他帮我分析了我的兴趣和性格，现在我对未来方向清楚多了。",
        content_en: "David helped me realize that choosing a major isn't just about rankings and salary. He analyzed my interests and personality with me, and now I have a much clearer sense of where I'm headed.",
      },
      {
        id: "r9",
        author: "家长C",
        author_en: "Parent C",
        rating: 5,
        date: "2026-02-25",
        content: "孩子一直想学文科但我们担心就业，David从自己的角度分享了很多，让我们全家都重新思考了。很感谢这种坦诚的交流。",
        content_en: "Our child always wanted to study humanities but we worried about career prospects. David shared his perspective openly, which made our whole family rethink things. We really appreciate that kind of honest conversation.",
      },
    ],
    available_slots: [
      { date: "2026-04-20", times: ["11:00", "15:00", "19:00"] },
      { date: "2026-04-22", times: ["10:00", "14:00"] },
    ],
    wechat_contact: "pathpal_david",
  },
  {
    id: "5",
    name: "Emily W.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
    school: "NYU",
    major: "传媒",
    major_en: "Communications",
    year: "大二",
    year_en: "Sophomore",
    tagline: "Gap year差点毁了我，但也成就了我",
    tagline_en: "My gap year nearly broke me, but it also made me who I am",
    story: `我是那个"申请全军覆没然后gap year重来"的人。

第一年申请的时候，我太自信了。觉得自己A-Level成绩不错（A*AA），活动也丰富（校报主编+短片拍摄），肯定没问题。结果Northwestern ED拒了，NYU RD也拒了，只收到一个保底校的offer。

我妈说"去吧，保底校也不差"。但我不甘心。我做了一个当时看起来很疯狂的决定——gap一年。

那一年我先是崩溃了两个月，觉得自己是loser。然后我去了一个纪录片工作室实习，跟着导演去云南拍了一部关于留守儿童的短片。那段经历彻底改变了我对"传媒"的理解——它不只是讲故事，它是让没有声音的人被听到。

第二年重新申请，我的文书完全不同了。NYU录取了我。

Gap year不可怕，可怕的是在gap的时候什么都不做。如果你正在考虑gap，或者刚经历了申请失败，我可以帮你。`,
    story_en: `I'm the person who struck out on every application and came back after a gap year.

The first time around, I was overconfident. I thought my A-Level scores were solid (A*AA), my activities were impressive (editor-in-chief of the school paper, short film production) — it would be fine. But Northwestern rejected me ED, NYU rejected me RD, and I only got an offer from a safety school.

My mom said, "Just go — the safety school isn't bad." But I couldn't accept it. I made what seemed like a crazy decision at the time — I took a gap year.

The first two months I fell apart completely, convinced I was a loser. Then I got an internship at a documentary studio and traveled to Yunnan with a director to film a short about left-behind children. That experience completely transformed how I understood "media" — it's not just about telling stories, it's about giving a voice to people who have none.

When I reapplied the second year, my essays were completely different. NYU accepted me.

A gap year isn't scary — what's scary is doing nothing during it. If you're considering a gap year, or you just went through a failed application cycle, I can help.`,
    video_url: "",
    application_results: [
      { school: "NYU", result: "accepted", type: "RD" },
      { school: "Boston University", result: "accepted", type: "RD" },
      { school: "Northwestern", result: "denied", type: "ED" },
    ],
    service_tags: ["Gap Year规划", "传媒/艺术申请", "文书策略", "申请失败后的心理重建"],
    service_tags_en: ["Gap Year Planning", "Media / Arts Applications", "Essay Strategy", "Rebuilding After Application Setbacks"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 199 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 349 },
    ],
    verified: true,
    rating: 4.8,
    review_count: 7,
    reviews: [
      {
        id: "r10",
        author: "Gap Year考虑者",
        author_en: "Considering a Gap Year",
        rating: 5,
        date: "2026-03-08",
        content: "Emily姐的经历让我不再觉得gap是一件丢脸的事。她帮我规划了gap year的时间安排，现在我觉得这一年可以过得很有意义。",
        content_en: "Emily's story made me stop seeing a gap year as something to be ashamed of. She helped me plan out a timeline, and now I feel like this year can actually be really meaningful.",
      },
      {
        id: "r11",
        author: "家长M",
        author_en: "Parent M",
        rating: 4,
        date: "2026-02-15",
        content: "孩子申请不理想想gap，我们一开始很反对。听了Emily的分享后，我们更理解孩子的想法了。",
        content_en: "Our child wanted to take a gap year after disappointing results, and we were opposed at first. After hearing Emily's story, we understand our child's perspective much better.",
      },
    ],
    available_slots: [
      { date: "2026-04-21", times: ["09:00", "13:00", "18:00"] },
      { date: "2026-04-23", times: ["10:00", "15:00", "20:00"] },
    ],
    wechat_contact: "pathpal_emily",
  },
  {
    id: "6",
    name: "James P.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James&backgroundColor=c0aede",
    school: "UC Berkeley",
    major: "数据科学",
    major_en: "Data Science",
    year: "大三",
    year_en: "Junior",
    tagline: "转学进了Berkeley——第一次申请失败不代表路走死了",
    tagline_en: "I transferred into Berkeley — a first-round rejection doesn't mean the road is closed",
    story: `高三那年我的dream school是Berkeley。被拒的时候我觉得天塌了。

我最后去了UC Santa Cruz——说实话，当时觉得这个学校"不够好"，在国内跟亲戚说的时候都有点不好意思。但我爸跟我说了一句话："进了门再说，路是自己走出来的。"

大一我拼了命。GPA 3.95，加入了数据科学社团，自学了Python和机器学习，还做了一个分析加州房价的项目，发在了Medium上。大二的时候，我申请了UC系统内部的转学。

Berkeley录取了我。

我现在回头看，Santa Cruz那一年是我成长最快的一年。没有人认识我，没有光环，一切从零开始。那段经历教会我：你的起点不决定你的终点。

我特别想帮那些"没进dream school"的同学——转学是一条真实可行的路。`,
    story_en: `Senior year, my dream school was Berkeley. When I got rejected, I felt like my world collapsed.

I ended up at UC Santa Cruz — honestly, I felt like the school "wasn't good enough," and I was almost embarrassed telling relatives back in China. But my dad said something: "Get your foot in the door first. You make your own path."

Freshman year, I went all in. GPA 3.95, joined the data science club, self-taught Python and machine learning, and built a California housing price analysis project that I published on Medium. Sophomore year, I applied for an internal UC transfer.

Berkeley accepted me.

Looking back now, that year at Santa Cruz was the year I grew the most. Nobody knew me, there was no halo, everything started from zero. That experience taught me: where you start doesn't determine where you end up.

I especially want to help students who didn't get into their dream school — transferring is a real, viable path.`,
    video_url: "",
    application_results: [
      { school: "UC Berkeley", result: "accepted", type: "RD" },
      { school: "UCLA", result: "accepted", type: "RD" },
    ],
    service_tags: ["转学申请策略", "UC系统转学", "数据科学/CS申请", "大一规划"],
    service_tags_en: ["Transfer Application Strategy", "UC System Transfers", "Data Science / CS Applications", "Freshman Year Planning"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 199 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 349 },
    ],
    verified: true,
    rating: 4.9,
    review_count: 9,
    reviews: [
      {
        id: "r12",
        author: "想转学的大一生",
        author_en: "Freshman Hoping to Transfer",
        rating: 5,
        date: "2026-03-20",
        content: "James学长的转学经历给了我巨大的希望。他帮我制定了大一的GPA和活动规划，现在我知道该怎么一步步准备转学了。",
        content_en: "James's transfer story gave me so much hope. He helped me create a GPA and activities plan for freshman year, and now I know how to prepare for a transfer step by step.",
      },
      {
        id: "r13",
        author: "家长H",
        author_en: "Parent H",
        rating: 5,
        date: "2026-03-01",
        content: "孩子没去到理想的学校一直很沮丧，James的故事让他重新有了动力。转学这条路我们之前完全没想过。",
        content_en: "Our child has been down ever since not getting into their dream school. James's story gave them renewed motivation. We'd never even considered the transfer route before.",
      },
    ],
    available_slots: [
      { date: "2026-04-20", times: ["10:00", "14:00"] },
      { date: "2026-04-24", times: ["11:00", "15:00", "19:00"] },
    ],
    wechat_contact: "pathpal_james",
  },
  {
    id: "7",
    name: "Mia Z.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mia&backgroundColor=ffd5dc",
    school: "Emory University",
    major: "生物 / Pre-Med",
    major_en: "Biology / Pre-Med",
    year: "大一",
    year_en: "Freshman",
    tagline: "全家没有人出过国，我是第一个——如果我可以，你也可以",
    tagline_en: "No one in my family had ever been abroad — I was the first. If I can do it, so can you",
    story: `我是"第一代留学生"。我爸妈都没出过国，英语不会说，对美国大学的了解全部来自电视剧。

申请过程中最难的不是写文书、不是考试，而是——我没有任何人可以问。我同学的家长有的自己就是海归，有的请了很好的顾问。而我妈能做的就是每天给我煲汤，然后问我"今天写了多少字"。

我ED1冲了Hopkins，被拒了。那个冬天我几乎每天都在CommonApp上改来改去，改到凌晨两三点。我不知道自己的方向对不对，因为没有人能告诉我。

ED2我选了Emory。这个学校很多人没听过，但它的Pre-Med项目是全美顶尖的。我被录取的那天，我妈在电话里哭了。她说："妈妈帮不上你什么，但妈妈为你骄傲。"

我想成为那个"可以被问的人"。如果你也是家里第一个准备出国的，你不需要一个人扛。`,
    story_en: `I'm a "first-generation study abroad student." Neither of my parents has ever been outside China, neither speaks English, and everything they know about American colleges comes from TV dramas.

The hardest part of the application process wasn't writing essays or taking tests — it was having no one to ask. Some of my classmates had parents who'd studied abroad themselves, others had hired great consultants. All my mom could do was make me soup every day and ask, "How many words did you write today?"

I reached for Hopkins ED1 and got rejected. That winter, I was on CommonApp almost every night revising until 2 or 3 AM. I didn't know if I was going in the right direction, because there was no one who could tell me.

For ED2, I chose Emory. Many people haven't heard of it, but its Pre-Med program is among the best in the country. The day I got in, my mom cried on the phone. She said: "Mom can't help you with much, but Mom is proud of you."

I want to be that person you can ask. If you're the first in your family to prepare for studying abroad, you don't have to carry it alone.`,
    video_url: "",
    application_results: [
      { school: "Emory University", result: "accepted", type: "ED2" },
      { school: "Case Western", result: "accepted", type: "RD" },
      { school: "Johns Hopkins", result: "denied", type: "ED" },
      { school: "Duke", result: "denied", type: "RD" },
      { school: "Tufts", result: "waitlisted", type: "RD" },
    ],
    service_tags: ["第一代留学生指导", "Pre-Med/生物申请", "奖学金申请", "情感支持"],
    service_tags_en: ["First-Gen Study Abroad Guidance", "Pre-Med / Biology Applications", "Scholarship Applications", "Emotional Support"],
    services: [
      { name: "30分钟视频咨询", name_en: "30-min Video Session", duration: 30, price: 179 },
      { name: "60分钟深度辅导", name_en: "60-min Deep Coaching", duration: 60, price: 299 },
    ],
    verified: true,
    rating: 5.0,
    review_count: 5,
    reviews: [
      {
        id: "r14",
        author: "第一代留学生小Y",
        author_en: "First-Gen Student Xiao Y",
        rating: 5,
        date: "2026-03-22",
        content: "Mia学姐完全理解我的处境，因为她自己就是这么过来的。她帮我理清了申请时间线，还教我怎么跟完全不懂留学的父母沟通。",
        content_en: "Mia completely understands my situation because she went through the exact same thing. She helped me map out the application timeline and taught me how to communicate with parents who know nothing about studying abroad.",
      },
      {
        id: "r15",
        author: "家长F",
        author_en: "Parent F",
        rating: 5,
        date: "2026-03-10",
        content: "我们家是第一次有孩子出国，什么都不懂，Mia不仅帮孩子，还耐心地跟我解释了整个申请流程。真的很感谢。",
        content_en: "This is the first time anyone in our family has gone abroad — we knew nothing. Mia didn't just help our child, she patiently walked me through the entire application process. We're truly grateful.",
      },
    ],
    available_slots: [
      { date: "2026-04-22", times: ["09:00", "13:00", "18:00"] },
      { date: "2026-04-25", times: ["10:00", "15:00"] },
    ],
    wechat_contact: "pathpal_mia",
  },
];

export function getMentorById(id: string): Mentor | undefined {
  return mentors.find((m) => m.id === id);
}

export function getAllMentors(): Mentor[] {
  return mentors;
}
