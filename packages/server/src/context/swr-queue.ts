import { option as O } from 'fp-ts';

import { CacheEntry } from './cache';


export interface SwrQueue {
  queue(
    updateJob: { key: string, cacheEntry?: O.Option<CacheEntry<unknown>>; }
  ): Promise<never>;
  ready(): Promise<void>;
  healthy(): Promise<void>;
  quit(): Promise<void>;
  _queue: never;
}
