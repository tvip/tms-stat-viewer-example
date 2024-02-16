export type Subscription = {
  tariff_id: number;
  name: string;
  enabled_count: number;
  enabled_device_count: number;
  active_count: number;
  disabled_count: number;
  enabled_account_with_devices:number
}

export type SubscriptionStat = {
  date: number;
  subscriptions: Subscription[];
}

export type ProviderStat = {
  provider_id: number;
  subscription_stat: SubscriptionStat[];
}

export type SubscriptionStatResponse = {
  from: string;
  to: string;
  provider_stat: ProviderStat[];
}
