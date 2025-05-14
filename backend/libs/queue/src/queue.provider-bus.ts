import {Injectable, OnModuleInit} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {QueueProvider} from './decorators';
import {QueueEnv} from './queue.env';
import {TQueueProvider} from './queue.types';

@Injectable()
export class QueueProviderBus implements OnModuleInit, TQueueProvider {
  constructor(
    private readonly queueEnv: QueueEnv,
    private readonly moduleRef: ModuleRef
  ) {}

  get provider(): TQueueProvider {
    return this.moduleRef.get<TQueueProvider>(QueueProvider.get(this.queueEnv.provider));
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async connect(): Promise<void> {
    await this.provider.connect();
  }

  async ping(): Promise<void> {
    await this.provider.ping();
  }

  async enqueue<T = unknown>(queueName: string, payload: T): Promise<void> {
    await this.provider.enqueue<T>(queueName, payload);
  }

  async subscribe<T = unknown>(
    queueName: string,
    consumeFn: (payload: T) => Promise<void>
  ): Promise<{unsubscribe: () => boolean}> {
    return await this.provider.subscribe<T>(queueName, consumeFn);
  }
}
