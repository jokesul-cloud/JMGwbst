import { CoachChat } from "@/components/dashboard/coach-chat";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function CoachChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
                  Coach Chat
                </h1>
                <p className="text-white/40 text-sm leading-relaxed">
                  Your private channel for elite swing analysis and direct feedback from our certified coaching staff.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <ShieldCheck className="text-golf-green w-5 h-5" />,
                    title: "Private & Secure",
                    desc: "Your videos and conversations are only visible to you and your assigned coach."
                  },
                  {
                    icon: <Sparkles className="text-golf-green w-5 h-5" />,
                    title: "Expert Analysis",
                    desc: "Get frame-by-frame breakdowns and custom drill recommendations."
                  },
                  {
                    icon: <MessageSquare className="text-golf-green w-5 h-5" />,
                    title: "24h Response",
                    desc: "Premium members receive feedback within 24 hours of upload."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-white/30 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-golf-green/5 border border-golf-green/20">
                <h4 className="text-golf-green font-bold text-sm mb-2 uppercase tracking-wider">Quick Tip</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  For the best analysis, record your swing from both the **Down-the-Line** and **Face-On** angles in slow motion.
                </p>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <CoachChat />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
