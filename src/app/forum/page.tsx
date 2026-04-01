"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, MessageCircle, Heart, Plus, Award } from "lucide-react";
import { samplePosts, Post } from "@/data/forum";
import { getForumPosts } from "@/lib/db/forum";
import { clsx } from "clsx";
import { SkeletonForumPost } from "@/components/Skeleton";

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
    <div className="min-h-screen bg-page-bg font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">PathPal</span>
            </Link>

            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/forum" className="text-accent-dark font-semibold text-sm md:text-base">Community</Link>
              <Link href="/become-consultant" className="hidden sm:block text-text-secondary hover:text-text-primary font-medium text-sm md:text-base">Become a Consultant</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Forum Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Community</h1>
            <p className="text-text-secondary text-sm md:text-base hidden sm:block">Ask questions, share experiences, connect with peers</p>
          </div>
          <Link
            href="/forum/new"
            className="bg-primary text-white px-4 md:px-5 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-sm flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Post</span>
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {!isClient && Array.from({ length: 3 }).map((_, i) => <SkeletonForumPost key={i} />)}
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="block bg-card-bg rounded-2xl border border-border p-5 hover:shadow-lg hover:border-border transition-all"
            >
              <div className="flex gap-4">
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-border-light flex items-center justify-center text-2xl">
                    {post.author.avatar}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-text-primary">{post.author.name}</span>
                    {post.author.isConsultant && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-bg text-accent-dark text-xs rounded-full">
                        <Award className="w-3 h-3" />
                        Consultant
                      </span>
                    )}
                    <span className="text-text-tertiary text-sm">· {formatTimeAgo(post.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-text-primary mb-2">{post.title}</h2>

                  {/* Content preview */}
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">{post.content}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-text-tertiary">
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
            <p className="text-text-tertiary text-lg">No posts yet. Be the first to start a conversation!</p>
            <Link href="/forum/new" className="mt-4 inline-block text-accent-dark hover:text-accent-dark font-medium">
              Create a post →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}