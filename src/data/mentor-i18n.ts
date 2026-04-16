// All UI text for mentor pages — keyed by zh/en

export const ui = {
  // Nav
  nav_find: { zh: "找导师", en: "Find Mentors" },
  nav_become: { zh: "成为导师", en: "Become a Mentor" },
  nav_main: { zh: "主站", en: "Main Site" },
  footer_tagline: {
    zh: "PathPal Mentors — 让过来人陪你走过申请季",
    en: "PathPal Mentors — Real guidance from those who've been there",
  },

  // Mentors list page
  hero_title: {
    zh: "过来人，帮你走",
    en: "Been There. Here for You.",
  },
  hero_subtitle: {
    zh: "真实经历，真诚陪伴",
    en: "Real stories. Real guidance.",
  },
  search_placeholder: {
    zh: "搜索学校、专业、关键词...",
    en: "Search by school, major, or keyword...",
  },
  filter_all: { zh: "全部", en: "All" },
  no_results: {
    zh: "没有找到匹配的导师，试试调整搜索条件",
    en: "No mentors found. Try adjusting your search.",
  },
  become_mentor_title: {
    zh: "想成为 PathPal 导师？",
    en: "Want to become a mentor?",
  },
  become_mentor_desc: {
    zh: "分享你的经历，帮助下一届申请者",
    en: "Share your experience and help the next generation of applicants.",
  },
  become_mentor_cta: { zh: "立即申请", en: "Apply Now" },

  // Mentor profile page
  back: { zh: "返回导师列表", en: "All Mentors" },
  reviews_label: { zh: "条评价", en: "reviews" },
  section_video: { zh: "视频自我介绍", en: "Video Introduction" },
  section_story: { zh: "我的故事", en: "My Story" },
  section_results: { zh: "申请经历", en: "Application Results" },
  section_help: { zh: "我能帮你", en: "What I Can Help With" },
  section_reviews: { zh: "学生评价", en: "Student Reviews" },
  result_accepted: { zh: "录取", en: "Accepted" },
  result_denied: { zh: "拒绝", en: "Denied" },
  result_waitlisted: { zh: "候补", en: "Waitlisted" },

  // Booking
  booking_title: { zh: "预约咨询", en: "Book a Session" },
  booking_cta: { zh: "立即预约", en: "Book a Session" },
  booking_note: {
    zh: "预约后通过微信沟通具体时间",
    en: "You'll connect via WeChat to confirm the time",
  },
  booking_modal_title: { zh: "添加微信预约", en: "Book via WeChat" },
  booking_modal_desc: {
    zh: "添加 PathPal 客服微信，我们会为你安排咨询时间并完成付款。",
    en: "Add our WeChat to schedule your session.",
  },
  booking_wechat_label: { zh: "客服微信号", en: "WeChat ID" },
  booking_step1: {
    zh: "添加微信，备注「预约」+导师名",
    en: "Add this WeChat ID and mention the mentor's name",
  },
  booking_step2: {
    zh: "确认时间，发送付款链接",
    en: "We'll confirm the time and send a payment link",
  },
  booking_step3: {
    zh: "付款后发送视频通话链接",
    en: "After payment, you'll receive a video call link",
  },

  // Card
  per_session: { zh: "/ 次", en: "/ session" },
} as const;

export type UIKey = keyof typeof ui;
