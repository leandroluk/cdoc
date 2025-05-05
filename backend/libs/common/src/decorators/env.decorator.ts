import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import Joi from 'joi';

dotenvExpand.expand(dotenv.config());

export function EnvProperty(metadata: {name?: string; schema: Joi.Schema}): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const key = metadata.name ?? String(propertyKey);
    const value = process.env[key];
    const {error, value: validatedValue} = metadata.schema.validate(value);
    if (error) {
      throw new Error(`Validation error for environment variable "${key}": ${error.message}`);
    }
    Object.defineProperty(target, propertyKey, {
      value: validatedValue,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  };
}
