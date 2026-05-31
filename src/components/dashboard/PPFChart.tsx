"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR } from "@/lib/formatters";
import { calculatePPFLedger } from "@/lib/calculations/ppf";
import { addMonths, addDays, addYears, format, min, max, differenceInDays, differenceInMonths, differenceInYears, isBefore, isAfter } from "date-fns";

export function PPFChart({ asset, title = "PPF Growth & Simulation" }: { asset: any, title?: string }) {
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
    // Find the last entry that occurred on or before the target date
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

  while (currDate <= today) {
    let label = "";
    if (granularity === "days") label = format(currDate, "MMM dd");
    if (granularity === "months") label = format(currDate, "MMM yy");
    if (granularity === "years") label = format(currDate, "yyyy");

    const actualVal = getBalanceAtDate(actualLedger, currDate);
    const idealVal = getBalanceAtDate(idealLedger, currDate);

    chartData.push({
      timeLabel: label,
      actual: actualVal,
      ideal: idealVal,
      idealVisual: hasLostInterest && idealVal > 0 ? idealVal + Math.max(500, actualVal * 0.015) : idealVal
    });

    if (granularity === "days") currDate = addDays(currDate, stepDays);
    else if (granularity === "months") currDate = addMonths(currDate, stepMonths);
    else if (granularity === "years") currDate = addYears(currDate, stepYears);
  }

  // Always add 'today' as the final point to ensure exact current balance is visible
  chartData.push({
    timeLabel: "Today",
    actual: actualBalance,
    ideal: idealBalance,
    idealVisual: hasLostInterest && idealBalance > 0 ? idealBalance + Math.max(500, actualBalance * 0.015) : idealBalance
  });

  const chartConfig = {
    actual: {
      label: "Actual Balance",
      color: "#10B981", // Emerald
    },
    ideal: {
      label: "Ideal Balance (Paid before 5th)",
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
              <span className="group relative cursor-help flex items-center">
                <Info className="w-4 h-4 text-orange-500" />
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-2.5 bg-zinc-800 text-zinc-100 text-xs rounded-md shadow-xl z-50 text-left normal-case tracking-normal font-normal">
                  Depositing after the 5th of a month loses out on that month's interest. The ideal line shows what your balance would be if all deposits were on time.
                </div>
              </span>
            )}
          </h3>
          <div className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            {formatINR(actualBalance)}
          </div>
        </div>
        
        {hasLostInterest && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Lost Interest:</span>
              <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                {formatINR(lostInterest)}
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
              <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.actual.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartConfig.actual.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillIdeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.ideal.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartConfig.ideal.color} stopOpacity={0.0} />
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
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-1 justify-between gap-4 leading-none items-center">
                        <span className="text-muted-foreground">
                          {name === 'actual' ? 'Actual Balance' : 'Ideal Balance'}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatINR(name === 'idealVisual' ? item.payload.ideal : Number(value))}
                        </span>
                      </div>
                    </>
                  )}
                />
              } 
            />
            
            {showSimulation && (
              <Area
                dataKey="idealVisual"
                name="idealVisual"
                type="monotone"
                fill="url(#fillIdeal)"
                fillOpacity={0.6}
                stroke={chartConfig.ideal.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                activeDot={{
                  r: 4,
                  fill: "var(--background)",
                  stroke: chartConfig.ideal.color,
                  strokeWidth: 2,
                }}
              />
            )}

            <Area
              dataKey="actual"
              type="monotone"
              fill="url(#fillActual)"
              fillOpacity={1}
              stroke={chartConfig.actual.color}
              strokeWidth={4}
              activeDot={{
                r: 6,
                fill: "var(--background)",
                stroke: chartConfig.actual.color,
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
