"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";

const categories = [
  { slug: "general", name: "General" },
  { slug: "essays", name: "Essays" },
  { slug: "financial-aid", name: "Financial Aid" },
  { slug: "international", name: "International" },
  { slug: "test-prep", name: "Test Prep" },
];

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("forum_categories")
        .select("id, slug");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.slug] = c.id));
        setCategoryMap(map);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);

    const { data, error: insertError } = await supabase
      .from("forum_posts")
      .insert({
        author_id: user.id,
        category_id: categoryMap[categorySlug] || null,
        title: title.trim(),
        content: content.trim(),
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else if (data) {
      router.push(`/community/post/${data.id}`);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to community
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create a post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="title"
          label="Title"
          placeholder="What's your question or topic?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or experience..."
            rows={8}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/community">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!title.trim() || !content.trim() || submitting}
          >
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
