export type ChannelMeta = {
  id: number;
  name: string;
}

export type Channel = {
  channel_id: number;
  dvr_hours: number;
  live_hours: number;
  live_minutes: number|null;
  dvr_minutes: number|null;
}


export type AccountStat = {
  account_id: number;
  account_contract: string|null;
  channels: Channel[];
}

export type ProviderStat ={
  provider_id: number;
  account_stat: AccountStat[];
  channels: ChannelMeta[];
}

export type AccountStatResponse={
  from: string;
  to: string;
  provider_stat: ProviderStat[];
}
