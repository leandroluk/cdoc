export interface TypedReadable<TPayload = unknown> {
  on(event: 'data', listener: (payload: TPayload) => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'pause', listener: () => void): this;
  on(event: 'readable', listener: () => void): this;
  on(event: 'resume', listener: () => void): this;
  on(event: string | symbol, listener: (...args: Array<unknown>) => void): this;

  emit(event: 'data', payload: TPayload): boolean;
  emit(event: 'close'): boolean;
  emit(event: 'end'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'pause'): boolean;
  emit(event: 'readable'): boolean;
  emit(event: 'resume'): boolean;
  emit(event: string | symbol, ...args: Array<unknown>): boolean;
}

export enum EQueueProvider {
  Redis = 'redis',
  Aws = 'aws',
}

export type TQueueProvider = {
  connect(): Promise<void>;
  ping(): Promise<void>;
  enqueue<T = unknown>(queueName: string, payload: T): Promise<void>;
  subscribe<T = unknown>(
    queueName: string,
    consumeFn: (payload: T) => Promise<void>
  ): Promise<{unsubscribe: () => boolean}>;
};
