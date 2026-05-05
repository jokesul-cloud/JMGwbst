import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SeriesContent } from "./SeriesContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: series } = await supabase
    .from("series")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!series) return { title: "Series Not Found" };

  return {
    title: series.title,
    description: series.description,
    openGraph: {
      title: series.title,
      description: series.description,
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Series
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("id", id)
    .single();

  if (!series) {
    notFound();
  }

  // 2. Fetch Videos
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("series_id", id)
    .order("position", { ascending: true });

  // 3. Check Access
  const { data: { user } } = await supabase.auth.getUser();
  let hasAccess = false;

  if (user) {
    // Check subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subscription) {
      hasAccess = true;
    } else {
      // Check individual purchase
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("series_id", id)
        .single();

      if (purchase) {
        hasAccess = true;
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow pt-12 pb-24">
        <SeriesContent 
          series={series} 
          videos={videos || []} 
          hasAccess={hasAccess} 
          user={user}
        />
      </main>
      <Footer />
    </div>
  );
}
