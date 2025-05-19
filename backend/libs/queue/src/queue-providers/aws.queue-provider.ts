import {
  DeleteMessageCommand,
  ListQueuesCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import {LoggerService} from 'libs/logger';
import {QueueProvider} from '../decorators';
import {QueueEnv} from '../queue.env';
import {EQueueProvider, TQueueProvider} from '../queue.types';

@QueueProvider(EQueueProvider.Aws)
export class AwsQueueProvider implements TQueueProvider {
  private readonly client: SQSClient;

  constructor(
    private readonly queueEnv: QueueEnv,
    private readonly loggerService: LoggerService
  ) {
    this.client = new SQSClient({
      region: this.queueEnv.awsRegion,
      credentials: {
        accessKeyId: this.queueEnv.awsAccessKeyId,
        secretAccessKey: this.queueEnv.awsSecretAccessKey,
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.send(new ListQueuesCommand({}));
    } catch (error) {
      this.loggerService.error(`Failed to connect ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.client.send(new ListQueuesCommand({}));
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async enqueue<T = unknown>(queueName: string, payload: T): Promise<void> {
    const stringified = JSON.stringify(payload);
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: this.getQueueUrl(queueName),
        MessageBody: stringified,
      })
    );
  }

  async subscribe<T = unknown>(
    queueName: string,
    consumeFn: (payload: T) => Promise<void>
  ): Promise<{unsubscribe: () => boolean}> {
    const QueueUrl = this.getQueueUrl(queueName);
    let shouldConsume = true;
    while (shouldConsume) {
      try {
        const result = await this.client.send(
          new ReceiveMessageCommand({
            QueueUrl: QueueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20,
            VisibilityTimeout: 60,
          })
        );

        const message = result.Messages?.[0];
        if (message?.Body && message.ReceiptHandle) {
          try {
            const payload: T = JSON.parse(message.Body);
            try {
              await consumeFn(payload);
              await this.client.send(new DeleteMessageCommand({QueueUrl, ReceiptHandle: message.ReceiptHandle}));
            } catch {
              this.loggerService.error(`Failed to consume message: ${message.Body}`);
              await this.enqueue(queueName, payload);
            }
          } catch {
            this.loggerService.warn(`Invalid SQS message: ${message.Body}`);
            // when message cannot be read, it need to be removed from queue
            await this.client.send(new DeleteMessageCommand({QueueUrl, ReceiptHandle: message.ReceiptHandle}));
          }
        }
      } catch {
        break;
      }
    }
    return {unsubscribe: () => (shouldConsume = false)};
  }

  private getQueueUrl(queueName: string): string {
    return `https://sqs.${this.queueEnv.awsRegion}.amazonaws.com/${this.queueEnv.awsAccountId}/${queueName}`;
  }
}
