import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, PlayCircle, TrendingUp, Home, LineChart, Link as LinkIcon, Sparkles, ShieldCheck, Lock, PieChart, Users } from "lucide-react";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-separator/50 h-16"></header>}>
        <Header />
      </Suspense>
      <main className="flex-1 w-full bg-background pt-16">
        
        {/* HERO SECTION */}
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
                <button className="flow-gradient-btn w-full sm:w-auto font-medium px-8 py-4 rounded-full flex items-center justify-center gap-2 text-base shadow-lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto font-medium px-8 py-4 text-tint bg-background border border-separator/50 rounded-full hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-base shadow-sm">
                  <PlayCircle className="w-5 h-5" /> See how it works
                </button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-4 mt-4 p-4 bg-secondary/50 backdrop-blur-md rounded-2xl w-fit border border-separator/30 shadow-sm">
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
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-sm text-foreground shadow-sm">+</div>
                </div>
                <p className="text-sm text-foreground/70 leading-tight">
                  Join <span className="font-bold text-foreground">50,000+</span> families<br />securing their legacy
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[45%] flex justify-center relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-success/20 blur-[80px] rounded-full w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
              <div className="absolute inset-0 bg-tint/10 blur-[100px] rounded-full w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
              
              <div className="relative w-[320px] h-[640px] bg-background rounded-[48px] border-[12px] border-foreground shadow-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute top-0 inset-x-0 h-7 bg-foreground rounded-b-2xl w-36 mx-auto z-20"></div>
                
                <div className="p-6 pt-14 h-full bg-card flex flex-col gap-6 relative">
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

        {/* HOW IT WORKS SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16" id="how-it-works">
          <div className="text-center mb-16">
            <p className="text-sm text-tint font-bold uppercase tracking-widest mb-3">Simple Setup</p>
            <h2 className="font-heading text-4xl text-foreground font-bold mb-6">How Wealth brings it all together</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-separator/50 z-0"></div>
            
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform duration-300">
                <LinkIcon className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3 font-bold">1. Securely Connect</h3>
              <p className="text-foreground/70 max-w-xs">
                Link your banks, brokerages, crypto, and real estate securely in seconds.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-success/20"></div>
                <Sparkles className="w-10 h-10 text-success relative z-10" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3 font-bold">2. Wealth Organizes</h3>
              <p className="text-foreground/70 max-w-xs">
                Our engine categorizes assets, calculates basis, and tracks historical values automatically.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-24 h-24 rounded-full bg-tint border-4 border-background shadow-md flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                <LineChart className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3 font-bold">3. See Your Legacy</h3>
              <p className="text-foreground/70 max-w-xs">
                Get a clear, unified view of your entire financial life and collaborate with your family.
              </p>
            </div>
          </div>
        </section>

        {/* INSIGHTS SECTION */}
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
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20 shadow-sm">
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
              
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20 shadow-sm">
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
              
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col hover:shadow-lg transition-shadow border border-separator/20 shadow-sm">
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

        {/* SECURITY BANNER */}
        <section className="bg-card text-foreground py-12 border-y border-separator/30" id="security">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 text-success">
                <ShieldCheck className="w-8 h-8" />
                <span className="text-sm font-bold uppercase tracking-widest">Why Trust Wealth?</span>
              </div>
              <h3 className="font-heading text-3xl mb-4 font-bold text-foreground">Bank-Level Security. Absolute Privacy.</h3>
              <p className="text-foreground/70 max-w-xl">
                Your financial data is yours alone. We connect with read-only access, meaning funds can never be moved. We use military-grade AES-256 encryption and never sell your personal information.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-2xl border border-separator/50 shadow-sm">
                <Lock className="text-success w-6 h-6" />
                <span className="font-medium text-foreground">AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-3 bg-background px-6 py-4 rounded-2xl border border-separator/50 shadow-sm">
                <ShieldCheck className="text-success w-6 h-6" />
                <span className="font-medium text-foreground">Read-Only Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20" id="features">
          <div className="text-center mb-16">
            <p className="text-sm text-tint font-bold uppercase tracking-widest mb-3">Complete Visibility</p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-6">Comprehensive Wealth Control</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              A unified view of everything you own and owe, designed with absolute clarity and precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,_auto)]">
            <div className="md:col-span-8 bg-card rounded-[32px] p-10 flex flex-col justify-between group hover:shadow-xl shadow-sm transition-all duration-500 relative overflow-hidden border border-separator/30">
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
              
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-secondary to-background rounded-full opacity-60 group-hover:scale-105 transition-transform duration-700"></div>
            </div>
            
            <div className="md:col-span-4 bg-gradient-to-b from-card to-background rounded-[32px] p-10 flex flex-col justify-between group hover:shadow-xl shadow-sm transition-all duration-500 border border-separator/30 relative overflow-hidden">
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
      </main>
      <Footer />
    </>
  );
}
