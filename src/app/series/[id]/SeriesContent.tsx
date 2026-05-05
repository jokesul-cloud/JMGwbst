"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, CheckCircle2, Clock, Star, Download, Share2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/video/video-player";
import Image from "next/image";

interface SeriesContentProps {
  series: any;
  videos: any[];
  hasAccess: boolean;
  user: any;
}

export function SeriesContent({ series, videos, hasAccess, user }: SeriesContentProps) {
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId: series.id,
          mode: "payment",
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setLoading(false);
    }
  };

  const videoOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: activeVideo?.video_url || "",
        type: "video/mp4",
      },
    ],
  };

  const isLocked = (video: any) => {
    if (hasAccess) return false;
    return !video.is_preview;
  };

  return (
    <div className="container mx-auto px-4">
      {/* Back Button */}
      <Link 
        href="/library" 
        className="inline-flex items-center text-white/50 hover:text-golf-green transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Video Player & Info */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 mb-8 relative">
            {isLocked(activeVideo) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                  <Lock size={40} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">This lesson is locked</h3>
                <p className="text-white/50 mb-8 max-w-md">
                  Purchase this series or start a premium membership to unlock all lessons in this course.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handlePurchase}
                    disabled={loading}
                    className="bg-golf-green hover:bg-golf-green/90 text-black font-bold h-12 px-8 rounded-full"
                  >
                    {loading ? "Processing..." : `Unlock Series for $${series.price}`}
                  </Button>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-8 rounded-full">
                      View Memberships
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <VideoPlayer options={videoOptions} key={activeVideo?.id} />
            )}
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-golf-green font-bold text-sm uppercase tracking-widest mb-2 block">
                  {series.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{series.title}</h1>
                <div className="flex items-center gap-4 text-white/40 text-sm">
                  <span className="flex items-center gap-1">
                    <Star fill="#eab308" className="text-yellow-500 w-4 h-4" />
                    <span className="text-white font-medium">{series.rating || 4.9}</span>
                  </span>
                  <span>•</span>
                  <span>{series.instructor || "Chris Miller"}</span>
                  <span>•</span>
                  <span>{videos.length} Lessons</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5">
                  <Share2 size={18} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5">
                  <Download size={18} />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-12 p-0 gap-8">
                <TabsTrigger 
                  value="overview" 
                  className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-golf-green data-[state=active]:bg-transparent data-[state=active]:text-golf-green px-0 h-12 font-bold transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="instructor" 
                  className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-golf-green data-[state=active]:bg-transparent data-[state=active]:text-golf-green px-0 h-12 font-bold transition-all"
                >
                  Instructor
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-golf-green data-[state=active]:bg-transparent data-[state=active]:text-golf-green px-0 h-12 font-bold transition-all"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-8">
                <p className="text-white/60 leading-relaxed text-lg mb-8">
                  {series.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master the fundamental mechanics",
                    "Eliminate common swing faults",
                    "Professional drills you can do at home",
                    "Advanced sequencing for more power"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <CheckCircle2 className="text-golf-green w-5 h-5 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="pt-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 overflow-hidden relative">
                    <Image src={series.instructor_avatar || "https://images.unsplash.com/photo-1544161515-436cefd1f16d?q=80&w=200&auto=format&fit=crop"} alt={series.instructor} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{series.instructor || "Chris 'Splooch' Miller"}</h3>
                    <p className="text-golf-green text-sm font-medium">Head PGA Professional</p>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed">
                  Chris has over 15 years of experience coaching elite golfers. His unique approach to swing mechanics simplifies complex movements into actionable drills that produce immediate results.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="pt-8">
                <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-white">{series.rating || 4.9}</div>
                    <div>
                      <div className="flex text-yellow-500">
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                      </div>
                      <p className="text-white/40 text-sm mt-1">{series.reviews || 128} ratings</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column: Playlist */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 rounded-2xl border border-white/10 flex flex-col h-[700px] sticky top-24">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Series Content</h2>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/40 text-sm">{videos.length} Lessons</p>
                <p className="text-white/40 text-sm">{series.duration || "4h 15m"}</p>
              </div>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-2">
                {videos.map((video: any, index: number) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all group ${
                      activeVideo?.id === video.id
                        ? "bg-golf-green/10 border border-golf-green/20"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0 w-24 aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                      {video.thumbnail_url ? (
                        <Image src={video.thumbnail_url} alt={video.title} fill className="object-cover opacity-50" />
                      ) : null}
                      
                      {activeVideo?.id === video.id ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-golf-green/20">
                           <motion.div
                             animate={{ scale: [1, 1.2, 1] }}
                             transition={{ repeat: Infinity, duration: 1.5 }}
                             className="w-2 h-2 bg-golf-green rounded-full shadow-[0_0_10px_#22c55e]"
                           />
                         </div>
                      ) : isLocked(video) ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <Lock size={12} className="text-white/40" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={12} className="text-white/40 group-hover:text-golf-green transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                         activeVideo?.id === video.id ? "text-golf-green" : "text-white/30"
                      }`}>
                        Lesson {index + 1}
                      </span>
                      <span className={`text-sm font-medium leading-tight mb-2 ${
                        activeVideo?.id === video.id ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}>
                        {video.title}
                      </span>
                      <div className="flex items-center text-[10px] text-white/30 uppercase tracking-tighter">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}m` : "10:00"}
                        {video.is_preview && (
                          <span className="ml-2 text-golf-green font-bold">Preview</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            {!hasAccess && (
              <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-2xl">
                <Button 
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-full bg-golf-green hover:bg-golf-green/90 text-black font-bold h-12"
                >
                  {loading ? "Processing..." : `Unlock All for $${series.price}`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
