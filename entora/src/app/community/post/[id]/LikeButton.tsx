"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const toggleLike = async () => {
    if (!user) return;

    if (liked) {
      setLikes((l) => l - 1);
      setLiked(false);
      await supabase
        .from("forum_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
      await supabase
        .from("forum_posts")
        .update({ likes_count: likes - 1 })
        .eq("id", postId);
    } else {
      setLikes((l) => l + 1);
      setLiked(true);
      await supabase
        .from("forum_likes")
        .insert({ user_id: user.id, post_id: postId });
      await supabase
        .from("forum_posts")
        .update({ likes_count: likes + 1 })
        .eq("id", postId);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors",
        liked
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
      {likes}
    </button>
  );
}
