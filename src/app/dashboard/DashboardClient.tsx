"use client";

import { useEffect } from "react";
import { useAssetStore } from "@/store/useAssetStore";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { Loader2 } from "lucide-react";

export function DashboardClient({ firstName }: { firstName: string }) {
  const { assets, isLoading, fetchAssets } = useAssetStore();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div className="w-full h-full">
      <div className="mb-8 max-w-lg mx-auto md:mx-0 text-center text-left">
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
        <NetWorthChart assets={assets} />
      )}
    </div>
  );
}
