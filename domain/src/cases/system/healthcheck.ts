import {TSwagger} from '#/generics';

export type THealthcheck = {
  run(): Promise<THealthcheck.Result>;
};
export namespace THealthcheck {
  export type Result = {
    uptime: string;
  };
  export namespace Result {
    export const swagger = TSwagger.object<Result>({
      required: ['uptime'],
      properties: {
        uptime: TSwagger.string({
          description: 'Uptime of application',
          example: '10d',
        }),
      },
    });
  }
}
