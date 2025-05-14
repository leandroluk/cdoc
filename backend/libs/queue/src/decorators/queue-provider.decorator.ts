import {Injectable} from '@nestjs/common';
import {type EQueueProvider} from '../queue.types';

export function QueueProvider(queueProvider: EQueueProvider): ClassDecorator {
  return function <T extends Function>(target: T) {
    QueueProvider.map.set(queueProvider, target);
    Injectable()(target);
  };
}
export namespace QueueProvider {
  export const key = Symbol('QueueProvider');
  export const map = new Map<EQueueProvider, Function>();
  export const get = (kind: EQueueProvider): Function => map.get(kind)!;
}
