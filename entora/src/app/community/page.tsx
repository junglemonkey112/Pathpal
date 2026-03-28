import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageSquare, ThumbsUp, Plus, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

const categories = [
  { slug: "general", name: "General", color: "default" as const },
  { slug: "essays", name: "Essays", color: "primary" as const },
  { slug: "financial-aid", name: "Financial Aid", color: "success" as const },
  { slug: "international", name: "International", color: "secondary" as const },
  { slug: "test-prep", name: "Test Prep", color: "warning" as const },
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const activeCategory = params.category;

  let query = supabase
    .from("forum_posts")
    .select(
      `
      *,
      author:profiles!author_id(full_name, role, avatar_url),
      category:forum_categories!category_id(name, slug)
    `
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (activeCategory) {
    const { data: cat } = await supabase
      .from("forum_categories")
      .select("id")
      .eq("slug", activeCategory)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data: posts } = await query;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Community
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ask questions, share experiences, help each other
          </p>
        </div>
        <Link
          href="/community/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Link
          href="/community"
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/community?category=${cat.slug}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {(!posts || posts.length === 0) ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Be the first to start a discussion!
            </p>
            <Link
              href="/community/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create a post
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/post/${post.id}`}
              className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all bg-white dark:bg-neutral-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {(post.author as { full_name: string })?.full_name || "Anonymous"}
                    </span>
                    {(post.author as { role: string })?.role === "guide" && (
                      <Badge variant="secondary">Guide</Badge>
                    )}
                    {(post.author as { role: string })?.role === "specialist" && (
                      <Badge variant="warning">Specialist</Badge>
                    )}
                    {post.category && (
                      <Badge variant="primary">
                        {(post.category as { name: string }).name}
                      </Badge>
                    )}
                    {post.is_pinned && <Badge variant="warning">Pinned</Badge>}
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {post.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {post.likes_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {post.comments_count}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
