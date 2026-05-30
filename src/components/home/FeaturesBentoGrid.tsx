import { PieChart, Users, MonitorSmartphone, Smartphone, Tablet, Laptop } from "lucide-react";

export function FeaturesBentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20" id="features">
      <div className="text-center mb-16">
        <p className="text-sm text-tint font-bold uppercase tracking-widest mb-3">Complete Visibility</p>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-6">Comprehensive Wealth Control</h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          A unified view of everything you own and owe, designed with absolute clarity and precision.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,_auto)]">
        {/* All Assets Card */}
        <div className="md:col-span-8 bg-card rounded-[32px] p-10 flex flex-col justify-between group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden border border-separator/30">
          <div className="relative z-10 w-full md:w-3/4">
            <div className="w-14 h-14 rounded-2xl bg-tint/10 flex items-center justify-center mb-6">
              <PieChart className="w-8 h-8 text-tint" />
            </div>
            <h3 className="font-heading text-3xl text-foreground mb-4 font-bold">All Your Assets. One Ledger.</h3>
            <p className="text-lg text-foreground/70">
              From traditional equities to digital currencies, real estate, and precious metals. Track your entire portfolio across all institutions in beautifully organized detail.
            </p>
          </div>
          
          <div className="flex gap-3 mt-10 z-10 flex-wrap">
            <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground shadow-sm hover:bg-secondary/80 transition-colors cursor-default border border-separator/20">Stocks & Bonds</span>
            <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground shadow-sm hover:bg-secondary/80 transition-colors cursor-default border border-separator/20">Crypto</span>
            <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground shadow-sm hover:bg-secondary/80 transition-colors cursor-default border border-separator/20">Real Estate</span>
            <span className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground shadow-sm hover:bg-secondary/80 transition-colors cursor-default border border-separator/20">Private Equity</span>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-secondary to-background rounded-full opacity-60 group-hover:scale-105 transition-transform duration-700"></div>
        </div>
        
        {/* Family Net Worth Card */}
        <div className="md:col-span-4 bg-gradient-to-b from-card to-background rounded-[32px] p-10 flex flex-col justify-between group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 border border-separator/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-heading text-2xl text-foreground mb-3 font-bold">Collaborative Tracking</h3>
            <p className="text-foreground/70">
              Invite your partner, financial advisor, or CPA to view or manage shared goals with custom permission levels.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-8 relative z-10 bg-background p-4 rounded-2xl shadow-sm border border-separator/20">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full bg-tint text-white flex items-center justify-center font-medium border-2 border-background z-30 shadow-md">JD</div>
              <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center font-medium border-2 border-background z-20 shadow-md">MD</div>
              <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center font-medium border-2 border-background z-10 hover:bg-secondary/80 cursor-pointer transition-colors">+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
