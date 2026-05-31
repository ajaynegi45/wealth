"use client";

import { useEffect } from "react";
import { useAssetStore } from "@/store/useAssetStore";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { PPFChart } from "@/components/dashboard/PPFChart";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function DashboardClient({ firstName }: { firstName: string }) {
  const { assets, isLoading, fetchAssets } = useAssetStore();
  const { hideAmounts, toggleHideAmounts } = useUIStore();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const fdAssets = assets.filter((a) => a.type === "FD");
  const stockAssets = assets.filter((a) => a.type === "Stock");
  const mfAssets = assets.filter((a) => a.type === "Mutual Fund");
  const ppfAssets = assets.filter((a) => a.type === "PPF");
  const bankAssets = assets.filter((a) => a.type === "Bank Balance");

  return (
    <div className="w-full h-full pb-10">
      <div className="mb-8 flex flex-row justify-between items-start gap-4">
        <div className="max-w-lg text-left">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight text-foreground mb-3">
            Welcome back,<br />
            {firstName}.
          </h1>
          <p className="text-foreground/70 text-lg">
            Here is a summary of your financial landscape today.
          </p>
        </div>
        <div>
          <button 
            onClick={toggleHideAmounts}
            className="flex items-center justify-center px-1 py-1 md:px-3 md:py-3 rounded-full text-zinc-700 hover:text-zinc-500 transition-colors hover:cursor-pointer mt-1"
            title={hideAmounts ? "Show Amounts" : "Hide Amounts"}
          >
            {hideAmounts ? <EyeOff className="w-7 h-7" /> : <Eye className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {isLoading && assets.length === 0 ? (
        <div className="w-full h-[400px] flex items-center justify-center bg-card rounded-xl border border-separator/30">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <NetWorthChart assets={assets} title="Live Net Worth" />

          {(fdAssets.length > 0 || stockAssets.length > 0 || mfAssets.length > 0 || ppfAssets.length > 0 || bankAssets.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 mt-6">
              {fdAssets.length > 0 && <NetWorthChart assets={fdAssets} title="Fixed Deposits" />}
              {stockAssets.length > 0 && <NetWorthChart assets={stockAssets} title="Stocks" />}
              {mfAssets.length > 0 && <NetWorthChart assets={mfAssets} title="Mutual Funds" />}
              {ppfAssets.length > 0 && <PPFChart asset={ppfAssets[0]} title="Public Provident Fund" />}
              {bankAssets.length > 0 && <NetWorthChart assets={bankAssets} title="Bank Balances" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
