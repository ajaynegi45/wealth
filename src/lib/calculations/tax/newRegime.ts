export function calculateNewRegimeTax(grossIncome: number): {
  taxableIncome: number;
  baseTax: number;
  rebate: number;
  cess: number;
  totalTax: number;
} {
  const standardDeduction = 50000;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  let baseTax = 0;

  if (taxableIncome > 1500000) {
    baseTax += (taxableIncome - 1500000) * 0.30;
    baseTax += 150000; // Tax for up to 15L (3L*0.05 + 3L*0.10 + 3L*0.15 + 3L*0.20 = 15k + 30k + 45k + 60k = 1.5L)
  } else if (taxableIncome > 1200000) {
    baseTax += (taxableIncome - 1200000) * 0.20;
    baseTax += 90000;
  } else if (taxableIncome > 900000) {
    baseTax += (taxableIncome - 900000) * 0.15;
    baseTax += 45000;
  } else if (taxableIncome > 600000) {
    baseTax += (taxableIncome - 600000) * 0.10;
    baseTax += 15000;
  } else if (taxableIncome > 300000) {
    baseTax += (taxableIncome - 300000) * 0.05;
  }

  // Rebate under section 87A (Up to 7 Lakhs for New Regime)
  let rebate = 0;
  if (taxableIncome <= 700000) {
    rebate = baseTax;
  } else {
    // Marginal relief for income just over 7L (e.g. 7.1L)
    // If tax > income over 7L, tax is capped to (income - 7L).
    const incomeOver7L = taxableIncome - 700000;
    if (baseTax > incomeOver7L) {
      rebate = baseTax - incomeOver7L;
    }
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
