"use client";

import { useState, useEffect } from "react";
import { formatINR } from "@/lib/formatters";
import { calculateOldRegimeTax, calculateNewRegimeTax } from "@/lib/calculations/tax";
import { updateUserTaxProfile, getUserTaxProfile } from "@/app/actions/tax";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function TaxPage() {
  const [profile, setProfile] = useState<{grossIncome: number; deduction80c: number; otherDeductions: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [grossIncome, setGrossIncome] = useState("");
  const [deduction80c, setDeduction80c] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const data = await getUserTaxProfile();
        if (mounted) {
          setProfile(data);
          setGrossIncome(data.grossIncome.toString());
          setDeduction80c(data.deduction80c.toString());
          setOtherDeductions(data.otherDeductions.toString());
        }
      } catch (error) {
        console.error("Failed to fetch tax profile:", error);
      }
    };
    
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        grossIncome: Number(grossIncome),
        deduction80c: Number(deduction80c),
        otherDeductions: Number(otherDeductions)
      };
      await updateUserTaxProfile(data);
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-tint" />
      </div>
    );
  }

  const oldTax = calculateOldRegimeTax(profile.grossIncome, profile.deduction80c, profile.otherDeductions);
  const newTax = calculateNewRegimeTax(profile.grossIncome);

  const isOldBetter = oldTax.totalTax < newTax.totalTax;
  const isNewBetter = newTax.totalTax < oldTax.totalTax;

  return (
    <div className="w-full h-full pb-10">
      <div className="mb-8 max-w-lg mx-auto md:mx-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
          Tax Calculator
        </h1>
        <p className="text-foreground/70 text-lg">
          Compare Old vs New Tax Regimes (FY 24-25)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Old Regime Card */}
        <div className={`relative bg-card p-6 rounded-2xl border-2 transition-all ${isOldBetter ? 'border-success shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'border-separator/20 shadow-sm'}`}>
          {isOldBetter && (
            <div className="absolute -top-3 right-6 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Recommended
            </div>
          )}
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Old Regime Tax</h3>
          <div className="text-4xl font-bold text-foreground mb-6">{formatINR(oldTax.totalTax)}</div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>Taxable Income</span> <span className="font-medium text-foreground">{formatINR(oldTax.taxableIncome)}</span></div>
            <div className="flex justify-between"><span>Base Tax</span> <span className="font-medium text-foreground">{formatINR(oldTax.baseTax)}</span></div>
            <div className="flex justify-between"><span>Rebate 87A</span> <span className="font-medium text-foreground">-{formatINR(oldTax.rebate)}</span></div>
            <div className="flex justify-between"><span>Cess (4%)</span> <span className="font-medium text-foreground">{formatINR(oldTax.cess)}</span></div>
          </div>
        </div>

        {/* New Regime Card */}
        <div className={`relative bg-card p-6 rounded-2xl border-2 transition-all ${isNewBetter ? 'border-success shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'border-separator/20 shadow-sm'}`}>
          {isNewBetter && (
            <div className="absolute -top-3 right-6 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Recommended
            </div>
          )}
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">New Regime Tax</h3>
          <div className="text-4xl font-bold text-foreground mb-6">{formatINR(newTax.totalTax)}</div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>Taxable Income</span> <span className="font-medium text-foreground">{formatINR(newTax.taxableIncome)}</span></div>
            <div className="flex justify-between"><span>Base Tax</span> <span className="font-medium text-foreground">{formatINR(newTax.baseTax)}</span></div>
            <div className="flex justify-between"><span>Rebate 87A</span> <span className="font-medium text-foreground">-{formatINR(newTax.rebate)}</span></div>
            <div className="flex justify-between"><span>Cess (4%)</span> <span className="font-medium text-foreground">{formatINR(newTax.cess)}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-separator/30 rounded-2xl p-6 shadow-sm max-w-3xl">
        <h3 className="text-lg font-bold text-foreground mb-1">Your Tax Profile</h3>
        <p className="text-sm text-muted-foreground mb-6">Update your income and deductions. We'll securely save it to your profile for future visits.</p>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Gross Annual Income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <input
                type="number"
                required
                className="w-full bg-secondary/50 border-0 rounded-xl pl-10 pr-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-tint transition-all"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">80C Deductions (Max 1.5L)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                <input
                  type="number"
                  required
                  className="w-full bg-secondary/50 border-0 rounded-xl pl-10 pr-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-tint transition-all"
                  value={deduction80c}
                  onChange={(e) => setDeduction80c(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Other Deductions (HRA, 80D, etc.)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                <input
                  type="number"
                  required
                  className="w-full bg-secondary/50 border-0 rounded-xl pl-10 pr-4 py-3 text-foreground font-medium focus:ring-2 focus:ring-tint transition-all"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-tint hover:bg-tint/90 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 flex items-center justify-center disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save & Recalculate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
