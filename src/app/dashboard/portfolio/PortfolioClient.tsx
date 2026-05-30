"use client";

import { useEffect } from "react";
import { AddAssetModal } from "@/components/portfolio/AddAssetModal";
import { DeleteAssetButton } from "@/components/portfolio/DeleteAssetButton";
import { calculateFDCurrentValue, calculateFDMaturityValue, calculateFDInterestPaidOut, getFDMaturityDate, calculateFDTDS } from "@/lib/calculations/fd";
import { formatINR } from "@/lib/formatters";
import { format } from "date-fns";
import { Wallet, TrendingUp, Loader2 } from "lucide-react";
import { useAssetStore } from "@/store/useAssetStore";

export function PortfolioClient() {
  const { assets, isLoading, fetchAssets } = useAssetStore();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const totalPrincipal = assets.reduce((sum, a) => sum + Number(a.amount), 0);
  const totalCurrentValue = assets.reduce((sum, a) => {
    if (a.type === "FD" && a.metadata) {
      const meta = a.metadata as any;
      return sum + calculateFDCurrentValue(
        Number(a.amount), 
        Number(meta.interestRate), 
        new Date(a.startDate), 
        meta.durationYears || 0,
        meta.durationMonths || 0,
        meta.durationDays || 0,
        meta.interestPayout,
        meta.compoundingFrequency || "Quarterly",
        meta.autoRenew || false
      );
    }
    return sum + Number(a.amount);
  }, 0);
  
  const totalReturns = totalCurrentValue - totalPrincipal;

  if (isLoading && assets.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Assets</h1>
          <p className="text-foreground/70 mt-1">Manage and track your investments.</p>
        </div>
        <AddAssetModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card/50 backdrop-blur-xl border border-separator/30 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Total Invested</h3>
          <div className="text-3xl font-bold">{formatINR(totalPrincipal)}</div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-separator/30 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Current Value</h3>
          <div className="text-3xl font-bold">{formatINR(totalCurrentValue)}</div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-separator/30 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Total Returns</h3>
          <div className="flex items-center gap-2">
            <div className={`text-3xl font-bold ${totalReturns >= 0 ? "text-success" : "text-destructive"}`}>
              {totalReturns >= 0 ? "+" : ""}{formatINR(totalReturns)}
            </div>
            {totalReturns >= 0 && <TrendingUp className="w-5 h-5 text-success" />}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Portfolio Holdings</h2>
      
      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-separator/50 rounded-3xl">
          <Wallet className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No assets found.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add your first asset to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((asset) => {
            const meta = (asset.metadata || {}) as any;
            
            let currentValue = Number(asset.amount);
            let returns = 0;
            let maturityValue = null;

            let paidOutInterest = 0;
            let tdsAmount = 0;
            let isMatured = false;
            let isAutoRenewing = false;

            if (asset.type === "FD") {
              const maturityDate = getFDMaturityDate(
                new Date(asset.startDate),
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0
              );
              isMatured = new Date() >= maturityDate;
              isAutoRenewing = isMatured && (meta.autoRenew === true);

              currentValue = calculateFDCurrentValue(
                Number(asset.amount), 
                Number(meta.interestRate), 
                new Date(asset.startDate), 
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0,
                meta.interestPayout,
                meta.compoundingFrequency || "Quarterly",
                meta.autoRenew || false
              );
              
              paidOutInterest = calculateFDInterestPaidOut(
                Number(asset.amount), 
                Number(meta.interestRate), 
                new Date(asset.startDate), 
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0,
                meta.interestPayout,
                meta.compoundingFrequency || "Quarterly",
                meta.autoRenew || false
              );

              tdsAmount = calculateFDTDS(
                Number(asset.amount), 
                Number(meta.interestRate), 
                new Date(asset.startDate), 
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0,
                meta.compoundingFrequency || "Quarterly",
                meta.autoRenew || false
              );

              returns = currentValue - Number(asset.amount) + paidOutInterest;
              maturityValue = calculateFDMaturityValue(
                Number(asset.amount),
                Number(meta.interestRate),
                new Date(asset.startDate),
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0,
                meta.interestPayout,
                meta.compoundingFrequency || "Quarterly"
              );
            }

            const cardClasses = isMatured && !isAutoRenewing
              ? "bg-warning/10 border-warning/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              : "bg-card/90 border-separator/30";

            return (
              <div key={asset.id} className={`${cardClasses} backdrop-blur-xl border p-5 rounded-xl shadow-sm flex flex-col transition-transform hover:scale-[1.01]`}>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{asset.type}</div>
                    {asset.type === "FD" && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{meta.bankName}</h3>
                    )}
                    {(asset.type === "Stock" || asset.type === "Mutual Fund") && meta.ticker && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{meta.ticker}</h3>
                    )}
                    
                    {asset.type === "FD" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.interestPayout} • {meta.compoundingFrequency} • {meta.interestRate}% p.a.
                      </p>
                    )}
                    {(asset.type === "Stock" || asset.type === "Mutual Fund") && meta.ticker && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.quantity} Units
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <DeleteAssetButton id={asset.id as number} type={asset.type as any} />
                    {isMatured && !isAutoRenewing && (
                      <span className="bg-warning/20 text-warning text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Matured</span>
                    )}
                    {isAutoRenewing && (
                      <span className="bg-tint/10 text-tint text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Auto-Renewing</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Principal</span>
                    <span className="font-semibold text-foreground">{formatINR(Number(asset.amount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Current Value</span>
                    <span className="font-semibold text-foreground">{formatINR(currentValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Returns</span>
                    <span className={`font-semibold ${returns + tdsAmount >= 0 ? "text-success" : "text-destructive"}`}>
                      {returns + tdsAmount >= 0 ? "+" : ""}{formatINR(returns + tdsAmount)}
                    </span>
                  </div>
                  {paidOutInterest > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-separator/20 mt-2">
                      <span className="text-muted-foreground font-medium">Interest Paid Out</span>
                      <span className="font-semibold text-tint">{formatINR(paidOutInterest)}</span>
                    </div>
                  )}
                  {asset.type === "FD" && (
                    <div className="flex justify-between text-sm pt-2 border-t border-separator/20 mt-2">
                      <span className="text-muted-foreground font-medium">TDS Deducted</span>
                      <span className={`font-semibold ${tdsAmount > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {tdsAmount > 0 ? "-" : ""}{formatINR(tdsAmount)}
                      </span>
                    </div>
                  )}
                  {maturityValue !== null && (
                    <div className="flex justify-between text-sm pt-2 border-t border-separator/20 mt-2">
                      <span className="text-muted-foreground font-medium">Maturity Value</span>
                      <span className="font-semibold text-foreground">{formatINR(maturityValue)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-separator/20 text-xs text-muted-foreground flex justify-between items-center font-medium">
                  <span>Started: {format(new Date(asset.startDate), "MMM dd, yyyy")}</span>
                  {asset.type === "FD" && (
                    <span>{meta.durationYears}Y {meta.durationMonths}M {meta.durationDays}D</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
