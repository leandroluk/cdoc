import {type AbstractEvent} from './events';

export namespace TStream {
  export type Subscriber<T extends AbstractEvent> = {
    handle(event: T, done: (err?: Error) => Promise<void>): void | Promise<void>;
  };
}
