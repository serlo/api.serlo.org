import { option as O } from "fp-ts";

import { Time } from '~/timer';
import { FunctionOrValue } from '~/utils';

export interface Cache {
  get<T>(args: { key: string; maxAge?: Time; }): Promise<O.Option<CacheEntry<T>>>;
  set<T>(
    payload: {
      key: string;
      source: string;
      ttlInSeconds?: number;
      priority?: Priority;
    } & FunctionOrValue<T>
  ): Promise<void>;
  remove(args: { key: string; }): Promise<void>;
  ready(): Promise<void>;
  flush(): Promise<void>;
  quit(): Promise<void>;
}

export enum Priority {
  Low,
  High
}
export interface CacheEntry<Value> {
  value: Value
  lastModified: number
  source: string
}

