import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("forum_posts")
    .select(
      `
      *,
      author:profiles!author_id(full_name, role, avatar_url),
      category:forum_categories!category_id(name, slug)
    `
    )
    .eq("id", id)
    .single();

  if (!post) notFound();

  const { data: comments } = await supabase
    .from("forum_comments")
    .select(
      `
      *,
      author:profiles!author_id(full_name, role, avatar_url)
    `
    )
    .eq("post_id", id)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: true });

  const author = post.author as { full_name: string; role: string } | null;
  const category = post.category as { name: string; slug: string } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to community
      </Link>

      {/* Post */}
      <article className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {author?.full_name || "Anonymous"}
          </span>
          {author?.role === "guide" && <Badge variant="secondary">Guide</Badge>}
          {author?.role === "specialist" && (
            <Badge variant="warning">Specialist</Badge>
          )}
          {category && <Badge variant="primary">{category.name}</Badge>}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {post.title}
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <LikeButton postId={post.id} initialLikes={post.likes_count} />
          <span className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </article>

      {/* Comments */}
      <CommentSection
        postId={post.id}
        initialComments={comments || []}
      />
    </div>
  );
}
