"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChevronRight, Play, Star, Trophy, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-52 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-golf-green/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-golf-green/10 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-golf-green/10 text-golf-green rounded-full border border-golf-green/20">
                  Elite Golf Training Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-tight">
                  Master Your Swing with <br className="hidden md:block" />
                  <span className="text-golf-green italic">Pro-Level</span> Insights
                </h1>
                <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                  Access premium video series, personalized feedback, and elite training drills used by the world's best players. Transform your game today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="h-14 px-10 text-lg bg-golf-green hover:bg-golf-green/90 text-black font-bold rounded-full group">
                      Start Your Journey
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/library">
                    <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 hover:bg-white/5 rounded-full">
                      Explore Library
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Featured Image/Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-golf-green rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_50px_-10px_rgba(34,197,94,0.5)]">
                    <Play className="w-8 h-8 text-black fill-current" />
                  </div>
                </div>
                {/* Simulated Thumbnail */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-10 -right-10 hidden lg:block bg-black/90 border border-white/10 p-6 rounded-xl backdrop-blur-xl shadow-2xl max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-golf-green/20 flex items-center justify-center text-golf-green">
                    <Star fill="currentColor" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Personal Feedback</h4>
                    <p className="text-white/40 text-xs">Direct from certified coaches</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-golf-green" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Splooch Advantage</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                We combine high-definition educational content with direct access to professional coaching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Play className="w-8 h-8" />,
                  title: "Elite Video Library",
                  description: "Hundreds of HD drills and full course management series updated monthly."
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Coach Chat",
                  description: "Upload your swing and get a personalized video analysis from our team."
                },
                {
                  icon: <Trophy className="w-8 h-8" />,
                  title: "Structured Learning",
                  description: "Follow-along programs designed to take you from high-handicap to scratch."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-black border border-white/5 hover:border-golf-green/20 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-xl bg-golf-green/10 text-golf-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription CTA */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="relative rounded-[32px] overflow-hidden bg-golf-dark border border-golf-green/30 p-8 md:p-16">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80')] bg-cover bg-center -z-10" />
              
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
                  Unlock Unlimited Access
                </h2>
                <div className="space-y-4 mb-10">
                  {[
                    "All premium video series included",
                    "40% discount on individual course purchases",
                    "Priority Coach Chat response time",
                    "Exclusive monthly webinars",
                    "Downloadable training PDFs"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-golf-green w-5 h-5 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-golf-green hover:bg-golf-green/90 text-black font-bold h-14 px-8 rounded-full">
                      View Membership Tiers
                    </Button>
                  </Link>
                  <p className="flex items-center text-white/40 text-sm italic">
                    Cancel anytime, no strings attached.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
