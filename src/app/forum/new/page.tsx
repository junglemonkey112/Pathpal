"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createAuthUser, ForumCategory } from "@/data/forum";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES: { id: ForumCategory; emoji: string; labelKey: string }[] = [
  { id: "applications", emoji: "📝", labelKey: "forum.categories.applications" },
  { id: "essays", emoji: "✍️", labelKey: "forum.categories.essays" },
  { id: "financialAid", emoji: "💰", labelKey: "forum.categories.financialAid" },
  { id: "visas", emoji: "🛂", labelKey: "forum.categories.visas" },
  { id: "decisions", emoji: "🎉", labelKey: "forum.categories.decisions" },
  { id: "international", emoji: "🌏", labelKey: "forum.categories.international" },
];

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useUser();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumCategory>("applications");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t("forum.signInToPost")}</h2>
          <p className="text-slate-600 mb-4 text-sm">{t("forum.signInRequired")}</p>
          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2 mb-5 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">{t("forum.verificationNotice")}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800">{t("auth.signIn")}</Link>
            <Link href="/signup" className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-50">{t("auth.signUp")}</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);

    const author = createAuthUser(
      user.id,
      user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
    );

    const newPost = {
      id: `post-${Date.now()}`,
      author,
      title: title.trim(),
      content: content.trim(),
      category,
      images: [],
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      comments: [],
    };

    const existing = JSON.parse(localStorage.getItem("forum_posts") || "[]");
    localStorage.setItem("forum_posts", JSON.stringify([newPost, ...existing]));
    router.push("/forum");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/forum" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("forum.backToCommunity")}
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-5">{t("forum.newPost")}</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t("forum.categoryLabel")}</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      category === cat.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{cat.emoji}</span> {t(cat.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("forum.titleLabel")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("forum.titlePlaceholder")}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("forum.contentLabel")}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("forum.contentPlaceholder")}
                rows={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Link href="/forum" className="px-5 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium">{t("forum.cancel")}</Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("forum.posting") : t("forum.newPost")}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
