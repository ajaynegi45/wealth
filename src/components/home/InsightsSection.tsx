import { TrendingUp } from "lucide-react";

export function InsightsSection() {
  return (
    <section className="bg-secondary/30 py-20 border-y border-separator/30" id="insights">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="text-sm text-tint font-bold uppercase tracking-widest mb-3">Answers in Seconds</p>
          <h2 className="font-heading text-4xl text-foreground font-bold mb-6">Insights at a glance</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Stop guessing. We crunch the numbers so you can instantly see the metrics that matter most.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Question 1 */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20">
            <h3 className="text-sm text-foreground/70 font-bold uppercase tracking-wider mb-6">Invested vs. Current Worth</h3>
            <div className="bg-background rounded-2xl p-6 border border-separator/20 mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-foreground/70">Cost Basis</span>
                <span className="font-medium text-foreground">$1,800,000</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-5">
                <div className="h-full bg-foreground/30 w-[60%] rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-foreground/70">Current Value</span>
                <span className="font-medium text-success text-lg font-bold">$2,450,890</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Question 2 */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20">
            <h3 className="text-sm text-foreground/70 font-bold uppercase tracking-wider mb-6">How much did it grow?</h3>
            <div className="bg-background rounded-2xl p-6 border border-separator/20 mt-auto flex flex-col items-center relative overflow-hidden min-h-[160px]">
              <div className="flex items-center gap-2 mb-2 z-10">
                <TrendingUp className="text-success w-6 h-6" />
                <span className="font-heading text-2xl text-success font-bold">+36.2%</span>
              </div>
              <span className="text-sm text-foreground/70 z-10">All-Time Return</span>
              
              <div className="absolute bottom-0 left-0 w-full h-24 z-0">
                <svg className="w-full h-full stroke-success stroke-2 fill-none stroke-[3px]" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0 40 Q 20 35, 40 25 T 70 15 T 100 5"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-success/10 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Question 3 */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20">
            <h3 className="text-sm text-foreground/70 font-bold uppercase tracking-wider mb-6">Asset Distribution</h3>
            <div className="bg-background rounded-2xl p-6 border border-separator/20 mt-auto flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-8 border-tint border-t-success border-l-warning transform rotate-45 shrink-0"></div>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tint"></span>
                    <span className="text-sm text-foreground/70">Equities</span>
                  </div>
                  <span className="font-medium text-foreground">50%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <span className="text-sm text-foreground/70">Real Estate</span>
                  </div>
                  <span className="font-medium text-foreground">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    <span className="text-sm text-foreground/70">Crypto</span>
                  </div>
                  <span className="font-medium text-foreground">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
