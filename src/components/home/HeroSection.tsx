import { ArrowRight, PlayCircle, TrendingUp, Home, LineChart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground/80 text-sm mb-8 border border-separator/50 shadow-sm hover:bg-secondary/80 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> 
            Introducing Family Collaboration 
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-6 leading-tight tracking-tight">
            Know exactly what you own.<br />
            <span className="text-foreground/60">And what it's worth.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-xl leading-relaxed">
            The ultimate command center for your entire financial life. See your unified financial legacy in one beautifully simple, totally secure dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
            <button className="w-full sm:w-auto font-medium px-8 py-4 bg-tint text-white rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-tint/20 flex items-center justify-center gap-2 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto font-medium px-8 py-4 text-tint bg-background border-2 border-tint/30 rounded-full hover:bg-tint/10 transition-colors flex items-center justify-center gap-2 text-base">
              <PlayCircle className="w-5 h-5" /> See how it works
            </button>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center gap-4 mt-4 p-4 bg-secondary/50 backdrop-blur-md rounded-2xl w-fit border border-separator/30">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 overflow-hidden">
                <img alt="User" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User+One&background=random" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 overflow-hidden">
                <img alt="User" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User+Two&background=random" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 overflow-hidden">
                <img alt="User" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User+Three&background=random" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-sm text-foreground">+</div>
            </div>
            <p className="text-sm text-foreground/70 leading-tight">
              Join <span className="font-bold text-foreground">50,000+</span> families<br />securing their legacy
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex justify-center relative mt-12 lg:mt-0">
          {/* Abstract decorative elements behind phone */}
          <div className="absolute inset-0 bg-success/20 blur-[80px] rounded-full w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
          <div className="absolute inset-0 bg-tint/10 blur-[100px] rounded-full w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
          
          {/* Phone Mockup */}
          <div className="relative w-[320px] h-[640px] bg-background rounded-[48px] border-[12px] border-foreground shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-7 bg-foreground rounded-b-2xl w-36 mx-auto z-20"></div>
            
            {/* Mockup Content */}
            <div className="p-6 pt-14 h-full bg-card flex flex-col gap-6 relative">
              {/* Decorative gradient in phone */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 rounded-full blur-3xl z-0"></div>
              
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <p className="text-sm text-foreground/70 font-medium tracking-wide">Total Net Worth</p>
                  <p className="font-heading text-3xl text-foreground font-bold tracking-tight">$2,450,890</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              
              {/* Graph Placeholder */}
              <div className="h-40 w-full relative z-10 rounded-2xl overflow-hidden shadow-sm bg-background flex items-end">
                <svg className="w-full h-full stroke-success stroke-2 fill-none stroke-[3px]" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0 40 Q 10 30, 20 35 T 40 20 T 60 25 T 80 5 T 100 10"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
              </div>
              
              <div className="flex flex-col gap-3 relative z-10">
                <p className="text-xs text-foreground/60 uppercase tracking-widest font-semibold mb-1">Top Assets</p>
                
                <div className="bg-background p-4 rounded-2xl flex justify-between items-center shadow-sm border border-separator/20 hover:border-separator/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-semibold">Real Estate</p>
                      <p className="text-xs text-foreground/60">Primary Residence</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-semibold">$1.2M</p>
                </div>
                
                <div className="bg-background p-4 rounded-2xl flex justify-between items-center shadow-sm border border-separator/20 hover:border-separator/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
                      <LineChart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-semibold">Equities</p>
                      <p className="text-xs text-foreground/60">Vanguard S&P 500</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-semibold">$850k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
