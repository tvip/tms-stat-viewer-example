export type DeviceStat = {
  class: string;
  dvr_hours: number;
  live_hours: number;
  unique_devices: number;
}
export type ProviderStat = {
  provider_id: number;
  device_stat: DeviceStat[]
}
export type DeviceStatResponse = {
  from: string;
  to: string;
  provider_stat: ProviderStat[];
}
