"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR } from "@/lib/formatters";
import { useUIStore } from "@/store/useUIStore";
import { calculatePPFLedger } from "@/lib/calculations/ppf";
import { addMonths, addDays, addYears, format, min, max, differenceInDays, differenceInMonths, differenceInYears, isBefore, isAfter } from "date-fns";

export function PPFChart({ asset, title = "PPF Growth & Simulation" }: { asset: any, title?: string }) {
  const { hideAmounts } = useUIStore();
  const today = new Date();

  if (!asset || !asset.metadata || !asset.metadata.rawTransactions) {
    return null;
  }

  const startDate = new Date(asset.startDate);
  const rawTransactions = asset.metadata.rawTransactions;

  // 1. Calculate Actual Ledger
  const { ledger: actualLedger, currentBalance: actualBalance } = calculatePPFLedger(startDate, rawTransactions);

  // 2. Calculate Ideal Ledger (All deposits shifted to the 5th of the month)
  const idealTransactions = rawTransactions.map((t: any) => {
    const tDate = new Date(t.transactionDate);
    if (t.type === 'Deposit' && tDate.getDate() > 5) {
      const idealDate = new Date(tDate.getFullYear(), tDate.getMonth(), 5);
      return { ...t, transactionDate: idealDate };
    }
    return t;
  });
  
  const { ledger: idealLedger, currentBalance: idealBalance } = calculatePPFLedger(startDate, idealTransactions);

  const lostInterest = idealBalance - actualBalance;
  const hasLostInterest = lostInterest > 0;
  const showSimulation = hasLostInterest;

  // 3. Generate Chart Data
  let chartData: any[] = [];
  
  const totalDays = Math.max(1, differenceInDays(today, startDate));
  
  let granularity: "days" | "months" | "years" = "months";
  if (totalDays <= 31) granularity = "days";
  else if (totalDays > 365 * 3) granularity = "years";
  else granularity = "months";

  let stepDays = 1, stepMonths = 1, stepYears = 1;
  if (granularity === "days") stepDays = Math.max(1, Math.floor(totalDays / 14));
  else if (granularity === "months") {
    const totalMonths = Math.max(1, differenceInMonths(today, startDate));
    stepMonths = Math.max(1, Math.floor(totalMonths / 24)); 
  } else if (granularity === "years") {
    const totalYears = Math.max(1, differenceInYears(today, startDate));
    stepYears = Math.max(1, Math.floor(totalYears / 10));
  }

  let currDate = new Date(startDate);
  if (granularity === "days") currDate = addDays(currDate, -stepDays);
  if (granularity === "months") currDate = addMonths(currDate, -stepMonths);
  if (granularity === "years") currDate = addYears(currDate, -stepYears);

  // Helper to find balance at a specific date from a ledger
  const getBalanceAtDate = (ledger: any[], targetDate: Date) => {
    let bal = 0;
    for (let i = 0; i < ledger.length; i++) {
      if (new Date(ledger[i].date) <= targetDate) {
        bal = ledger[i].balance;
      } else {
        break;
      }
    }
    return bal;
  };

  const getPrincipalAtDate = (transactions: any[], targetDate: Date) => {
    let principal = 0;
    for (const t of transactions) {
      if (new Date(t.transactionDate) <= targetDate) {
        if (t.type === 'Deposit') principal += Number(t.amount);
        if (t.type === 'Withdrawal') principal -= Number(t.amount);
      }
    }
    return Math.max(0, principal);
  };

  while (currDate <= today) {
    let label = "";
    if (granularity === "days") label = format(currDate, "MMM dd");
    if (granularity === "months") label = format(currDate, "MMM yy");
    if (granularity === "years") label = format(currDate, "yyyy");

    const actualVal = getBalanceAtDate(actualLedger, currDate);
    const idealVal = getBalanceAtDate(idealLedger, currDate);
    const principalVal = getPrincipalAtDate(rawTransactions, currDate);
    const gainsVal = Math.max(0, actualVal - principalVal);
    const lostInterestVal = Math.max(0, idealVal - actualVal);

    chartData.push({
      timeLabel: label,
      principal: principalVal,
      gains: gainsVal,
      lostInterest: hasLostInterest && lostInterestVal > 0 ? lostInterestVal + Math.max(500, actualVal * 0.015) : 0,
      lostInterestTrue: lostInterestVal,
      actualBalance: actualVal,
      idealBalance: idealVal,
    });

    if (granularity === "days") currDate = addDays(currDate, stepDays);
    else if (granularity === "months") currDate = addMonths(currDate, stepMonths);
    else if (granularity === "years") currDate = addYears(currDate, stepYears);
  }

  const currentPrincipal = getPrincipalAtDate(rawTransactions, today);
  const currentGains = Math.max(0, actualBalance - currentPrincipal);
  const currentLostInterest = Math.max(0, idealBalance - actualBalance);

  // Always add 'today' as the final point to ensure exact current balance is visible
  chartData.push({
    timeLabel: "Today",
    principal: currentPrincipal,
    gains: currentGains,
    lostInterest: hasLostInterest && currentLostInterest > 0 ? currentLostInterest + Math.max(500, actualBalance * 0.015) : 0,
    lostInterestTrue: currentLostInterest,
    actualBalance: actualBalance,
    idealBalance: idealBalance,
  });

  const chartConfig = {
    principal: {
      label: "Invested Amount",
      color: "#71717A", // Zinc-500
    },
    gains: {
      label: "Interest Gained",
      color: "#10B981", // Emerald
    },
    lostInterest: {
      label: "Lost Interest",
      color: "#F97316", // Orange
    }
  } satisfies ChartConfig;

  return (
    <div className="w-full bg-card rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-separator/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 px-8 pt-8">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
            {title}
            {hasLostInterest && (
              <button type="button" className="group relative cursor-help flex items-center outline-none">
                <Info className="w-4 h-4 text-orange-500" />
                <div className="absolute top-full mt-2 hidden group-hover:block group-focus:block w-56 sm:w-64 p-2.5 bg-zinc-800 text-zinc-100 text-xs rounded-md shadow-xl z-50 text-left normal-case tracking-normal font-normal right-[-70] sm:right-auto sm:left-0">
                  Depositing after the 5th of a month loses out on that month's interest. The ideal line shows what your balance would be if all deposits were on time.
                </div>
              </button>
            )}
          </h3>
          <div className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            {hideAmounts ? "* * * * *" : formatINR(actualBalance)}
          </div>
        </div>
        
        {hasLostInterest && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Lost Interest:</span>
              <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                {hideAmounts ? "* *" : formatINR(lostInterest)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-0 pb-2">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={chartData}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.principal.color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={chartConfig.principal.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGains" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.gains.color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={chartConfig.gains.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.lostInterest.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.lostInterest.color} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timeLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              minTickGap={30}
              padding={{ left: 10, right: 25 }}
              className="text-muted-foreground text-xs font-medium"
            />
            <ChartTooltip 
              cursor={{ stroke: 'var(--separator)', strokeWidth: 1, strokeDasharray: '4 4' }} 
              content={
                <ChartTooltipContent 
                  indicator="dot" 
                  formatter={(value, name, item) => {
                    const actualValue = name === 'lostInterest' ? item.payload.lostInterestTrue : value;
                    if (actualValue === 0 && name === 'lostInterest') return null as any; // hide if zero
                    return (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex flex-1 justify-between gap-4 leading-none items-center">
                          <span className="text-muted-foreground">
                            {name === 'principal' ? 'Invested Amount' : name === 'gains' ? 'Interest Gained' : 'Lost Interest'}
                          </span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {hideAmounts ? "*****" : formatINR(Number(actualValue))}
                          </span>
                        </div>
                      </>
                    );
                  }}
                />
              } 
            />
            
            <Area
              dataKey="principal"
              name="principal"
              type="monotone"
              stackId="1"
              fill="url(#fillPrincipal)"
              fillOpacity={1}
              stroke={chartConfig.principal.color}
              strokeWidth={2}
            />
            <Area
              dataKey="gains"
              name="gains"
              type="monotone"
              stackId="1"
              fill="url(#fillGains)"
              fillOpacity={1}
              stroke={chartConfig.gains.color}
              strokeWidth={2}
            />
            {showSimulation && (
              <Area
                dataKey="lostInterest"
                name="lostInterest"
                type="monotone"
                stackId="1"
                fill="url(#fillLost)"
                fillOpacity={1}
                stroke={chartConfig.lostInterest.color}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
