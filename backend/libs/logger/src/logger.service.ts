import {ConsoleLogger, Inject, Injectable, type LogLevel, Scope} from '@nestjs/common';
import {INQUIRER} from '@nestjs/core';
import {type Observable, Subject} from 'rxjs';

@Injectable({scope: Scope.TRANSIENT})
export class LoggerService extends ConsoleLogger {
  static appName = '';
  static logStream = new Subject<string>();

  constructor(@Inject(INQUIRER) context: string | object = '') {
    super(typeof context === 'object' ? context.constructor.name : context);
  }

  override formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string
  ): string {
    const formattedMessage = super.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      contextMessage,
      timestampDiff
    );
    LoggerService.logStream.next(`[${logLevel.toUpperCase()}]: ${formattedMessage}`);
    return formattedMessage;
  }

  override formatPid(): string {
    return `[${LoggerService.appName}] `;
  }

  static setAppName(appName: string): void {
    LoggerService.appName = appName;
  }

  getLogStream(): Observable<string> {
    return LoggerService.logStream.asObservable();
  }
}
