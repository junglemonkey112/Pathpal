import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  samplePosts as mockPosts,
  type Post,
  type Comment,
  type User,
  guestUser,
} from "@/data/forum";

interface DbPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_is_consultant: boolean;
  author_school: string | null;
  title: string;
  content: string;
  images: string[];
  likes: number;
  liked_by: string[];
  created_at: string;
}

interface DbComment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_is_consultant: boolean;
  author_school: string | null;
  content: string;
  likes: number;
  liked_by: string[];
  created_at: string;
}

function dbToUser(row: DbPost | DbComment): User {
  return {
    id: row.author_id,
    name: row.author_name,
    avatar: row.author_avatar,
    isConsultant: row.author_is_consultant,
    school: row.author_school ?? undefined,
  };
}

function dbToComment(row: DbComment, allComments: DbComment[]): Comment {
  const replies = allComments
    .filter((c) => c.parent_comment_id === row.id)
    .map((c) => dbToComment(c, allComments));

  return {
    id: row.id,
    author: dbToUser(row),
    content: row.content,
    createdAt: new Date(row.created_at),
    likes: row.likes,
    likedBy: row.liked_by ?? [],
    replies,
  };
}

function dbToPost(row: DbPost, comments: DbComment[]): Post {
  const postComments = comments.filter((c) => c.post_id === row.id);
  const topLevel = postComments.filter((c) => !c.parent_comment_id);

  return {
    id: row.id,
    author: dbToUser(row),
    title: row.title,
    content: row.content,
    images: row.images ?? [],
    createdAt: new Date(row.created_at),
    likes: row.likes,
    likedBy: row.liked_by ?? [],
    comments: topLevel.map((c) => dbToComment(c, postComments)),
  };
}

export async function getForumPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return mockPosts;

  const supabase = createClient();
  if (!supabase) return mockPosts;

  const [postsRes, commentsRes] = await Promise.all([
    supabase.from("forum_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("forum_comments").select("*").order("created_at", { ascending: true }),
  ]);

  if (postsRes.error || !postsRes.data?.length) return mockPosts;

  const comments = commentsRes.data ?? [];
  return postsRes.data.map((p: DbPost) => dbToPost(p, comments));
}

export async function getForumPostById(id: string): Promise<Post | undefined> {
  if (!isSupabaseConfigured) return mockPosts.find((p) => p.id === id);

  const supabase = createClient();
  if (!supabase) return mockPosts.find((p) => p.id === id);

  const [postRes, commentsRes] = await Promise.all([
    supabase.from("forum_posts").select("*").eq("id", id).single(),
    supabase.from("forum_comments").select("*").eq("post_id", id).order("created_at", { ascending: true }),
  ]);

  if (postRes.error || !postRes.data) return mockPosts.find((p) => p.id === id);

  const comments = commentsRes.data ?? [];
  return dbToPost(postRes.data, comments);
}

export async function createForumPost(
  title: string,
  content: string,
  images: string[] = [],
  author?: User
): Promise<Post | null> {
  const supabase = createClient();
  const user = author ?? guestUser;

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("forum_posts")
    .insert({
      author_id: user.id,
      author_name: user.name,
      author_avatar: user.avatar,
      author_is_consultant: user.isConsultant,
      author_school: user.school ?? null,
      title,
      content,
      images,
    })
    .select()
    .single();

  if (error || !data) return null;
  return dbToPost(data, []);
}

export async function addComment(
  postId: string,
  content: string,
  author?: User,
  parentCommentId?: string
): Promise<Comment | null> {
  const supabase = createClient();
  const user = author ?? guestUser;

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("forum_comments")
    .insert({
      post_id: postId,
      parent_comment_id: parentCommentId ?? null,
      author_id: user.id,
      author_name: user.name,
      author_avatar: user.avatar,
      author_is_consultant: user.isConsultant,
      author_school: user.school ?? null,
      content,
    })
    .select()
    .single();

  if (error || !data) return null;
  return dbToComment(data, []);
}
