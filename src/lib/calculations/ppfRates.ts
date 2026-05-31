export interface PPFRatePeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  rate: number;
}

// Data from user request
export const PPF_RATES_HISTORY: PPFRatePeriod[] = [
  { startDate: '1968-04-01', endDate: '1970-03-31', rate: 4.8 },
  { startDate: '1970-04-01', endDate: '1973-03-31', rate: 5.0 },
  { startDate: '1973-04-01', endDate: '1974-03-31', rate: 5.3 },
  { startDate: '1974-04-01', endDate: '1974-07-31', rate: 5.8 },
  { startDate: '1974-08-01', endDate: '1975-03-31', rate: 7.0 },
  { startDate: '1975-04-01', endDate: '1977-03-31', rate: 7.0 },
  { startDate: '1977-04-01', endDate: '1980-03-31', rate: 7.5 },
  { startDate: '1980-04-01', endDate: '1981-03-31', rate: 8.0 },
  { startDate: '1981-04-01', endDate: '1983-03-31', rate: 8.5 },
  { startDate: '1983-04-01', endDate: '1984-03-31', rate: 9.0 },
  { startDate: '1984-04-01', endDate: '1985-03-31', rate: 9.5 },
  { startDate: '1985-04-01', endDate: '1986-03-31', rate: 10.0 },
  { startDate: '1986-04-01', endDate: '1999-03-31', rate: 12.0 },
  { startDate: '1999-04-01', endDate: '2000-01-14', rate: 12.0 },
  { startDate: '2000-01-15', endDate: '2001-02-28', rate: 11.0 },
  { startDate: '2001-03-01', endDate: '2002-02-28', rate: 9.5 },
  { startDate: '2002-03-01', endDate: '2003-02-28', rate: 9.0 },
  { startDate: '2003-03-01', endDate: '2011-11-30', rate: 8.0 },
  { startDate: '2011-12-01', endDate: '2012-03-31', rate: 8.6 },
  { startDate: '2012-04-01', endDate: '2013-03-31', rate: 8.8 },
  { startDate: '2013-04-01', endDate: '2016-03-31', rate: 8.7 },
  { startDate: '2016-04-01', endDate: '2016-09-30', rate: 8.1 },
  { startDate: '2016-10-01', endDate: '2017-03-31', rate: 8.0 },
  { startDate: '2017-04-01', endDate: '2017-06-30', rate: 7.9 },
  { startDate: '2017-07-01', endDate: '2017-12-31', rate: 7.8 },
  { startDate: '2018-01-01', endDate: '2018-09-30', rate: 7.6 },
  { startDate: '2018-10-01', endDate: '2019-06-30', rate: 8.0 }, // Assuming 31.06 meant 30.06
  { startDate: '2019-07-01', endDate: '2020-03-31', rate: 7.9 },
  { startDate: '2020-04-01', endDate: '2026-06-30', rate: 7.1 },
];

const rateCache = new Map<string, number>();

// O(1) lookup utility (amortized)
export function getPPFRateForMonth(year: number, month: number): number {
  // month is 1-12
  const key = `${year}-${month.toString().padStart(2, '0')}`;
  
  if (rateCache.has(key)) {
    return rateCache.get(key)!;
  }
  
  // We use the last day of the month to determine the applicable rate for the month's calculation
  // For edge cases like 2000-01-14 changing mid-month, we use the rate at the end of the month
  // which is standard for most generic PPF calculators unless daily proration is explicitly required.
  const lastDay = new Date(year, month, 0).getDate();
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
  
  let foundRate = 7.1; // Default to latest
  
  for (const period of PPF_RATES_HISTORY) {
    if (dateStr >= period.startDate && dateStr <= period.endDate) {
      foundRate = period.rate;
      break;
    }
  }
  
  rateCache.set(key, foundRate);
  return foundRate;
}
