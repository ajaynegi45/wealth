"use client";

import { useEffect, useState } from "react";
import { AddAssetModal } from "@/components/portfolio/AddAssetModal";
import { DeleteAssetButton } from "@/components/portfolio/DeleteAssetButton";
import { calculateFDCurrentValue, calculateFDMaturityValue, calculateFDInterestPaidOut, getFDMaturityDate, calculateFDTDS } from "@/lib/calculations/fd";
import { calculateBankCurrentValue } from "@/lib/calculations/bank";
import { formatINR } from "@/lib/formatters";
import { format, intervalToDuration } from "date-fns";
import { Wallet, TrendingUp, Loader2 } from "lucide-react";
import { useAssetStore } from "@/store/useAssetStore";
import Link from "next/link";

const FILTERS = ["All", "FD", "PPF", "NPS", "Bank Account", "Stocks", "Mutual Funds"];

export function PortfolioClient() {
  const { assets, isLoading, fetchAssets } = useAssetStore();
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const totalPrincipal = assets.reduce((sum, a) => {
    if (a.type === "PPF" && a.metadata && (a.metadata as any).rawTransactions) {
      const principal = (a.metadata as any).rawTransactions.reduce((acc: number, t: any) => {
        if (t.type === "Deposit") return acc + Number(t.amount);
        if (t.type === "Withdrawal") return acc - Number(t.amount);
        return acc;
      }, 0);
      return sum + principal;
    }
    return sum + Number(a.amount);
  }, 0);
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
    } else if (a.type === "Bank Balance" && a.metadata) {
      const meta = a.metadata as any;
      if (meta.accountType === "Savings") {
        return sum + calculateBankCurrentValue(
          Number(a.amount),
          Number(meta.interestRate),
          new Date(a.startDate),
          meta.interestPayout
        );
      }
      return sum + Number(a.amount);
    }
    return sum + Number(a.amount);
  }, 0);
  
  const totalReturns = totalCurrentValue - totalPrincipal;

  const filteredAssets = filterType === "All" ? assets : assets.filter(a => {
    if (filterType === "Bank Account") return a.type === "Bank Balance";
    if (filterType === "Stocks") return a.type === "Stock";
    if (filterType === "Mutual Funds") return a.type === "Mutual Fund";
    return a.type === filterType;
  });

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
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Total Invested</h3>
          <div className="text-3xl font-bold">{formatINR(totalPrincipal)}</div>
        </div>
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">Current Value</h3>
          <div className="text-3xl font-bold">{formatINR(totalCurrentValue)}</div>
        </div>
        <div className="bg-card/50 border border-separator/30 p-6 rounded-2xl shadow-sm">
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
      
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === f
                ? "bg-tint text-primary-foreground shadow-sm"
                : "bg-card/50 text-muted-foreground border border-separator/80 hover:bg-card hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-separator/50 rounded-3xl">
          <Wallet className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No assets found.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {filterType !== "All" ? `You don't have any ${filterType} assets yet.` : "Add your first asset to start tracking."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => {
            const meta = (asset.metadata || {}) as any;
            
            let currentValue = Number(asset.amount);
            let returns = 0;
            let maturityValue = null;

            let paidOutInterest = 0;
            let tdsAmount = 0;
            let isMatured = false;
            let isAutoRenewing = false;

            if (asset.type === "FD") {
              const originalMaturityDate = getFDMaturityDate(
                new Date(asset.startDate),
                meta.durationYears || 0,
                meta.durationMonths || 0,
                meta.durationDays || 0
              );
              isMatured = new Date() >= originalMaturityDate;
              isAutoRenewing = isMatured && (meta.autoRenew === true);

              let currentMaturityDate = originalMaturityDate;
              if (isAutoRenewing) {
                while (currentMaturityDate <= new Date()) {
                  currentMaturityDate = getFDMaturityDate(
                    currentMaturityDate,
                    meta.durationYears || 0,
                    meta.durationMonths || 0,
                    meta.durationDays || 0
                  );
                }
              }
              meta.displayMaturityDate = currentMaturityDate;

              if (isAutoRenewing) {
                const duration = intervalToDuration({ start: new Date(asset.startDate), end: new Date() });
                meta.displayDuration = [
                  duration.years ? `${duration.years}Y` : null,
                  duration.months ? `${duration.months}M` : null,
                  duration.days ? `${duration.days}D` : null,
                ].filter(Boolean).join(" ");
              } else {
                meta.displayDuration = [
                  meta.durationYears ? `${meta.durationYears}Y` : null,
                  meta.durationMonths ? `${meta.durationMonths}M` : null,
                  meta.durationDays ? `${meta.durationDays}D` : null,
                ].filter(Boolean).join(" ");
              }

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
                meta.compoundingFrequency || "Quarterly",
                meta.autoRenew || false
              );
            } else if (asset.type === "PPF" && meta.rawTransactions) {
              const ppfPrincipal = meta.rawTransactions.reduce((acc: number, t: any) => {
                if (t.type === "Deposit") return acc + Number(t.amount);
                if (t.type === "Withdrawal") return acc - Number(t.amount);
                return acc;
              }, 0);
              returns = currentValue - ppfPrincipal;
            } else if (asset.type === "Bank Balance") {
              if (meta.accountType === "Savings") {
                currentValue = calculateBankCurrentValue(
                  Number(asset.amount),
                  Number(meta.interestRate),
                  new Date(asset.startDate),
                  meta.interestPayout
                );
                returns = currentValue - Number(asset.amount);
              } else {
                returns = 0;
                currentValue = Number(asset.amount);
              }
            }
            
            const displayPrincipal = asset.type === "PPF" ? Number(asset.amount) - returns : Number(asset.amount);

            const cardClasses = isMatured && !isAutoRenewing
              ? "bg-warning/10 border-warning/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              : isAutoRenewing
              ? "bg-tint/5 border-tint/40 shadow-sm"
              : "bg-card/90 border-separator/30";

            return (
              <div key={`${asset.type}-${asset.id}`} className={`${cardClasses} border p-5 rounded-xl shadow-sm flex flex-col transition-transform hover:scale-[1.01]`}>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{asset.type}</div>
                    {asset.type === "FD" && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{meta.bankName}</h3>
                    )}
                    {asset.type === "Bank Balance" && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{meta.bankName}</h3>
                    )}
                    {(asset.type === "Stock" || asset.type === "Mutual Fund") && meta.ticker && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{meta.ticker}</h3>
                    )}
                    {asset.type === "PPF" && (
                      <h3 className="font-bold text-foreground text-lg leading-tight mb-1">Public Provident Fund</h3>
                    )}
                    
                    {asset.type === "FD" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.interestPayout} • {meta.compoundingFrequency} • {meta.interestRate}% p.a.
                      </p>
                    )}
                    {asset.type === "Bank Balance" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.accountType} {meta.accountType === "Savings" ? `• ${meta.interestRate}% p.a. • ${meta.interestPayout}` : ""}
                      </p>
                    )}
                    {(asset.type === "Stock" || asset.type === "Mutual Fund") && meta.ticker && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.quantity} Units
                      </p>
                    )}
                    {asset.type === "PPF" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {meta.transactionsCount || 0} Transactions
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
                    <span className="font-semibold text-foreground">{formatINR(displayPrincipal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Returns</span>
                    <span className={`font-semibold ${returns >= 0 ? "text-success" : "text-destructive"}`}>
                      {returns >= 0 ? "+" : ""}{formatINR(returns)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Current Value</span>
                    <span className="font-semibold text-foreground">{formatINR(currentValue)}</span>
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
                  <div className="flex flex-col gap-1">
                    <span>Started: {format(new Date(asset.startDate), "MMM dd, yyyy")}</span>
                    {asset.type === "FD" && meta.displayMaturityDate && (
                      <span>Matures: {format(meta.displayMaturityDate, "MMM dd, yyyy")}</span>
                    )}
                    {asset.type === "PPF" && meta.maturityDate && (
                      <span>Matures: {format(new Date(meta.maturityDate), "MMM dd, yyyy")}</span>
                    )}
                  </div>
                  {asset.type === "FD" && (
                    <div className="flex flex-col items-end gap-1 text-right">
                      <span>{meta.displayDuration}</span>
                      {isAutoRenewing && (
                        <span className="text-[10px] opacity-70 tracking-widest uppercase">Total Active</span>
                      )}
                    </div>
                  )}
                  {asset.type === "PPF" && (
                    <div className="flex flex-col items-end gap-1 text-right">
                      <Link href="/dashboard/portfolio/ppf" className="text-tint hover:underline text-sm font-bold flex items-center">
                        View Ledger &rarr;
                      </Link>
                    </div>
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
