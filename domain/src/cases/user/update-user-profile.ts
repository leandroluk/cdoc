import {TProfile} from '#/entities';
import {ETheme} from '#/enums';
import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TUpdateUserProfile = {
  run(data: TUpdateUserProfile.Data): Promise<void>;
};
export namespace TUpdateUserProfile {
  export type Data = {
    session: TSession;
    body: Data.Body;
  };
  export namespace Data {
    export type Body = Partial<Omit<TProfile.Fields, 'picture' | 'cover'>> & {
      pictureUrl?: string;
      coverUrl?: string;
    };
    export namespace Body {
      export const schema = Joi.object<Body>({
        givenName: Joi.string().optional().trim().max(100),
        familyName: Joi.string().optional().trim().max(100),
        theme: Joi.string().optional().trim().valid(...Object.values(ETheme)), // prettier-ignore
        locale: Joi.string().optional().trim().max(10).default('pt-BR'),
        timezone: Joi.string().optional().trim().default('UTC'),
        pictureUrl: Joi.string().optional().trim(),
        coverUrl: Joi.string().optional().trim(),
      });
      export const swagger = Swagger.object<Body>({
        required: [],
        properties: {
          familyName: TProfile.swagger.properties.familyName,
          givenName: TProfile.swagger.properties.givenName,
          locale: TProfile.swagger.properties.locale,
          theme: TProfile.swagger.properties.theme,
          timezone: TProfile.swagger.properties.timezone,
          pictureUrl: TProfile.swagger.properties.picture,
          coverUrl: TProfile.swagger.properties.cover,
        },
      });
    }
    export const schema = Joi.object<Data>({
      body: Body.schema,
    });
  }
}
