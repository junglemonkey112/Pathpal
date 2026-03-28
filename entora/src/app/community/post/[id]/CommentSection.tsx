"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author: { full_name: string; role: string } | null;
}

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from("forum_comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content: newComment.trim(),
      })
      .select(
        `
        *,
        author:profiles!author_id(full_name, role, avatar_url)
      `
      )
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
      // Update comment count
      await supabase
        .from("forum_posts")
        .update({ comments_count: comments.length + 1 })
        .eq("id", postId);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-medium text-indigo-600 shrink-0">
              {profile?.full_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || submitting}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {submitting ? "Posting..." : "Post comment"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Sign in
            </Link>{" "}
            to join the conversation
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-neutral-900"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">
              {comment.author?.full_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.author?.full_name || "Anonymous"}
                </span>
                {comment.author?.role === "guide" && (
                  <Badge variant="secondary">Guide</Badge>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
