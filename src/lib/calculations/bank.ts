export type BankCompoundingFrequency = "Daily" | "Monthly" | "Quarterly" | "Yearly";

function getCompoundsPerYear(freq: BankCompoundingFrequency): number {
  switch (freq) {
    case "Daily": return 365;
    case "Monthly": return 12;
    case "Quarterly": return 4;
    case "Yearly": return 1;
    default: return 4;
  }
}

export function calculateBankInterest(
  principal: number,
  interestRate: number,
  openedAt: Date,
  evalDate: Date,
  compounding: BankCompoundingFrequency
): number {
  if (evalDate < openedAt || interestRate <= 0) return 0;
  
  const diffTime = Math.abs(evalDate.getTime() - openedAt.getTime());
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

export function calculateBankCurrentValue(
  principal: number,
  interestRate: number,
  openedAt: Date,
  compounding: BankCompoundingFrequency,
  targetDate: Date = new Date()
): number {
  const interest = calculateBankInterest(principal, interestRate, openedAt, targetDate, compounding);
  return principal + interest;
}
