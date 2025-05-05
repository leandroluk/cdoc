import {LoggerService} from 'libs/logger';

export function TimeTrack(): MethodDecorator {
  return function <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
    const originalMethod = descriptor.value as any;

    descriptor.value = function (...args: any[]) {
      const logger = new LoggerService(target.constructor.name);
      const start = Date.now();
      let methodName = propertyKey.toString();

      const argsString = args
        .map(arg => {
          try {
            return JSON.stringify(arg);
          } catch {
            return '[Unserializable]';
          }
        })
        .join(', ');
      methodName += `(${argsString})`;

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((res: any) => {
              logger.log(`${methodName} done (${Date.now() - start}ms)`);
              return res;
            })
            .catch((err: any) => {
              logger.error(`${methodName} failed (${Date.now() - start}ms)`, err);
              throw err;
            });
        } else {
          logger.log(`${methodName} done (${Date.now() - start}ms)`);
          return result;
        }
      } catch (err) {
        logger.error(`${methodName} failed (${Date.now() - start}ms)`, err);
        throw err;
      }
    } as any;
  };
}
