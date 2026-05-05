import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://golf-splooch.vercel.app";

  // Static routes
  const routes = [
    "",
    "/library",
    "/pricing",
    "/about",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes (Series)
  try {
    const supabase = await createClient();
    const { data: series } = await supabase
      .from("series")
      .select("id")
      .eq("is_published", true);

    if (series) {
      const seriesRoutes = series.map((s) => ({
        url: `${baseUrl}/series/${s.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
      return [...routes, ...seriesRoutes];
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
  }

  return routes;
}
