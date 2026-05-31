import { differenceInDays } from "date-fns";

/**
 * Generates a pseudo-random number between 0 and 1 based on a string seed.
 */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  const x = Math.sin(h++) * 10000;
  return x - Math.floor(x);
}

/**
 * Calculates a simulated, deterministic market value for Stocks and Mutual Funds.
 * Stocks: ~11% YoY growth, higher volatility
 * Mutual Funds: ~18% YoY growth, medium volatility
 */
export function calculateSimulatedMarketValue(
  principal: number,
  assetId: string | number,
  startDate: Date,
  currentDate: Date,
  type: "Stock" | "Mutual Fund"
): number {
  if (currentDate < startDate) return principal;

  const days = differenceInDays(currentDate, startDate);
  const years = days / 365.25;

  const targetYield = type === "Mutual Fund" ? 0.18 : 0.11;
  const maxVolatility = type === "Mutual Fund" ? 0.05 : 0.09;

  // Base compounded growth
  const baseValue = principal * Math.pow(1 + targetYield, years);

  // Deterministic monthly noise
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const seed = `${assetId}-${monthKey}`;
  const noise = (seededRandom(seed) * 2) - 1; // -1 to 1

  // Macro market trends (smooth waves based on days)
  const trend = (Math.sin(days / 20) + Math.cos(days / 60)) / 2; // roughly -1 to 1

  // Blend noise (30%) and trend (70%)
  const combinedVolatility = (noise * 0.3) + (trend * 0.7);

  // Apply volatility
  const finalValue = baseValue * (1 + (combinedVolatility * maxVolatility));

  return finalValue;
}
