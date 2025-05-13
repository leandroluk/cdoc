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
    export type Body = Partial<Omit<TProfile.Fields, 'picture'>>;
    export namespace Body {
      export const schema = Joi.object<Body>({
        givenName: Joi.string().optional().trim().max(100),
        familyName: Joi.string().optional().trim().max(100),
        theme: Joi.string().optional().trim().valid(...Object.values(ETheme)), // prettier-ignore
      });
      export const swagger = Swagger.object<Body>({
        required: [],
        properties: {
          familyName: TProfile.swagger.properties.familyName,
          givenName: TProfile.swagger.properties.givenName,
          theme: TProfile.swagger.properties.theme,
        },
      });
    }
    export const schema = Joi.object<Data>({
      body: Body.schema,
    });
  }
}
