import 'reflect-metadata';
import {type AbstractEvent} from '../events';
import {STREAM_SUBSCRIBE_EVENT_METADATA_KEY} from '../stream.constants';

export function SubscribeEvent<T extends AbstractEvent>(
  eventClass: new (...args: any[]) => T,
  fromBeginning = false
): MethodDecorator {
  return function (_target, _propertyKey, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(STREAM_SUBSCRIBE_EVENT_METADATA_KEY, {eventClass, fromBeginning}, descriptor.value);
  };
}
