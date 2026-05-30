export type CompoundingFrequency = "Daily" | "Monthly" | "Quarterly" | "Yearly";
export type InterestPayout = "Maturity" | "Quarterly" | "Monthly";

function getCompoundsPerYear(freq: CompoundingFrequency): number {
  switch (freq) {
    case "Daily": return 365;
    case "Monthly": return 12;
    case "Quarterly": return 4;
    case "Yearly": return 1;
    default: return 4;
  }
}

export function calculateFDCurrentValue(
  principal: number,
  interestRate: number, // e.g., 6.5 for 6.5%
  startDate: Date,
  payout: InterestPayout,
  compounding: CompoundingFrequency,
  targetDate: Date = new Date()
): number {
  const now = targetDate;
  
  if (now < startDate) return principal;

  // If the interest is paid out periodically, it doesn't accrue in the FD account.
  if (payout === "Quarterly" || payout === "Monthly") {
    return principal;
  }

  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const n = getCompoundsPerYear(compounding);
  const daysPerPeriod = Math.floor(365 / n);
  
  const periods = Math.floor(diffDays / daysPerPeriod);
  const remainingDays = diffDays % daysPerPeriod;

  const rate = interestRate / 100;
  
  // Compounded amount after full periods
  const amountAfterPeriods = principal * Math.pow(1 + rate / n, periods);
  
  // Simple interest for remaining days on the new compounded principal
  const finalAmount = amountAfterPeriods * (1 + (rate * remainingDays) / 365);
  
  return finalAmount;
}

export function calculateFDMaturityValue(
  principal: number,
  interestRate: number,
  durationYears: number,
  durationMonths: number,
  durationDays: number,
  payout: InterestPayout,
  compounding: CompoundingFrequency
): number {
  if (payout === "Quarterly" || payout === "Monthly") {
    return principal;
  }

  const totalDays = durationYears * 365 + durationMonths * 30 + durationDays;
  const n = getCompoundsPerYear(compounding);
  const daysPerPeriod = Math.floor(365 / n);

  const periods = Math.floor(totalDays / daysPerPeriod);
  const remainingDays = totalDays % daysPerPeriod;

  const rate = interestRate / 100;
  
  const amountAfterPeriods = principal * Math.pow(1 + rate / n, periods);
  const finalAmount = amountAfterPeriods * (1 + (rate * remainingDays) / 365);
  
  return finalAmount;
}
