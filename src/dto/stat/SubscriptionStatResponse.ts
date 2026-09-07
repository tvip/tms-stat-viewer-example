export type Subscription = {
  tariff_id: number;
  name: string;
  enabled_count: number;
  enabled_device_count: number;
  active_count: number;
  disabled_count: number;
  /** absent on older TMS versions */
  enabled_account_with_devices?: number;
}

export type SubscriptionStat = {
  /** YYYY-MM-DD */
  date: string;
  subscriptions: Subscription[];
}

export type ProviderStat = {
  provider_id: number;
  subscriptions_stat: SubscriptionStat[];
}

export type SubscriptionStatResponse = {
  from: string;
  to: string;
  provider_stat: ProviderStat[];
}
