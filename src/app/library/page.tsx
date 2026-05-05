"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Search, Filter, Clock, Star, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = ["All", "Swing Mechanics", "Short Game", "Driver", "Putting", "Course Management"];

const MOCK_SERIES = [
  {
    id: "1",
    title: "The Ultimate Drive: Power & Accuracy",
    description: "Learn how to add 30 yards to your drive while hitting more fairways.",
    thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80",
    category: "Driver",
    price: 49.99,
    videosCount: 12,
    rating: 4.9,
    isPremium: true
  },
  {
    id: "2",
    title: "Mastering the Wedge: 100 Yards & In",
    description: "Stop wasting strokes around the green with this complete wedge system.",
    thumbnail: "https://images.unsplash.com/photo-1592919016327-5130ed821375?auto=format&fit=crop&q=80",
    category: "Short Game",
    price: 39.99,
    videosCount: 8,
    rating: 4.8,
    isPremium: true
  },
  {
    id: "3",
    title: "Putting Perfection: Pure Roll Every Time",
    description: "Build a repeatable stroke and learn how to read greens like a pro.",
    thumbnail: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80",
    category: "Putting",
    price: 29.99,
    videosCount: 10,
    rating: 5.0,
    isPremium: true
  },
  {
    id: "4",
    title: "Foundation: The Perfect Setup",
    description: "The essentials of posture, grip, and alignment for a consistent swing.",
    thumbnail: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80",
    category: "Swing Mechanics",
    price: 0,
    videosCount: 5,
    rating: 4.7,
    isPremium: false
  },
  {
    id: "5",
    title: "Breaking 90: Course Strategy",
    description: "Strategic decision making for golfers looking to break 90 consistently.",
    thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80",
    category: "Course Management",
    price: 59.99,
    videosCount: 15,
    rating: 4.6,
    isPremium: true
  },
  {
    id: "6",
    title: "Iron Play: Crisp Contact",
    description: "Techniques for better compression and distance control with your irons.",
    thumbnail: "https://images.unsplash.com/photo-1623512873551-7bd5de67f7c5?auto=format&fit=crop&q=80",
    category: "Swing Mechanics",
    price: 44.99,
    videosCount: 9,
    rating: 4.9,
    isPremium: true
  }
];

export default function Library() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSeries = MOCK_SERIES.filter(series => {
    const matchesCategory = activeCategory === "All" || series.category === activeCategory;
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         series.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-12 pb-24">
        <div className="container mx-auto px-4">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Video Library</h1>
            <p className="text-white/50 text-lg">Master every aspect of your game with our premium video series.</p>
          </header>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <Input 
                placeholder="Search drills, series, or topics..." 
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus:border-golf-green/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-14 px-6 rounded-xl whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-golf-green text-black hover:bg-golf-green/90 font-bold" 
                      : "border-white/10 hover:bg-white/5 text-white/70"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeries.map((series, i) => (
              <motion.div
                key={series.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/series/${series.id}`}>
                  <Card className="group border-white/10 bg-zinc-900/50 overflow-hidden hover:border-golf-green/40 transition-all hover:translate-y-[-4px]">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={series.thumbnail} 
                        alt={series.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-golf-green rounded-full flex items-center justify-center text-black">
                          <Play fill="currentColor" size={24} />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                          {series.category}
                        </span>
                      </div>
                      {series.isPremium && (
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-yellow-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-yellow-500 border border-yellow-500/30">
                            <Lock size={14} />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center text-xs text-white/40">
                          <Clock className="w-3 h-3 mr-1" />
                          {series.videosCount} Lessons
                        </div>
                        <div className="flex items-center text-xs text-yellow-500/80">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {series.rating}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-golf-green transition-colors leading-tight">
                        {series.title}
                      </CardTitle>
                      <CardDescription className="text-white/40 line-clamp-2 mt-2">
                        {series.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="p-6 pt-0 flex items-center justify-between">
                      <div className="text-white font-bold">
                        {series.price === 0 ? (
                          <span className="text-golf-green uppercase text-sm tracking-wider">Free</span>
                        ) : (
                          <span>${series.price}</span>
                        )}
                      </div>
                      <Button variant="link" className="text-golf-green p-0 h-auto font-bold group-hover:underline">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredSeries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg italic">No series found matching your criteria.</p>
              <Button 
                variant="link" 
                className="text-golf-green mt-4"
                onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
