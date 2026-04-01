"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, MessageCircle, Heart, Plus, Award } from "lucide-react";
import { samplePosts, Post } from "@/data/forum";
import { getForumPosts } from "@/lib/db/forum";
import { clsx } from "clsx";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}


export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    getForumPosts().then((dbPosts) => {
      setPosts(dbPosts);
    }).catch(() => {
      setPosts(samplePosts);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">PathPal</span>
            </Link>
            
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/forum" className="text-emerald-600 font-semibold text-sm md:text-base">Community</Link>
              <Link href="/become-consultant" className="hidden sm:block text-slate-600 hover:text-slate-900 font-medium text-sm md:text-base">Become a Consultant</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Forum Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Community</h1>
            <p className="text-slate-600 text-sm md:text-base hidden sm:block">Ask questions, share experiences, connect with peers</p>
          </div>
          <Link
            href="/forum/new"
            className="bg-slate-900 text-white px-4 md:px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Post</span>
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/forum/${post.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex gap-4">
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                    {post.author.avatar}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-900">{post.author.name}</span>
                    {post.author.isConsultant && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        <Award className="w-3 h-3" />
                        Consultant
                      </span>
                    )}
                    <span className="text-slate-400 text-sm">· {formatTimeAgo(post.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h2>
                  
                  {/* Content preview */}
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{post.content}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments.length} comments
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No posts yet. Be the first to start a conversation!</p>
            <Link href="/forum/new" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium">
              Create a post →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}