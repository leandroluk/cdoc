export function OnModuleInit<T extends object>(
  moduleClass: Function | string,
  fn: (classType: T) => void | Promise<void>
): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction): void {
    const moduleName = typeof moduleClass === 'string' ? moduleClass : moduleClass.constructor.name;
    OnModuleInit.map.set(`${moduleName}.${target.constructor.name}`, fn);
  };
}
export namespace OnModuleInit {
  export const key = Symbol(OnModuleInit.name);
  export const map = new Map<`${string}`, Function>();
}
