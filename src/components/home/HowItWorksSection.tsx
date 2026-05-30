import { Link, Sparkles, LineChart } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16" id="how-it-works">
      <div className="text-center mb-16">
        <p className="text-sm text-tint font-bold uppercase tracking-widest mb-3">Simple Setup</p>
        <h2 className="font-heading text-4xl text-foreground font-bold mb-6">How Wealth brings it all together</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Connecting Line (Desktop only) */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-separator/50 z-0"></div>
        
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center relative z-10 group">
          <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-sm flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform duration-300">
            <Link className="w-10 h-10" />
          </div>
          <h3 className="font-heading text-xl text-foreground mb-3 font-bold">1. Securely Connect</h3>
          <p className="text-foreground/70 max-w-xs">
            Link your banks, brokerages, crypto, and real estate securely in seconds.
          </p>
        </div>
        
        {/* Step 2 */}
        <div className="flex flex-col items-center text-center relative z-10 group">
          <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-success/20"></div>
            <Sparkles className="w-10 h-10 text-success relative z-10" />
          </div>
          <h3 className="font-heading text-xl text-foreground mb-3 font-bold">2. Wealth Organizes</h3>
          <p className="text-foreground/70 max-w-xs">
            Our engine categorizes assets, calculates basis, and tracks historical values automatically.
          </p>
        </div>
        
        {/* Step 3 */}
        <div className="flex flex-col items-center text-center relative z-10 group">
          <div className="w-24 h-24 rounded-full bg-tint border-4 border-background shadow-xl shadow-tint/20 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
            <LineChart className="w-10 h-10" />
          </div>
          <h3 className="font-heading text-xl text-foreground mb-3 font-bold">3. See Your Legacy</h3>
          <p className="text-foreground/70 max-w-xs">
            Get a clear, unified view of your entire financial life and collaborate with your family.
          </p>
        </div>
      </div>
    </section>
  );
}
