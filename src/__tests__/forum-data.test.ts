import { describe, it, expect } from "vitest";
import { samplePosts, guestUser, createComment, createAuthUser, type Post } from "@/data/forum";

describe("forum data integrity", () => {
  it("has 8 sample posts", () => {
    expect(samplePosts).toHaveLength(8);
  });

  it("all posts have unique IDs", () => {
    const ids = samplePosts.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all posts have required fields", () => {
    for (const post of samplePosts) {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.content).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.author).toBeDefined();
      expect(post.author.name).toBeTruthy();
      expect(post.createdAt).toBeInstanceOf(Date);
    }
  });

  it("all posts have valid categories", () => {
    const validCategories = ["applications", "essays", "financialAid", "visas", "decisions", "international"];
    for (const post of samplePosts) {
      expect(validCategories).toContain(post.category);
    }
  });

  it("counsellor authors have isCounsellor=true", () => {
    const counsellorPosts = samplePosts.flatMap(p =>
      p.comments.filter(c => c.author.school)
    );
    for (const comment of counsellorPosts) {
      expect(comment.author.isCounsellor).toBe(true);
    }
  });

  it("at least 2 posts are pinned", () => {
    const pinnedCount = samplePosts.filter(p => p.pinned).length;
    expect(pinnedCount).toBeGreaterThanOrEqual(2);
  });
});

describe("createComment", () => {
  it("creates a comment with correct structure", () => {
    const comment = createComment("test-id", guestUser, "Hello world");
    expect(comment.id).toBe("test-id");
    expect(comment.author).toBe(guestUser);
    expect(comment.content).toBe("Hello world");
    expect(comment.likes).toBe(0);
    expect(comment.likedBy).toEqual([]);
    expect(comment.replies).toEqual([]);
    expect(comment.createdAt).toBeInstanceOf(Date);
  });
});

describe("createAuthUser", () => {
  it("creates a user with correct defaults", () => {
    const user = createAuthUser("user-1", "Test User");
    expect(user.id).toBe("user-1");
    expect(user.name).toBe("Test User");
    expect(user.isCounsellor).toBe(false);
    expect(user.avatar).toBe("👤");
  });
});

describe("guestUser", () => {
  it("has expected properties", () => {
    expect(guestUser.id).toBe("guest");
    expect(guestUser.name).toBe("Guest");
    expect(guestUser.isCounsellor).toBe(false);
  });
});
