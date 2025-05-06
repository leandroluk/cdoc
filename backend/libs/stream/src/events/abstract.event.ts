export abstract class AbstractEvent<T = unknown> {
  constructor(
    readonly payload: T,
    readonly timestamp = new Date()
  ) {}
}
