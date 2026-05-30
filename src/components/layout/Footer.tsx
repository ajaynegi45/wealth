import Link from "next/link";
import { Wallet } from "lucide-react";

export async function Footer() {
  'use cache';
  return (
    <footer className="w-full py-12 border-t border-separator bg-background max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2 font-heading text-xl font-bold text-foreground opacity-90 hover:opacity-100 transition-opacity">
        <Wallet className="w-6 h-6 text-tint" /> Wealth
      </div>
      <div className="font-medium text-sm text-foreground/60 text-center md:text-left">
        © {new Date().getFullYear()} Wealth Management. All rights reserved.
      </div>
      <div className="flex gap-6 font-medium text-sm">
        <Link href="#" className="text-foreground/60 hover:text-tint transition-colors">Privacy Policy</Link>
        <Link href="#" className="text-foreground/60 hover:text-tint transition-colors">Terms of Service</Link>
        <Link href="#" className="text-foreground/60 hover:text-tint transition-colors">Security</Link>
        <Link href="#" className="text-foreground/60 hover:text-tint transition-colors">Support</Link>
      </div>
    </footer>
  );
}
