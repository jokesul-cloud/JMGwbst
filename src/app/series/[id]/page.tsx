"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoPlayer } from "@/components/video/video-player";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Lock, CheckCircle2, Clock, Star, ChevronLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

// Mock data for the specific series
const SERIES_DATA: Record<string, any> = {
  "1": {
    id: "1",
    title: "The Ultimate Drive: Power & Accuracy",
    description: "Learn how to add 30 yards to your drive while hitting more fairways. This comprehensive 12-part series covers everything from setup and posture to advanced kinetic sequencing for maximum clubhead speed.",
    category: "Driver",
    price: 49.99,
    rating: 4.9,
    reviews: 128,
    instructor: "Chris 'Splooch' Miller",
    duration: "4h 15m",
    lessons: [
      { id: "v1", title: "Introduction & Philosophy", duration: "08:24", isPreview: true },
      { id: "v2", title: "The Perfect Setup & Stance", duration: "12:45", isPreview: false },
      { id: "v3", title: "Grip Pressure Secrets", duration: "10:15", isPreview: false },
      { id: "v4", title: "The Backswing: Width & Depth", duration: "15:30", isPreview: false },
      { id: "v5", title: "Transition: The 'Magic' Move", duration: "14:20", isPreview: false },
      { id: "v6", title: "Impact Zone Dynamics", duration: "11:50", isPreview: false },
      { id: "v7", title: "Speed Drills: Part 1", duration: "18:10", isPreview: false },
    ]
  },
  "2": {
    id: "2",
    title: "Mastering the Wedge: 100 Yards & In",
    description: "Stop wasting strokes around the green with this complete wedge system. Master distance control, flighting your shots, and spinning the ball like a tour pro.",
    category: "Short Game",
    price: 39.99,
    rating: 4.8,
    reviews: 95,
    instructor: "Sarah Jenkins",
    duration: "2h 45m",
    lessons: [
      { id: "v1", title: "Wedge System Overview", duration: "10:15", isPreview: true },
      { id: "v2", title: "The Clock System", duration: "15:45", isPreview: false },
      { id: "v3", title: "Controlling Trajectory", duration: "12:30", isPreview: false },
      { id: "v4", title: "Spin Control Masterclass", duration: "14:20", isPreview: false },
    ]
  }
};

export default function SeriesDetail() {
  const params = useParams();
  const id = params.id as string;
  const series = SERIES_DATA[id] || SERIES_DATA["1"]; // Default to 1 if not found
  
  const [activeLesson, setActiveLesson] = useState(series.lessons[0]);

  const videoOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        type: "video/mp4",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/library" className="inline-flex items-center text-white/50 hover:text-golf-green mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Video Player & Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {activeLesson.isPreview ? (
                  <VideoPlayer options={videoOptions} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-golf-green/10 rounded-full flex items-center justify-center text-golf-green mb-4">
                      <Lock size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Premium Content</h3>
                    <p className="text-white/50 max-w-md mx-auto">
                      This lesson is part of the premium series. Purchase this series or subscribe to unlock all content.
                    </p>
                    <div className="flex gap-4">
                      <Button className="bg-golf-green hover:bg-golf-green/90 text-black font-bold">
                        Buy Series for ${series.price}
                      </Button>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        View Subscriptions
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-golf-green/10 text-golf-green text-[10px] font-bold uppercase tracking-widest rounded border border-golf-green/20">
                      Lesson {series.lessons.indexOf(activeLesson) + 1}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{activeLesson.title}</h1>
                  </div>
                  <p className="text-white/40">Part of: {series.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="border-white/10 rounded-full">
                    <Share2 size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="border-white/10 rounded-full">
                    <Download size={18} />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-zinc-900 border border-white/5 p-1 rounded-xl w-full md:w-auto">
                  <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-golf-green data-[state=active]:text-black">About Series</TabsTrigger>
                  <TabsTrigger value="instructor" className="rounded-lg data-[state=active]:bg-golf-green data-[state=active]:text-black">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-golf-green data-[state=active]:text-black">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-8">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/60 leading-relaxed text-lg">
                      {series.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {[
                        "12 High-definition lessons",
                        "Detailed PDF training guides",
                        "Direct instructor Q&A",
                        "Lifetime access to content",
                        "Exclusive mobile access",
                        "Personalized drill plans"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                          <CheckCircle2 className="text-golf-green w-5 h-5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="instructor" className="mt-8">
                  <div className="flex items-center gap-6 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                    <div className="w-24 h-24 rounded-full bg-golf-green/20 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{series.instructor}</h3>
                      <p className="text-white/50 text-sm italic mb-4">PGA Certified Professional • 15+ Years Experience</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Chris has coached over 500+ students from beginners to tour professionals. His philosophy focuses on biomechanics and simplified mental cues.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl font-bold text-white">{series.rating}</div>
                      <div>
                        <div className="flex text-yellow-500">
                          <Star fill="currentColor" size={20} />
                          <Star fill="currentColor" size={20} />
                          <Star fill="currentColor" size={20} />
                          <Star fill="currentColor" size={20} />
                          <Star fill="currentColor" size={20} />
                        </div>
                        <p className="text-white/40 text-sm mt-1">{series.reviews} ratings</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Playlist */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 rounded-2xl border border-white/10 flex flex-col h-[700px] sticky top-24">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">Series Content</h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/40 text-sm">{series.lessons.length} Lessons</p>
                    <p className="text-white/40 text-sm">{series.duration}</p>
                  </div>
                </div>
                
                <ScrollArea className="flex-grow">
                  <div className="p-2">
                    {series.lessons.map((lesson: any, index: number) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all group ${
                          activeLesson.id === lesson.id 
                            ? "bg-golf-green/10 border border-golf-green/20" 
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="relative flex-shrink-0 w-24 aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                          {activeLesson.id === lesson.id ? (
                             <div className="absolute inset-0 flex items-center justify-center bg-golf-green/20">
                               <motion.div 
                                 animate={{ scale: [1, 1.2, 1] }} 
                                 transition={{ repeat: Infinity, duration: 1.5 }}
                                 className="w-2 h-2 bg-golf-green rounded-full shadow-[0_0_10px_#22c55e]" 
                               />
                             </div>
                          ) : !lesson.isPreview ? (
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
                             activeLesson.id === lesson.id ? "text-golf-green" : "text-white/30"
                          }`}>
                            Lesson {index + 1}
                          </span>
                          <span className={`text-sm font-medium leading-tight mb-2 ${
                            activeLesson.id === lesson.id ? "text-white" : "text-white/70 group-hover:text-white"
                          }`}>
                            {lesson.title}
                          </span>
                          <div className="flex items-center text-[10px] text-white/30 uppercase tracking-tighter">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                            {lesson.isPreview && (
                              <span className="ml-2 text-golf-green font-bold">Preview</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-2xl">
                  <Button className="w-full bg-golf-green hover:bg-golf-green/90 text-black font-bold h-12">
                    Unlock All Lessons
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
