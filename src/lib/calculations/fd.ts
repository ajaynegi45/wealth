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

export function getFDMaturityDate(
  startDate: Date,
  durationYears: number,
  durationMonths: number,
  durationDays: number
): Date {
  const maturityDate = new Date(startDate);
  maturityDate.setFullYear(maturityDate.getFullYear() + durationYears);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
  maturityDate.setDate(maturityDate.getDate() + durationDays);
  return maturityDate;
}

function calculateCompoundInterest(
  principal: number,
  interestRate: number,
  startDate: Date,
  evalDate: Date,
  compounding: CompoundingFrequency
): number {
  const diffTime = Math.abs(evalDate.getTime() - startDate.getTime());
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
  
  return finalAmount - principal; // return just the interest
}

function applyTDS(interest: number): number {
  // If total interest exceeds 40k, apply 10% TDS on the entire interest amount.
  if (interest > 40000) {
    return interest * 0.90;
  }
  return interest;
}

export function calculateFDCurrentValue(
  principal: number,
  interestRate: number,
  startDate: Date,
  durationYears: number,
  durationMonths: number,
  durationDays: number,
  payout: InterestPayout,
  compounding: CompoundingFrequency,
  autoRenew: boolean = false,
  targetDate: Date = new Date()
): number {
  let now = new Date(targetDate);
  
  if (now < startDate) return principal;

  const maturityDate = getFDMaturityDate(startDate, durationYears, durationMonths, durationDays);

  // Cap the date at maturity if it doesn't auto-renew
  if (!autoRenew && now > maturityDate) {
    now = maturityDate;
  }

  // If the interest is paid out periodically, it doesn't accrue in the FD account.
  if (payout === "Quarterly" || payout === "Monthly") {
    return principal;
  }

  let grossInterest = calculateCompoundInterest(principal, interestRate, startDate, now, compounding);

  return principal + grossInterest;
}

export function calculateFDMaturityValue(
  principal: number,
  interestRate: number,
  startDate: Date,
  durationYears: number,
  durationMonths: number,
  durationDays: number,
  payout: InterestPayout,
  compounding: CompoundingFrequency
): number {
  if (payout === "Quarterly" || payout === "Monthly") {
    return principal;
  }

  const maturityDate = getFDMaturityDate(startDate, durationYears, durationMonths, durationDays);
  let grossInterest = calculateCompoundInterest(principal, interestRate, startDate, maturityDate, compounding);
  
  const netInterest = applyTDS(grossInterest);
  return principal + netInterest;
}

export function calculateFDInterestPaidOut(
  principal: number,
  interestRate: number,
  startDate: Date,
  durationYears: number,
  durationMonths: number,
  durationDays: number,
  payout: InterestPayout,
  compounding: CompoundingFrequency,
  autoRenew: boolean = false,
  targetDate: Date = new Date()
): number {
  if (payout === "Maturity") return 0; // It compounds, isn't paid out

  let now = new Date(targetDate);
  if (now < startDate) return 0;

  const maturityDate = getFDMaturityDate(startDate, durationYears, durationMonths, durationDays);

  if (!autoRenew && now > maturityDate) {
    now = maturityDate;
  }

  let grossInterest = calculateCompoundInterest(principal, interestRate, startDate, now, compounding);
  
  // Return gross paid out interest
  return grossInterest;
}

export function calculateFDTDS(
  principal: number,
  interestRate: number,
  startDate: Date,
  durationYears: number,
  durationMonths: number,
  durationDays: number,
  compounding: CompoundingFrequency,
  autoRenew: boolean = false,
  targetDate: Date = new Date()
): number {
  let now = new Date(targetDate);
  if (now < startDate) return 0;

  const maturityDate = getFDMaturityDate(startDate, durationYears, durationMonths, durationDays);

  if (!autoRenew && now > maturityDate) {
    now = maturityDate;
  }

  let grossInterest = calculateCompoundInterest(principal, interestRate, startDate, now, compounding);
  
  if (grossInterest > 40000) {
    return grossInterest * 0.10;
  }
  return 0;
}
