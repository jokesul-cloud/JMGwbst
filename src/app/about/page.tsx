import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Users, Video } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About | Golf Splooch Lessons",
  description: "Learn more about Chris 'Splooch' Miller and our mission to help golfers of all levels.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Simplicity",
      description: "Complex mechanics explained in simple, actionable drills.",
      icon: <Target className="w-6 h-6 text-golf-green" />,
    },
    {
      title: "Community",
      description: "A supportive environment for golfers to grow together.",
      icon: <Users className="w-6 h-6 text-golf-green" />,
    },
    {
      title: "Expertise",
      description: "Decades of professional coaching experience at your fingertips.",
      icon: <Award className="w-6 h-6 text-golf-green" />,
    },
    {
      title: "Personalization",
      description: "Direct feedback on your swing from world-class coaches.",
      icon: <Video className="w-6 h-6 text-golf-green" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-golf-green/10 via-transparent to-transparent -z-10" />
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Master the game with <span className="text-golf-green">Splooch</span>.
              </h1>
              <p className="text-white/60 text-xl leading-relaxed">
                We believe that every golfer has the potential to play their best. 
                Our mission is to provide the highest quality instruction and tools 
                to help you reach your goals, whether you're a beginner or a seasoned pro.
              </p>
            </div>
          </div>
        </section>

        {/* Coach Section */}
        <section className="py-24 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                  <Image 
                    src="https://images.unsplash.com/photo-1593100126453-19b562a80027?q=80&w=2067&auto=format&fit=crop"
                    alt="Chris 'Splooch' Miller"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <h2 className="text-golf-green font-bold uppercase tracking-[0.2em] mb-4">The Lead Coach</h2>
                <h3 className="text-4xl font-bold text-white mb-6">Chris "Splooch" Miller</h3>
                <div className="space-y-6 text-white/60 text-lg">
                  <p>
                    With over 20 years of experience coaching players on the PGA and European Tours, 
                    Chris Miller (known affectionately in the golf world as "Splooch") has developed 
                    a unique approach to swing mechanics that emphasizes efficiency and repeatability.
                  </p>
                  <p>
                    His philosophy is simple: don't fight your natural tendencies—optimize them. 
                    Through Golf Splooch Lessons, Chris is bringing his tour-level insights 
                    directly to you.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-white/40 text-sm uppercase tracking-wider">Professional Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">15+</div>
                    <div className="text-white/40 text-sm uppercase tracking-wider">Tour Wins Coached</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Philosophy</h2>
              <p className="text-white/40 max-w-2xl mx-auto">
                We don't just teach you how to hit a ball. We teach you how to think, 
                practice, and play with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-zinc-900/30 border-white/5 hover:border-golf-green/30 transition-colors">
                  <CardContent className="p-8">
                    <div className="mb-4">{value.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-2">{value.title}</h4>
                    <p className="text-white/40">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
