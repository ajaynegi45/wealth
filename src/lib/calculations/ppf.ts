import { getPPFRateForMonth } from './ppfRates';

export type PPFTransaction = {
  id?: number;
  amount: number;
  transactionDate: Date | string;
  type: 'Deposit' | 'Withdrawal' | 'Interest';
};

export type LedgerEntry = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Interest';
  balance: number;
};

// Helper to get Financial Year (FY) for a given date
// e.g. Jan 2023 is FY 2022-2023 -> returns 2022
export function getFinancialYear(date: Date): number {
  const month = date.getMonth(); // 0-indexed, 0 = Jan, 3 = Apr
  const year = date.getFullYear();
  return month >= 3 ? year : year - 1;
}

export function calculatePPFLedger(openingDateStr: Date | string, transactions: PPFTransaction[]): {
  ledger: LedgerEntry[];
  currentBalance: number;
  totalInvested: number;
  totalInterest: number;
} {
  const openingDate = new Date(openingDateStr);
  const sortedTx = [...transactions]
    .map(t => ({ ...t, transactionDate: new Date(t.transactionDate) }))
    .sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());

  let currentBalance = 0;
  let totalInvested = 0;
  let totalInterestEarned = 0;
  
  const ledger: LedgerEntry[] = [];
  
  let currentTxIndex = 0;
  
  const currentDate = new Date();
  const startYear = openingDate.getFullYear();
  const startMonth = openingDate.getMonth();
  
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  let pendingYearlyInterest = 0;

  // We iterate month by month until the current month
  while (currentYear < currentDate.getFullYear() || (currentYear === currentDate.getFullYear() && currentMonth <= currentDate.getMonth())) {
    
    const monthStart = new Date(currentYear, currentMonth, 1);
    const month5th = new Date(currentYear, currentMonth, 5, 23, 59, 59, 999);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    
    let lowestBalanceForInterest = currentBalance;
    let balanceOn5th = currentBalance;
    
    // Process transactions up to the 5th
    while (currentTxIndex < sortedTx.length && sortedTx[currentTxIndex].transactionDate <= month5th) {
      const tx = sortedTx[currentTxIndex];
      if (tx.type === 'Deposit') {
        currentBalance += tx.amount;
        totalInvested += tx.amount;
      } else if (tx.type === 'Withdrawal') {
        currentBalance -= tx.amount;
      }
      
      ledger.push({
        id: `tx-${tx.id || currentTxIndex}`,
        date: tx.transactionDate,
        description: tx.type === 'Deposit' ? 'Deposit' : 'Withdrawal',
        amount: tx.amount,
        type: tx.type,
        balance: currentBalance
      });
      
      currentTxIndex++;
    }
    
    balanceOn5th = currentBalance;
    lowestBalanceForInterest = balanceOn5th;
    
    // Process transactions from 6th to end of month
    while (currentTxIndex < sortedTx.length && sortedTx[currentTxIndex].transactionDate <= monthEnd) {
      const tx = sortedTx[currentTxIndex];
      if (tx.type === 'Deposit') {
        currentBalance += tx.amount;
        totalInvested += tx.amount;
      } else if (tx.type === 'Withdrawal') {
        currentBalance -= tx.amount;
        // Withdrawals after 5th lower the lowest balance for the month
        if (currentBalance < lowestBalanceForInterest) {
          lowestBalanceForInterest = currentBalance;
        }
      }
      
      ledger.push({
        id: `tx-${tx.id || currentTxIndex}`,
        date: tx.transactionDate,
        description: tx.type === 'Deposit' ? 'Deposit' : 'Withdrawal',
        amount: tx.amount,
        type: tx.type,
        balance: currentBalance
      });
      
      currentTxIndex++;
    }
    
    // Calculate interest for this month
    // Lowest balance between 5th and end of month
    if (lowestBalanceForInterest > 0) {
      const rate = getPPFRateForMonth(currentYear, currentMonth + 1); // getPPFRateForMonth expects 1-12
      const monthlyInterest = (lowestBalanceForInterest * rate) / 100 / 12;
      pendingYearlyInterest += monthlyInterest;
    }
    
    // At the end of financial year (March 31st), credit the interest
    if (currentMonth === 2) { // March is index 2
      // PPF rounds interest to nearest Rupee at year end
      const roundedInterest = Math.round(pendingYearlyInterest);
      if (roundedInterest > 0) {
        currentBalance += roundedInterest;
        totalInterestEarned += roundedInterest;
        
        ledger.push({
          id: `int-${currentYear}`,
          date: new Date(currentYear, 2, 31, 23, 59, 59), // March 31st
          description: `Annual Interest Credited (${currentYear}-${currentYear+1})`,
          amount: roundedInterest,
          type: 'Interest',
          balance: currentBalance
        });
      }
      pendingYearlyInterest = 0;
    }
    
    // Move to next month
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  
  // Any remaining transactions (in the future or edge cases)
  while (currentTxIndex < sortedTx.length) {
      const tx = sortedTx[currentTxIndex];
      if (tx.type === 'Deposit') {
        currentBalance += tx.amount;
        totalInvested += tx.amount;
      } else if (tx.type === 'Withdrawal') {
        currentBalance -= tx.amount;
      }
      
      ledger.push({
        id: `tx-${tx.id || currentTxIndex}`,
        date: tx.transactionDate,
        description: tx.type === 'Deposit' ? 'Deposit' : 'Withdrawal',
        amount: tx.amount,
        type: tx.type,
        balance: currentBalance
      });
      currentTxIndex++;
  }

  return {
    ledger,
    currentBalance: Math.round(currentBalance * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalInterest: Math.round(totalInterestEarned * 100) / 100
  };
}

export function calculatePPFMaturity(openingDate: Date, extensionBlocks: number): Date {
  const fYStartYear = getFinancialYear(openingDate);
  // Initial maturity is 15 years from the END of the financial year in which it was opened
  // Financial year ends on March 31st of (fYStartYear + 1)
  const initialMaturityYear = fYStartYear + 1 + 15;
  const extendedMaturityYear = initialMaturityYear + (extensionBlocks * 5);
  
  return new Date(extendedMaturityYear, 2, 31); // March 31st
}

export function validatePPFDeposit(
  transactions: PPFTransaction[],
  transactionDate: Date,
  amount: number
): { valid: boolean; error?: string } {
  // 1. Multiple of 50
  if (amount % 50 !== 0) {
    return { valid: false, error: "Deposit amount must be a multiple of ₹50" };
  }

  // 2. Max 1.5L per Financial Year
  const targetFY = getFinancialYear(transactionDate);
  const depositsInFY = transactions.filter(t => 
    t.type === 'Deposit' && getFinancialYear(new Date(t.transactionDate)) === targetFY
  ).reduce((sum, t) => sum + Number(t.amount), 0);

  if (depositsInFY + amount > 150000) {
    return { 
      valid: false, 
      error: `Annual deposit limit exceeded. You have already deposited ₹${depositsInFY} in FY ${targetFY}-${targetFY+1}. Max allowed is ₹1,50,000.` 
    };
  }
  
  // Note: Min 500 per year is a requirement to keep the account active, 
  // but it's not a strict validation blocking a single deposit (e.g. they can deposit 200, then 300 later).
  // However, we can warn or flag if a completed FY has < 500, but that's for UI display, not a validation error on insertion.

  return { valid: true };
}
