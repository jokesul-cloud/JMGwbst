import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function MyLibrary() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch subscriptions
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Fetch purchased series
  const { data: purchases } = await supabase
    .from("purchases")
    .select("series(*)")
    .eq("user_id", user.id);

  // If subscribed, they have access to ALL series. 
  // For the POC, we'll fetch some "featured" or "all" series if subscribed.
  let seriesAccess = purchases?.map(p => p.series) || [];
  
  if (subscription) {
    const { data: allSeries } = await supabase
      .from("series")
      .select("*")
      .eq("is_published", true);
    
    if (allSeries) {
      seriesAccess = allSeries;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-12 pb-24">
        <div className="container mx-auto px-4">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Library</h1>
              <p className="text-white/50 text-lg">Your personal collection of golf mastery.</p>
            </div>
            
            {subscription && (
              <div className="bg-golf-green/10 border border-golf-green/20 px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle2 className="text-golf-green w-4 h-4" />
                <span className="text-golf-green text-sm font-bold uppercase tracking-wider">Active Premium Member</span>
              </div>
            )}
          </header>

          {seriesAccess.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seriesAccess.map((series: any) => (
                <Link key={series.id} href={`/series/${series.id}`}>
                  <Card className="group border-white/10 bg-zinc-900/50 overflow-hidden hover:border-golf-green/40 transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      {series.thumbnail_url ? (
                        <Image 
                          src={series.thumbnail_url} 
                          alt={series.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Play className="text-white/20 w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-golf-green rounded-full flex items-center justify-center text-black">
                          <Play fill="currentColor" size={24} />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl text-white group-hover:text-golf-green transition-colors">
                        {series.title}
                      </CardTitle>
                      <CardDescription className="text-white/40 line-clamp-2">
                        {series.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
              <div className="max-w-md mx-auto">
                <Play className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Your library is empty</h2>
                <p className="text-white/40 mb-8">
                  You haven't purchased any series or started a subscription yet. Elevate your game today.
                </p>
                <Link href="/library">
                  <Button className="bg-golf-green hover:bg-golf-green/90 text-black font-bold h-12 px-8 rounded-full">
                    Browse Catalogue
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
