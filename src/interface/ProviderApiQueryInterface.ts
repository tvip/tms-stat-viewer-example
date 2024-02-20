export default interface ProviderApiQueryInterface  {
  start: number;
  limit: number;
  sort: string[];
  enabled: boolean|null;
}
