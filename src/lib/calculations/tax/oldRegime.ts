export function calculateOldRegimeTax(
  grossIncome: number,
  deduction80c: number,
  otherDeductions: number
): {
  taxableIncome: number;
  baseTax: number;
  rebate: number;
  cess: number;
  totalTax: number;
} {
  const standardDeduction = 50000;
  // Cap 80C at 1.5 Lakhs
  const effective80c = Math.min(deduction80c, 150000);
  
  const taxableIncome = Math.max(0, grossIncome - standardDeduction - effective80c - otherDeductions);

  let baseTax = 0;

  if (taxableIncome > 1000000) {
    baseTax += (taxableIncome - 1000000) * 0.30;
    baseTax += 100000; // Tax for 5L to 10L (20% of 5L = 1L)
    baseTax += 12500;  // Tax for 2.5L to 5L (5% of 2.5L = 12.5k)
  } else if (taxableIncome > 500000) {
    baseTax += (taxableIncome - 500000) * 0.20;
    baseTax += 12500;  // Tax for 2.5L to 5L
  } else if (taxableIncome > 250000) {
    baseTax += (taxableIncome - 250000) * 0.05;
  }

  // Rebate under section 87A (Up to 5 Lakhs for Old Regime)
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = baseTax;
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate);
  
  // 4% Health & Education Cess
  const cess = taxAfterRebate * 0.04;
  const totalTax = taxAfterRebate + cess;

  return {
    taxableIncome,
    baseTax,
    rebate,
    cess,
    totalTax
  };
}
