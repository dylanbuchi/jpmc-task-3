import { ServerRespond } from './DataStreamer';
import { calculateAverage } from './utilities/functions';

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
  timestamp: Date;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = calculateAverage([
      serverResponds[0].top_ask.price,
      serverResponds[0].top_bid.price,
    ]);

    const priceDEF = calculateAverage([
      serverResponds[1].top_ask.price,
      serverResponds[1].top_bid.price,
    ]);

    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.02;
    const lowerBound = 1 - 0.02;

    const timestamp =
      serverResponds[0].timestamp > serverResponds[1].timestamp
        ? serverResponds[0].timestamp
        : serverResponds[1].timestamp;

    const triggerAlert =
      ratio > upperBound || ratio < lowerBound ? ratio : undefined;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
      ratio,
      timestamp,
    };
  }
}
