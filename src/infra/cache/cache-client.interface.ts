export type CacheGetParams = {
  key: string;
  prefix: unknown;
};
export type CacheSetParams = {
  value: unknown;
  ttl?: number;
} & CacheGetParams;

export abstract class ICacheClient {
  abstract get<T>(params: CacheGetParams): Promise<T | null>;

  abstract set(params: CacheSetParams): Promise<void>;

  abstract exists(params: CacheGetParams): Promise<boolean>;

  abstract clear(prefix: string): Promise<void>;
}
