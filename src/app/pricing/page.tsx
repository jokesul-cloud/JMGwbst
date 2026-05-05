"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, Shield } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Free",
    price: "0",
    priceId: null,
    description: "Start your journey with essential drills and insights.",
    features: [
      "Access to 'Foundation' series",
      "Basic swing analysis guide",
      "Weekly newsletter",
      "Public community access"
    ],
    buttonText: "Start for Free",
    buttonVariant: "outline" as const,
    highlight: false
  },
  {
    name: "Premium Member",
    price: "29",
    priceId: "price_premium_monthly", // Placeholder
    period: "month",
    description: "The complete platform experience for serious golfers.",
    features: [
      "UNLIMITED access to all video series",
      "40% DISCOUNT on individual course purchases",
      "Personalized 'Coach Chat' (1 analysis/mo)",
      "Ad-free experience",
      "Offline viewing on mobile",
      "Exclusive training PDFs"
    ],
    buttonText: "Join Premium",
    buttonVariant: "default" as const,
    highlight: true,
    icon: <Star className="text-black" />
  },
  {
    name: "Elite Performance",
    price: "99",
    priceId: "price_elite_monthly", // Placeholder
    period: "month",
    description: "Tailored coaching for those chasing professional levels.",
    features: [
      "Everything in Premium",
      "UNLIMITED Coach Chat analysis",
      "1-on-1 Zoom call (30 mins/mo)",
      "Priority feedback (under 12h)",
      "Custom tournament prep plans",
      "Equipment optimization audit"
    ],
    buttonText: "Go Elite",
    buttonVariant: "outline" as const,
    highlight: false,
    icon: <Zap />
  }
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, priceId: string | null) => {
    if (!priceId) return;

    setLoading(planName);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: priceId,
          mode: "subscription",
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Invest in Your Game</h1>
              <p className="text-white/50 text-xl">
                Choose the plan that fits your ambition. From foundational drills to 1-on-1 elite coaching.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col p-8 rounded-[32px] border ${
                  plan.highlight 
                    ? "bg-golf-green border-golf-green shadow-[0_0_80px_-20px_rgba(34,197,94,0.3)]" 
                    : "bg-zinc-900/50 border-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full border border-white/20">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.highlight ? "bg-black/10" : "bg-golf-green/10 text-golf-green"
                  }`}>
                    {plan.icon || <Shield />}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-black" : "text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlight ? "text-black/60" : "text-white/40"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.highlight ? "text-black" : "text-white"}`}>${plan.price}</span>
                    {plan.period && (
                      <span className={plan.highlight ? "text-black/60" : "text-white/40"}>/{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-black" : "text-golf-green"}`} />
                      <span className={`text-sm ${plan.highlight ? "text-black/80" : "text-white/70"}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.name === "Free" ? (
                  <Link href="/signup">
                    <Button 
                      variant={plan.buttonVariant}
                      className="w-full h-14 rounded-2xl font-bold text-lg border-white/10 hover:bg-white/5"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => handleSubscribe(plan.name, plan.priceId)}
                    disabled={loading === plan.name}
                    variant={plan.buttonVariant}
                    className={`w-full h-14 rounded-2xl font-bold text-lg ${
                      plan.highlight 
                        ? "bg-black text-white hover:bg-black/90" 
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {loading === plan.name ? "Processing..." : plan.buttonText}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-white/30 text-sm">
              All plans include a 7-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
