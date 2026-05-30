import Link from "next/link";
import { Wallet } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-separator/50">
      <div className="flex justify-between items-center px-6 md:px-10 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-foreground hover:scale-95 transition-transform cursor-pointer">
          <Wallet className="w-6 h-6 text-tint" />
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Wealth
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            How it Works
          </Link>
          <Link href="#insights" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            Insights
          </Link>
          <Link href="#security" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            Security
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden md:block font-medium text-sm px-4 py-2 text-tint hover:bg-tint/10 rounded-full transition-colors">
            Log In
          </button>
          <button className="flow-gradient-btn font-medium text-sm px-5 py-2.5 rounded-full shadow-md">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
