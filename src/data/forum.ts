// Forum data store (in-memory for MVP)
export interface User {
  id: string;
  name: string;
  avatar: string;
  isConsultant: boolean;
  school?: string;
}

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  images: string[];
  createdAt: Date;
  likes: number;
  likedBy: string[]; // user ids
  comments: Comment[];
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

// Current user (mock)
export const currentUser: User = {
  id: "user-1",
  name: "Bruce",
  avatar: "👤",
  isConsultant: false,
};

// Sample users
export const sampleUsers: User[] = [
  { id: "user-1", name: "Bruce", avatar: "👤", isConsultant: false },
  { id: "consultant-1", name: "Alex Chen", avatar: "🎓", isConsultant: true, school: "Harvard" },
  { id: "consultant-2", name: "Sarah Liu", avatar: "📚", isConsultant: true, school: "Stanford" },
  { id: "user-2", name: "Tom Wang", avatar: "🧑", isConsultant: false },
  { id: "user-3", name: "Emily Zhang", avatar: "👩", isConsultant: false },
  { id: "user-4", name: "Mike Johnson", avatar: "👨‍🎓", isConsultant: false },
  { id: "user-5", name: "Lisa Park", avatar: "👩‍🦰", isConsultant: false },
  { id: "consultant-3", name: "David Lee", avatar: "🎓", isConsultant: true, school: "MIT" },
  { id: "user-6", name: "Amy Chen", avatar: "👧", isConsultant: false },
];

// Sample posts
export const samplePosts: Post[] = [
  {
    id: "post-1",
    author: sampleUsers[5],
    title: "Just submitted my ED application to Columbia! 🎉",
    content: "After months of working on my essays, I finally hit submit! So nervous but excited. Any tips for what to do while waiting?",
    images: [],
    createdAt: new Date(Date.now() - 3600000),
    likes: 18,
    likedBy: [],
    comments: [
      {
        id: "comment-1",
        author: sampleUsers[1],
        content: "Congratulations! 🎉 Now is a good time to focus on your backup applications. Good luck!",
        createdAt: new Date(Date.now() - 1800000),
        likes: 3,
        likedBy: [],
        replies: []
      }
    ]
  },
  {
    id: "post-2",
    author: sampleUsers[3],
    title: "SAT vs ACT - which one should I take?",
    content: "My school doesn't offer ACT. Should I self-study for SAT or find a way to take ACT?",
    images: [],
    createdAt: new Date(Date.now() - 86400000),
    likes: 8,
    likedBy: [],
    comments: []
  },
  {
    id: "post-3",
    author: sampleUsers[2],
    title: "Application timeline for Fall 2026",
    content: "Here's a detailed timeline I created for my students. Hope it helps!\n\nSep-Oct: Essay brainstorming\nNov: ED/EA deadlines  \nDec: Interview prep\nJan: RD deadlines\nFeb-Apr: Decision notifications",
    images: [],
    createdAt: new Date(Date.now() - 172800000),
    likes: 25,
    likedBy: [],
    comments: []
  },
  {
    id: "post-4",
    author: sampleUsers[4],
    title: "Struggling with math extracurriculars",
    content: "I love math but don't know how to show that in my application. What can I do besides competitions?",
    images: [],
    createdAt: new Date(Date.now() - 259200000),
    likes: 6,
    likedBy: [],
    comments: [
      {
        id: "comment-4-1",
        author: sampleUsers[7],
        content: "Great question! You could start a math tutoring program, create a math blog, or do independent math research. Show your passion through action!",
        createdAt: new Date(Date.now() - 200000000),
        likes: 4,
        likedBy: [],
        replies: []
      }
    ]
  },
  {
    id: "post-5",
    author: sampleUsers[8],
    title: "Is 3.7 GPA too low for top schools?",
    content: "My GPA is 3.7 unweighted. I know it's on the lower end for T20s. What can I do to compensate?",
    images: [],
    createdAt: new Date(Date.now() - 345600000),
    likes: 12,
    likedBy: [],
    comments: []
  }
];

// Helper functions
export function createPost(title: string, content: string, images: string[] = []): Post {
  return {
    id: `post-${Date.now()}`,
    author: currentUser,
    title,
    content,
    images,
    createdAt: new Date(),
    likes: 0,
    likedBy: [],
    comments: []
  };
}

export function createComment(content: string): Comment {
  return {
    id: `comment-${Date.now()}`,
    author: currentUser,
    content,
    createdAt: new Date(),
    likes: 0,
    likedBy: [],
    replies: []
  };
}