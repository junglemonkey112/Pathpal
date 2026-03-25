import Link from "next/link";
import { ChevronRight, Heart, MessageCircle, Award, Plus } from "lucide-react";
import { Post } from "@/data/forum";

interface ForumPreviewProps {
  posts: Post[];
}

export default function ForumPreview({ posts }: ForumPreviewProps) {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Community</h2>
            <p className="text-slate-600">Connect with peers and consultants</p>
          </div>
          <Link
            href="/forum"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                  {post.author.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-900 text-sm truncate">{post.author.name}</span>
                    {post.author.isConsultant && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full flex-shrink-0">
                        <Award className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm md:text-base">{post.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-2 mb-3">{post.content}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments.length}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/forum/new"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Start a Discussion
          </Link>
        </div>
      </div>
    </section>
  );
}
