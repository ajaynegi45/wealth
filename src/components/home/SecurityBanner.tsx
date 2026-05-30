import { ShieldCheck, Lock } from "lucide-react";

export function SecurityBanner() {
  return (
    <section className="bg-foreground text-background py-12 border-b border-foreground/80" id="security">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 text-success">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-sm font-bold uppercase tracking-widest">Why Trust Wealth?</span>
          </div>
          <h3 className="font-heading text-3xl mb-4 font-bold text-background">Bank-Level Security. Absolute Privacy.</h3>
          <p className="text-background/80 max-w-xl">
            Your financial data is yours alone. We connect with read-only access, meaning funds can never be moved. We use military-grade AES-256 encryption and never sell your personal information.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-background/10 px-6 py-4 rounded-2xl border border-background/20">
            <Lock className="text-success w-6 h-6" />
            <span className="font-medium text-background">AES-256 Encryption</span>
          </div>
          <div className="flex items-center gap-3 bg-background/10 px-6 py-4 rounded-2xl border border-background/20">
            <ShieldCheck className="text-success w-6 h-6" />
            <span className="font-medium text-background">Read-Only Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
