"use client";

import { useState } from "react";
import { addAsset } from "@/app/actions/assets";
import { toast } from "sonner";
import { Plus, X, ChevronDown } from "lucide-react";

import { useAssetStore } from "@/store/useAssetStore";

export function AddAssetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assetType, setAssetType] = useState<"FD" | "Stock" | "Mutual Fund">("FD");
  const [bankSelection, setBankSelection] = useState("HDFC Bank");
  const { invalidate, fetchAssets } = useAssetStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amountStr = formData.get("amount") as string;
    const startDateStr = formData.get("startDate") as string;
    
    if (!amountStr || !startDateStr) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const amount = Number(amountStr);
    const startDate = new Date(startDateStr);
    
    let metadata: any = {};

    if (assetType === "FD") {
      const customBankName = formData.get("customBankName") as string;
      const finalBankName = bankSelection === "Other" ? customBankName : bankSelection;
      
      if (bankSelection === "Other" && !customBankName) {
        toast.error("Please enter a custom bank name.");
        return;
      }
      
      const intRate = formData.get("interestRate") as string;
      if (!intRate) {
        toast.error("Please enter an interest rate.");
        return;
      }

      metadata = {
        bankName: finalBankName,
        interestRate: Number(intRate),
        durationYears: Number(formData.get("durationYears")),
        durationMonths: Number(formData.get("durationMonths")),
        durationDays: Number(formData.get("durationDays")),
        interestPayout: formData.get("interestPayout") as string,
        compoundingFrequency: formData.get("compoundingFrequency") as string,
        autoRenew: formData.get("autoRenew") === "true",
      };
    } else if (assetType === "Stock" || assetType === "Mutual Fund") {
      const ticker = formData.get("ticker") as string;
      const qtyStr = formData.get("quantity") as string;
      
      if (!ticker || !qtyStr) {
        toast.error("Please fill out the Ticker and Quantity.");
        return;
      }
      
      metadata = {
        ticker: ticker,
        quantity: Number(qtyStr),
      };
    }

    setLoading(true);
    try {
      await addAsset({
        type: assetType,
        amount,
        startDate,
        metadata
      });
      invalidate();
      await fetchAssets(true);
      toast.success(`${assetType} added successfully!`);
      setIsOpen(false);
    } catch (error) {
      toast.error(`Failed to add ${assetType}`);
    } finally {
      setLoading(false);
    }
  }

  const inputBase = "flex h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm transition-all outline-none focus:border-tint focus:ring-1 focus:ring-tint/20 placeholder:text-muted-foreground/60";
  const selectBase = `${inputBase} pr-10 appearance-none cursor-pointer`;
  const labelBase = "text-sm font-medium leading-none text-zinc-700";

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-tint text-background px-4 py-2 rounded-sm font-medium shadow-sm hover:opacity-90 transition-opacity hover:cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Asset
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[7px] transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50 w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] duration-200 animate-in fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold tracking-tight">Add New Asset</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label htmlFor="assetType" className={labelBase}>Asset Type <span className="text-destructive">*</span></label>
                <div className="relative">
                  <select 
                    id="assetType"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    className={selectBase}
                  >
                    <option value="FD">Fixed Deposit</option>
                    <option value="Stock">Stock</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {assetType === "FD" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="bankSelect" className={labelBase}>Bank <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <select 
                          id="bankSelect"
                          value={bankSelection}
                          onChange={(e) => setBankSelection(e.target.value)}
                          className={selectBase}
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Other">Other...</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    {bankSelection === "Other" ? (
                      <div className="space-y-1.5">
                        <label htmlFor="customBankName" className={labelBase}>Enter Bank <span className="text-destructive">*</span></label>
                        <input id="customBankName" name="customBankName" placeholder="e.g. Yes Bank" className={inputBase} />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label htmlFor="interestRate" className={labelBase}>Interest Rate (%) <span className="text-destructive">*</span></label>
                        <input id="interestRate" name="interestRate" type="number" step="0.01" placeholder="6.50" className={inputBase} />
                      </div>
                    )}
                  </div>
                  
                  {bankSelection === "Other" && (
                    <div className="space-y-1.5">
                      <label htmlFor="interestRate" className={labelBase}>Interest Rate (%) <span className="text-destructive">*</span></label>
                      <input id="interestRate" name="interestRate" type="number" step="0.01" placeholder="6.50" className={inputBase} />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className={labelBase}>Duration (Y / M / D) <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      <input name="durationYears" type="number" placeholder="Year" className={inputBase} />
                      <input name="durationMonths" type="number" placeholder="Month" className={inputBase} />
                      <input name="durationDays" type="number" placeholder="Day" className={inputBase} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="compoundingFrequency" className={labelBase}>Compounding <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <select 
                          id="compoundingFrequency"
                          name="compoundingFrequency" 
                          defaultValue="Quarterly"
                          className={selectBase}
                        >
                          <option value="Daily">Daily</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="interestPayout" className={labelBase}>Interest Payout <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <select 
                          id="interestPayout"
                          name="interestPayout" 
                          defaultValue="Maturity"
                          className={selectBase}
                        >
                          <option value="Maturity">Maturity</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(assetType === "Stock" || assetType === "Mutual Fund") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ticker" className={labelBase}>Ticker Symbol <span className="text-destructive">*</span></label>
                    <input id="ticker" name="ticker" placeholder="e.g. RELIANCE" className={inputBase} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="quantity" className={labelBase}>Quantity <span className="text-destructive">*</span></label>
                    <input id="quantity" name="quantity" type="number" step="0.01" className={inputBase} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label htmlFor="amount" className={labelBase}>{assetType === "FD" ? "Principal (₹)" : "Total Invested (₹)"} <span className="text-destructive">*</span></label>
                    <input id="amount" name="amount" type="number" step="0.01" placeholder="100000" className={inputBase} />
                 </div>
                 <div className="space-y-1.5">
                    <label htmlFor="startDate" className={labelBase}>Purchase Date <span className="text-destructive">*</span></label>
                    <input id="startDate" name="startDate" type="date" className={inputBase} />
                 </div>
              </div>

              {assetType === "FD" && (
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="autoRenew" name="autoRenew" value="true" className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600/20" />
                  <label htmlFor="autoRenew" className="font-normal text-sm text-muted-foreground cursor-pointer">Auto-renew on maturity</label>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button disabled={loading} type="submit" className="w-full bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-emerald-800 transition-all cursor-pointer disabled:opacity-50">
                  {loading ? "Saving..." : `Save ${assetType}`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
