export function lazyPromise<T extends object>(factory: () => Promise<T>): T & Promise<T> {
  const promise = factory();

  const handler: ProxyHandler<any> = {
    get(_, p) {
      if (p === 'then') {
        return promise.then.bind(promise);
      }
      return (...args: any[]) =>
        promise.then(target => {
          const value = target[p];
          return typeof value === 'function' ? value.apply(target, args) : value;
        });
    },
  };

  return new Proxy({}, handler) as T & Promise<T>;
}
