/* ─── Segal Build — Quote Calculator ─── */
import type { QuotePricing } from '../../types/domain';

const GST_RATE = 0.10;

export function calculateQuote(
  tradeCost: number,
  overheadPercent: number,
  profitPercent: number,
  contingencyPercent: number,
): QuotePricing {
  const overhead = tradeCost * (overheadPercent / 100);
  const trueCost = tradeCost + overhead;
  const profit = trueCost * (profitPercent / 100);
  const clientTotal = trueCost + profit;
  const contingency = clientTotal * (contingencyPercent / 100);
  const subtotal = clientTotal + contingency;
  const gst = subtotal * GST_RATE;
  const totalIncGst = subtotal + gst;

  return {
    overheadPercent,
    profitPercent,
    contingencyPercent,
    gstPercent: 10,
    tradeCost: Math.round(tradeCost),
    overhead: Math.round(overhead),
    profit: Math.round(profit),
    contingency: Math.round(contingency),
    gst: Math.round(gst),
    clientTotal: Math.round(clientTotal),
    totalIncGst: Math.round(totalIncGst),
  };
}

export function calculateStage(
  rate: number,
  unit: 'area' | 'linear' | 'item' | 'allow',
  dimensions: { width: number; length: number; height: number },
  quantity: number = 1,
): number {
  switch (unit) {
    case 'area':
      return rate * (dimensions.width * dimensions.length);
    case 'linear':
      return rate * dimensions.width;
    case 'item':
      return rate * quantity;
    case 'allow':
      return rate;
    default:
      return rate;
  }
}

export function calculateScope(
  stages: Array<{ rate: number; unit: 'area' | 'linear' | 'item' | 'allow'; duration: number }>,
  dimensions: { width: number; length: number; height: number },
): { totalCost: number; totalDuration: number } {
  let totalCost = 0;
  let totalDuration = 0;
  for (const stage of stages) {
    totalCost += calculateStage(stage.rate, stage.unit, dimensions);
    totalDuration += stage.duration;
  }
  return { totalCost: Math.round(totalCost), totalDuration: Math.round(totalDuration * 10) / 10 };
}
