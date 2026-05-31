"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR } from "@/lib/formatters";
import { calculateFDCurrentValue, calculateFDInterestPaidOut } from "@/lib/calculations/fd";
import { addMonths, addDays, addYears, format, max, min, differenceInMonths, differenceInDays, differenceInYears, isBefore, isAfter } from "date-fns";

export function NetWorthChart({ assets = [] }: { assets?: any[] }) {
  const today = new Date();
  
  // Calculate Live Current Total and True Returns
  const totalPrincipal = assets.reduce((sum, a) => sum + Number(a.amount), 0);
  
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

      // Both cv and paidOut are now strictly Gross (pre-tax) as requested.
      totalAbsoluteReturns += (cv - Number(a.amount)) + paidOut;
      return sum + cv;
    }
    
    totalAbsoluteReturns += 0; // For stock/mutual funds we aren't tracking live prices yet
    return sum + Number(a.amount);
  }, 0);

  const isProfit = totalAbsoluteReturns >= 0;
  const returnsPercentage = totalPrincipal > 0 ? (totalAbsoluteReturns / totalPrincipal) * 100 : 0;

  // Generate dynamic chart data based on Asset lifetimes
  let chartData: any[] = [];
  
  if (assets.length === 0) {
    chartData = Array.from({ length: 6 }).map((_, i) => {
      const d = addMonths(today, i - 5);
      return { timeLabel: format(d, "MMM yyyy"), netWorth: 0 };
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
      const pointTotal = assets.reduce((sum, a) => {
        if (currDate < new Date(a.startDate)) return sum; 
        
        if (a.type === "FD" && a.metadata) {
          return sum + calculateFDCurrentValue(
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
        }
        return sum + Number(a.amount);
      }, 0);

      let label = "";
      if (granularity === "days") label = format(currDate, "MMM dd");
      if (granularity === "months") label = format(currDate, "MMM yy");
      if (granularity === "years") label = format(currDate, "yyyy");

      chartData.push({
        timeLabel: label,
        netWorth: Math.round(pointTotal)
      });

      if (granularity === "days") currDate = addDays(currDate, stepDays);
      else if (granularity === "months") currDate = addMonths(currDate, stepMonths);
      else if (granularity === "years") currDate = addYears(currDate, stepYears);
    }
  }


  const chartColor = isProfit ? "#10B981" : "#EF4444"; 

  const chartConfig = {
    netWorth: {
      label: "Net Worth",
      color: chartColor,
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full bg-card rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex flex-row items-start justify-between space-y-0 pb-6 px-8 pt-8">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Live Net Worth
          </h3>
          <div className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            {formatINR(currentTotal)}
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
              <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
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
                        style={{ backgroundColor: item.color || chartColor }}
                      />
                      <div className="flex flex-1 justify-between gap-2 leading-none items-center">
                        <span className="text-muted-foreground">Net Worth</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatINR(Number(value))}
                        </span>
                      </div>
                    </>
                  )}
                />
              } 
            />
            <Area
              dataKey="netWorth"
              type="monotone"
              fill="url(#fillNetWorth)"
              fillOpacity={1}
              stroke={chartColor}
              strokeWidth={4}
              activeDot={{
                r: 6,
                fill: "var(--background)",
                stroke: chartColor,
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
