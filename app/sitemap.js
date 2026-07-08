import { site } from "@/data/site";
import { cities } from "@/data/cities";
import { posts } from "@/data/posts";

export default function sitemap() {
  const routes = ["", "/services", "/shop", "/work", "/gang-sheet", "/3d-printing", "/about", "/contact", "/quote", "/track", "/faq", "/blog", "/areas", "/es", "/es/cotizar"];
  const cityRoutes = cities.map((c) => `/areas/${c.slug}`);
  const postRoutes = posts.map((p) => `/blog/${p.slug}`);
  return [...routes, ...cityRoutes, ...postRoutes].map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.8,
  }));
}
