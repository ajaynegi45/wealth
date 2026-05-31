"use client";

import { useEffect } from "react";
import { useAssetStore } from "@/store/useAssetStore";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { PPFChart } from "@/components/dashboard/PPFChart";
import { Loader2 } from "lucide-react";

export function DashboardClient({ firstName }: { firstName: string }) {
  const { assets, isLoading, fetchAssets } = useAssetStore();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const fdAssets = assets.filter((a) => a.type === "FD");
  const stockAssets = assets.filter((a) => a.type === "Stock");
  const mfAssets = assets.filter((a) => a.type === "Mutual Fund");
  const ppfAssets = assets.filter((a) => a.type === "PPF");

  return (
    <div className="w-full h-full pb-10">
      <div className="mb-8 max-w-lg mx-auto md:mx-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
          Welcome back,<br />
          {firstName}.
        </h1>
        <p className="text-foreground/70 text-lg">
          Here is a summary of your financial landscape today.
        </p>
      </div>

      {isLoading && assets.length === 0 ? (
        <div className="w-full h-[400px] flex items-center justify-center bg-card rounded-xl border border-separator/30">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <NetWorthChart assets={assets} title="Live Net Worth" />

          {(fdAssets.length > 0 || stockAssets.length > 0 || mfAssets.length > 0 || ppfAssets.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 mt-6">
              {fdAssets.length > 0 && <NetWorthChart assets={fdAssets} title="Fixed Deposits" />}
              {stockAssets.length > 0 && <NetWorthChart assets={stockAssets} title="Stocks" />}
              {mfAssets.length > 0 && <NetWorthChart assets={mfAssets} title="Mutual Funds" />}
              {ppfAssets.length > 0 && <PPFChart asset={ppfAssets[0]} title="Public Provident Fund" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
