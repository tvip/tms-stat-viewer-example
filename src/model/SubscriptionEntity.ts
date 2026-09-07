import {Subscription} from "@/dto/stat/SubscriptionStatResponse";

/**
 * Report types, the same set as SubscriptionReportRequest::getTypes() in tms-stat-view.
 */
export const subscriptionMetrics = [
  'enabled_count',
  'active_count',
  'enabled_device_count',
  'enabled_account_with_devices',
] as const;
export type SubscriptionMetric = typeof subscriptionMetrics[number];

export class Tariff {
  id: number = 0;
  name: string = '';
}

/**
 * One provider on one day: subscription counters keyed by tariff id.
 */
export class SubscriptionRow {
  provider_id: number = 0;
  date: Date = new Date();
  subscriptions: Record<number, Subscription> = {};

  getValue(tariffId: number, metric: SubscriptionMetric): number{
    const subscription = this.subscriptions[tariffId];
    if(typeof subscription == 'undefined'){
      return 0;
    }
    return subscription[metric] ?? 0;
  }
}
