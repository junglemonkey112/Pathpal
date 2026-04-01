"use client";

import { useState, useEffect, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Heart, MessageCircle, Award, Send, CornerDownRight } from "lucide-react";
import { Post, Comment, samplePosts, guestUser, createAuthUser, createComment } from "@/data/forum";
import { getForumPostById, addComment as addDbComment } from "@/lib/db/forum";
import { clsx } from "clsx";
import { useUser } from "@/context/UserContext";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

function CommentItem({ 
  comment, 
  postId, 
  onReply,
  depth = 0 
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

  const canReply = depth < 2; // Max 2 levels of nesting

  return (
    <div className={clsx(depth > 0 && "ml-8 border-l-2 border-slate-100 pl-4")}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg">
            {comment.author.avatar}
          </div>
        </div>

        <div className="flex-1">
          {/* Author info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">{comment.author.name}</span>
            {comment.author.isConsultant && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                <Award className="w-2.5 h-2.5" />
                Consultant
              </span>
            )}
            <span className="text-slate-400 text-xs">· {formatTimeAgo(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="text-slate-700 text-sm mb-2">{comment.content}</p>

          {/* Actions */}
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

          {/* Reply Input */}
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

          {/* Nested Replies */}
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

  const currentAuthor = user
    ? createAuthUser(user.id, user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
    : guestUser;

  useEffect(() => {
    getForumPostById(postId).then((found) => {
      if (found) {
        startTransition(() => setPost(found));
      }
    }).catch(() => {
      const found = samplePosts.find(p => p.id === postId);
      if (found) {
        startTransition(() => setPost(found));
      }
    });
  }, [postId]);

  const handleLike = () => {
    if (!post) return;
    setLiked(!liked);
    setPost({
      ...post,
      likes: liked ? post.likes - 1 : post.likes + 1
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;

    const comment = createComment(newComment, currentAuthor);
    setPost({
      ...post,
      comments: [...post.comments, comment]
    });
    setNewComment("");

    // Persist to DB
    addDbComment(post.id, newComment, currentAuthor).catch(() => {});
  };

  const handleReply = (parentId: string, content: string) => {
    if (!post) return;

    const addReply = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, createComment(content, currentAuthor)]
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReply(comment.replies)
          };
        }
        return comment;
      });
    };

    setPost({
      ...post,
      comments: addReply(post.comments)
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Post not found</p>
          <Link href="/forum" className="text-emerald-600 hover:text-emerald-700">
            ← Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => router.back()} className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
              <span className="text-slate-600 hover:text-slate-900">Back</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">PathPal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Post Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
              {post.author.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{post.author.name}</span>
                {post.author.isConsultant && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    <Award className="w-3 h-3" />
                    Consultant
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h1>

          {/* Content */}
          <p className="text-slate-700 whitespace-pre-line mb-4">{post.content}</p>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="flex gap-3 mb-4">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="" className="max-w-xs rounded-lg" />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button 
              onClick={handleLike}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                liked ? "bg-red-50 text-red-500" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Heart className={clsx("w-5 h-5", liked && "fill-current")} />
              {post.likes} likes
            </button>
            <div className="flex items-center gap-2 text-slate-500">
              <MessageCircle className="w-5 h-5" />
              {post.comments.length} comments
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Comments</h2>

          {/* Comment Input */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
              {currentAuthor.avatar}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-slate-900 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comments List */}
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
              <p className="text-center text-slate-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}