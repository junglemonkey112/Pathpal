"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { MessageCircle, Heart, Plus, Search, Pin } from "lucide-react";
import { samplePosts, Post, ForumCategory } from "@/data/forum";
import { clsx } from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

function parsePosts(posts: Post[]): Post[] {
  return posts.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    comments: (p.comments ?? []).map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      replies: (c.replies ?? []).map((r) => ({ ...r, createdAt: new Date(r.createdAt) })),
    })),
  }));
}

const CATEGORIES: { id: ForumCategory | "all"; emoji: string; labelKey: string }[] = [
  { id: "all", emoji: "📋", labelKey: "forum.categories.all" },
  { id: "applications", emoji: "📝", labelKey: "forum.categories.applications" },
  { id: "essays", emoji: "✍️", labelKey: "forum.categories.essays" },
  { id: "financialAid", emoji: "💰", labelKey: "forum.categories.financialAid" },
  { id: "visas", emoji: "🛂", labelKey: "forum.categories.visas" },
  { id: "decisions", emoji: "🎉", labelKey: "forum.categories.decisions" },
  { id: "international", emoji: "🌏", labelKey: "forum.categories.international" },
];

export default function ForumPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<ForumCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    startTransition(() => {
      try {
        const stored = localStorage.getItem("forum_posts");
        const storedPosts = stored ? parsePosts(JSON.parse(stored)) : [];
        const allPosts = [...storedPosts, ...samplePosts].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(allPosts);
      } catch {
        setPosts(samplePosts);
      }
    });
  }, []);

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("forum.title")}</h1>
            <p className="text-slate-500 text-sm mt-1">{t("forum.subtitle")}</p>
          </div>
          <Link
            href="/forum/new"
            className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t("forum.newPost")}
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("forum.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <span>{cat.emoji}</span>
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex gap-4">
                {/* Author avatar */}
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start gap-2 mb-1">
                    {post.pinned && (
                      <Pin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Preview */}
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-2">
                    {post.content.slice(0, 140)}…
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      {post.author.countryFlag && <span>{post.author.countryFlag}</span>}
                      <span className={clsx("font-medium", post.author.isCounsellor ? "text-emerald-600" : "text-slate-600")}>
                        {post.author.name}
                      </span>
                      {post.author.isCounsellor && (
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full text-xs">Verified Counsellor</span>
                      )}
                    </div>
                    <span>·</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    <span>·</span>
                    <span className="capitalize">{post.category}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />{post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />{post.comments.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>No posts found.</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mt-2 text-emerald-600 text-sm">Clear search</button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
