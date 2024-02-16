export type Provider = {
  id: number;
  region_tag: number|null;
  provider_name: string;
  provider_comment: null|string;
  enabled: boolean;
  logo_url: string|null;
  device_per_account_limit: number|null
}
