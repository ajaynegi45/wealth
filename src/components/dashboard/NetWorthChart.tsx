"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR } from "@/lib/formatters";
import { useUIStore } from "@/store/useUIStore";
import { calculateFDCurrentValue, calculateFDInterestPaidOut } from "@/lib/calculations/fd";
import { calculateSimulatedMarketValue } from "@/lib/calculations/marketSim";
import { calculatePPFLedger } from "@/lib/calculations/ppf";
import { addMonths, addDays, addYears, format, max, min, differenceInMonths, differenceInDays, differenceInYears, isBefore, isAfter } from "date-fns";

export function NetWorthChart({ assets = [], title = "Live Net Worth" }: { assets?: any[], title?: string }) {
  const { hideAmounts } = useUIStore();
  const today = new Date();
  
  const ppfLedgers = new Map<number, any[]>();
  for (const a of assets) {
    if (a.type === 'PPF' && a.metadata?.rawTransactions) {
      const { ledger } = calculatePPFLedger(new Date(a.startDate), a.metadata.rawTransactions);
      ppfLedgers.set(a.id, ledger);
    }
  }

  const getPPFBalanceAtDate = (ledger: any[], targetDate: Date) => {
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

  const getPPFPrincipalAtDate = (rawTransactions: any[], targetDate: Date) => {
    let principal = 0;
    for (const t of rawTransactions) {
      if (new Date(t.transactionDate) <= targetDate) {
        if (t.type === 'Deposit') principal += Number(t.amount);
        if (t.type === 'Withdrawal') principal -= Number(t.amount);
      }
    }
    return Math.max(0, principal);
  };

  // Calculate Live Current Total and True Returns
  let totalPrincipal = 0;
  let totalAbsoluteReturns = 0;

  const currentTotal = assets.reduce((sum, a) => {
    if (a.type === "FD" && a.metadata) {
      const cv = calculateFDCurrentValue(
        Number(a.amount), 
        Number(a.metadata.interestRate), 
        new Date(a.startDate), 
        a.metadata.durationYears || 0,
        a.metadata.durationMonths || 0,
        a.metadata.durationDays || 0,
        a.metadata.interestPayout,
        a.metadata.compoundingFrequency || "Quarterly",
        a.metadata.autoRenew || false,
        today
      );

      const paidOut = calculateFDInterestPaidOut(
        Number(a.amount), 
        Number(a.metadata.interestRate), 
        new Date(a.startDate), 
        a.metadata.durationYears || 0,
        a.metadata.durationMonths || 0,
        a.metadata.durationDays || 0,
        a.metadata.interestPayout,
        a.metadata.compoundingFrequency || "Quarterly",
        a.metadata.autoRenew || false,
        today
      );

      totalAbsoluteReturns += (cv - Number(a.amount)) + paidOut;
      return sum + cv;
    }
    
    if (a.type === "Stock" || a.type === "Mutual Fund") {
      const cv = calculateSimulatedMarketValue(Number(a.amount), a.id, new Date(a.startDate), today, a.type as any);
      totalPrincipal += Number(a.amount);
      totalAbsoluteReturns += (cv - Number(a.amount));
      return sum + cv;
    }
    
    if (a.type === "PPF" && a.metadata?.rawTransactions) {
      const currentBalance = Number(a.amount);
      const principal = getPPFPrincipalAtDate(a.metadata.rawTransactions, today);
      totalPrincipal += principal;
      totalAbsoluteReturns += (currentBalance - principal);
      return sum + currentBalance;
    }
    
    totalPrincipal += Number(a.amount);
    return sum + Number(a.amount);
  }, 0);

  const isProfit = totalAbsoluteReturns >= 0;
  const returnsPercentage = totalPrincipal > 0 ? (totalAbsoluteReturns / totalPrincipal) * 100 : 0;

  // Generate dynamic chart data based on Asset lifetimes
  let chartData: any[] = [];
  
  if (assets.length === 0) {
    chartData = Array.from({ length: 6 }).map((_, i) => {
      const d = addMonths(today, i - 5);
      return { timeLabel: format(d, "MMM yyyy"), principal: 0, gains: 0, actualBalance: 0 };
    });
  } else {
    const startDates = assets.map((a) => new Date(a.startDate));
    let earliest = min(startDates);
    if (isAfter(earliest, today)) earliest = today;

    const endDates = assets.map((a) => {
      if (a.type === "FD" && a.metadata) {
        const d = new Date(a.startDate);
        d.setFullYear(d.getFullYear() + (a.metadata.durationYears || 0));
        d.setMonth(d.getMonth() + (a.metadata.durationMonths || 0));
        d.setDate(d.getDate() + (a.metadata.durationDays || 0));
        return d;
      }
      return today;
    });
    let latest = max(endDates);
    if (isBefore(latest, today)) latest = today;

    const totalDays = Math.max(1, differenceInDays(latest, earliest));
    
    let granularity: "days" | "months" | "years" = "months";
    if (totalDays <= 31) {
      granularity = "days";
    } else if (totalDays > 365 * 3) {
      granularity = "years";
    } else {
      granularity = "months";
    }

    let stepDays = 1;
    let stepMonths = 1;
    let stepYears = 1;

    if (granularity === "days") {
      stepDays = Math.max(1, Math.floor(totalDays / 14));
    } else if (granularity === "months") {
      const totalMonths = Math.max(1, differenceInMonths(latest, earliest));
      stepMonths = Math.max(1, Math.floor(totalMonths / 24)); 
    } else if (granularity === "years") {
      const totalYears = Math.max(1, differenceInYears(latest, earliest));
      stepYears = Math.max(1, Math.floor(totalYears / 10));
    }

    let currDate = new Date(earliest);
    if (granularity === "days") currDate = addDays(currDate, -stepDays);
    if (granularity === "months") currDate = addMonths(currDate, -stepMonths);
    if (granularity === "years") currDate = addYears(currDate, -stepYears);

    while (currDate <= latest) {
      let pointPrincipal = 0;
      let pointTotal = 0;

      for (const a of assets) {
        if (currDate < new Date(a.startDate)) continue; 
        
        if (a.type === "FD" && a.metadata) {
          pointPrincipal += Number(a.amount);
          pointTotal += calculateFDCurrentValue(
            Number(a.amount), 
            Number(a.metadata.interestRate), 
            new Date(a.startDate), 
            a.metadata.durationYears || 0,
            a.metadata.durationMonths || 0,
            a.metadata.durationDays || 0,
            a.metadata.interestPayout, 
            a.metadata.compoundingFrequency || "Quarterly",
            a.metadata.autoRenew || false,
            currDate
          );
        } else if (a.type === "Stock" || a.type === "Mutual Fund") {
          pointPrincipal += Number(a.amount);
          pointTotal += calculateSimulatedMarketValue(
            Number(a.amount), 
            a.id, 
            new Date(a.startDate), 
            currDate, 
            a.type as any
          );
        } else if (a.type === "PPF" && a.metadata?.rawTransactions) {
          pointPrincipal += getPPFPrincipalAtDate(a.metadata.rawTransactions, currDate);
          pointTotal += getPPFBalanceAtDate(ppfLedgers.get(a.id) || [], currDate);
        } else {
          pointPrincipal += Number(a.amount);
          pointTotal += Number(a.amount);
        }
      }

      let label = "";
      if (granularity === "days") label = format(currDate, "MMM dd");
      if (granularity === "months") label = format(currDate, "MMM yy");
      if (granularity === "years") label = format(currDate, "yyyy");

      chartData.push({
        timeLabel: label,
        principal: Math.round(pointPrincipal),
        gains: Math.round(Math.max(0, pointTotal - pointPrincipal)),
        actualBalance: Math.round(pointTotal)
      });

      if (granularity === "days") currDate = addDays(currDate, stepDays);
      else if (granularity === "months") currDate = addMonths(currDate, stepMonths);
      else if (granularity === "years") currDate = addYears(currDate, stepYears);
    }
  }


  const chartColor = isProfit ? "#10B981" : "#EF4444"; 

  const chartConfig = {
    principal: {
      label: "Invested Amount",
      color: "#71717A", // Zinc-500
    },
    gains: {
      label: "Returns Gained",
      color: chartColor,
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full bg-card rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex flex-row items-start justify-between space-y-0 pb-6 px-8 pt-8">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {title}
          </h3>
          <div className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            {hideAmounts ? "* * * * *" : formatINR(currentTotal)}
          </div>
        </div>
        {totalPrincipal > 0 && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${isProfit ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isProfit ? '+' : ''}{returnsPercentage.toFixed(2)}%</span>
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
                <stop offset="5%" stopColor={chartConfig.principal.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartConfig.principal.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillGains" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.gains.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartConfig.gains.color} stopOpacity={0.0} />
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
                          {name === 'principal' ? 'Invested Amount' : 'Returns Gained'}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {hideAmounts ? "*****" : formatINR(Number(value))}
                        </span>
                      </div>
                    </>
                  )}
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
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
