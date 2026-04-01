import Link from "next/link";
import { ChevronRight, Heart, MessageCircle, Award, Plus } from "lucide-react";
import { Post } from "@/data/forum";

interface ForumPreviewProps {
  posts: Post[];
}

export default function ForumPreview({ posts }: ForumPreviewProps) {
  return (
    <section className="py-12 bg-page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Community</h2>
            <p className="text-text-secondary">Connect with peers and consultants</p>
          </div>
          <Link
            href="/forum"
            className="text-accent-dark hover:text-accent-dark font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="bg-card-bg rounded-xl border border-border p-4 hover:shadow-lg hover:border-border transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-border-light flex items-center justify-center text-sm">
                  {post.author.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-text-primary text-sm truncate">{post.author.name}</span>
                    {post.author.isConsultant && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-accent-bg text-accent-dark text-xs rounded-full flex-shrink-0">
                        <Award className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 text-sm md:text-base">{post.title}</h3>
              <p className="text-text-secondary text-sm line-clamp-2 mb-3">{post.content}</p>
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
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
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Start a Discussion
          </Link>
        </div>
      </div>
    </section>
  );
}
