import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type PostCategory = "article" | "market-analysis";
export type PostType =
  | "Análisis"
  | "Educación"
  | "Research"
  | "DeFi"
  | "Trading";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  type?: PostType;
  author: string;
  image?: string;
  featured: boolean;
  published: boolean;
  category: PostCategory;
  content: string;
  readingTime: number; // in minutes
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  type?: PostType;
  image?: string;
  featured: boolean;
  category: PostCategory;
  readingTime: number;
}

// Calculate reading time based on word count (avg 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts: BlogPostMeta[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;

    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Skip unpublished posts (published defaults to true if not specified)
    if (data.published === false) continue;

    allPosts.push({
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      tags: data.tags || [],
      type: data.type as PostType | undefined,
      image: data.image as string | undefined,
      featured: data.featured || false,
      category: (data.category as PostCategory) || "article",
      readingTime: calculateReadingTime(content),
    });
  }

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Don't return unpublished posts
    const isPublished = data.published !== false;
    if (!isPublished) {
      return null;
    }

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      tags: data.tags || [],
      type: data.type as PostType | undefined,
      author: data.author || "Medusa Capital",
      image: data.image,
      featured: data.featured || false,
      published: isPublished,
      category: (data.category as PostCategory) || "article",
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch {
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      // Only include published posts
      if (data.published === false) {
        return null;
      }
      return slug;
    })
    .filter((slug): slug is string => slug !== null);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getPostsByCategory(category: PostCategory): BlogPostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}

export function getMarketAnalysisPosts(): BlogPostMeta[] {
  return getPostsByCategory("market-analysis");
}

export function getLatestMarketAnalysis(): BlogPostMeta | null {
  const posts = getMarketAnalysisPosts();
  return posts.length > 0 ? posts[0] : null;
}

export function getArticles(): BlogPostMeta[] {
  return getPostsByCategory("article");
}

export function getFeaturedArticles(): BlogPostMeta[] {
  return getArticles().filter((post) => post.featured);
}

export function getRegularArticles(): BlogPostMeta[] {
  return getArticles().filter((post) => !post.featured);
}
