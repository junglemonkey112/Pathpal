"use client";

import { useState, useEffect, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, ShieldCheck, Send, Pin } from "lucide-react";
import { Post, Comment, User, samplePosts, guestUser, createAuthUser, createComment } from "@/data/forum";
import { clsx } from "clsx";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

function Avatar({ user, size = "md" }: { user: User; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-8 h-8 text-lg", md: "w-10 h-10 text-xl", lg: "w-12 h-12 text-2xl" };
  const cls = `${sizeClasses[size]} rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden`;
  if (user.avatar.startsWith("http")) {
    return <img src={user.avatar} alt={user.name} className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`} />;
  }
  return <div className={cls}>{user.avatar}</div>;
}

function CommentItem({
  comment,
  postId,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  postId: string;
  onReply: (parentId: string, content: string) => void;
  depth?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  const canReply = depth < 2;

  return (
    <div className={clsx(depth > 0 && "ml-8 border-l-2 border-slate-100 pl-4")}>
      <div className="flex gap-3 py-3">
        <Avatar user={comment.author} size="sm" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {comment.author.countryFlag && (
              <span className="text-sm">{comment.author.countryFlag}</span>
            )}
            <span className="font-semibold text-slate-900 text-sm">{comment.author.name}</span>
            {comment.author.isConsultant && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                Verified Counsellor
              </span>
            )}
            <span className="text-slate-400 text-xs">· {formatTimeAgo(comment.createdAt)}</span>
          </div>

          <p className="text-slate-700 text-sm mb-2 whitespace-pre-line">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={clsx(
                "flex items-center gap-1 text-xs",
                liked ? "text-red-500" : "text-slate-500 hover:text-red-500"
              )}
            >
              <Heart className={clsx("w-3.5 h-3.5", liked && "fill-current")} />
              {likes}
            </button>
            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
              />
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const { user } = useUser();

  const currentAuthor: User = user
    ? createAuthUser(user.id, user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
    : guestUser;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("forum_posts");
      if (stored) {
        const storedPosts: Post[] = JSON.parse(stored).map((p: Post) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          comments: (p.comments ?? []).map((c: Comment) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            replies: (c.replies ?? []).map((r: Comment) => ({
              ...r,
              createdAt: new Date(r.createdAt),
            })),
          })),
        }));
        const found = storedPosts.find((p) => p.id === postId);
        if (found) {
          startTransition(() => setPost(found));
          return;
        }
      }
    } catch {
      // fallthrough to sample data
    }
    const found = samplePosts.find((p) => p.id === postId);
    if (found) {
      startTransition(() => setPost(found));
    }
  }, [postId]);

  const handleLike = () => {
    if (!post) return;
    setLiked(!liked);
    setPost({ ...post, likes: liked ? post.likes - 1 : post.likes + 1 });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !post) return;
    const comment = createComment(`comment-${Date.now()}`, currentAuthor, newComment);
    setPost({ ...post, comments: [...post.comments, comment] });
    setNewComment("");
  };

  const handleReply = (parentId: string, content: string) => {
    if (!post) return;
    const addReply = (comments: Comment[]): Comment[] =>
      comments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...c.replies, createComment(`reply-${Date.now()}`, currentAuthor, content)],
          };
        }
        return c.replies.length > 0 ? { ...c, replies: addReply(c.replies) } : c;
      });
    setPost({ ...post, comments: addReply(post.comments) });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Post not found</p>
          <Link href="/forum" className="text-emerald-600 hover:text-emerald-700">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </button>
        {/* Post */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
          {/* Author row */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar user={post.author} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {post.author.countryFlag && <span>{post.author.countryFlag}</span>}
                <span className="font-semibold text-slate-900">{post.author.name}</span>
                {post.author.isConsultant && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Counsellor
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>·</span>
                <span className="capitalize bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{post.category}</span>
                {post.pinned && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">{post.title}</h1>
          <p className="text-slate-700 whitespace-pre-line mb-5 leading-relaxed">{post.content}</p>

          {post.images.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="" className="max-w-xs rounded-xl" />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleLike}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm",
                liked ? "bg-red-50 text-red-500" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Heart className={clsx("w-4 h-4", liked && "fill-current")} />
              {post.likes} likes
            </button>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MessageCircle className="w-4 h-4" />
              {post.comments.length} comments
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {post.comments.length > 0 ? `${post.comments.length} Comments` : "Comments"}
          </h2>

          {/* Comment input */}
          <div className="flex gap-3 mb-6">
            <Avatar user={currentAuthor} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                disabled={!user}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || !user}
                className="px-4 py-2 bg-slate-900 text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!user && (
            <div className="mb-4 text-center text-sm text-slate-500">
              <Link href="/login" className="text-emerald-600 hover:underline font-medium">Sign in</Link>
              {" "}to join the conversation
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  onReply={handleReply}
                />
              ))
            ) : (
              <p className="text-center text-slate-400 py-8 text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
