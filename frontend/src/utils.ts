import {
  type AsyncFunction,
  NetworkError,
  NotAcceptableError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from '@cdoc/domain';
import axios, {type AxiosError, type AxiosInstance, type CreateAxiosDefaults} from 'axios';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes conditionally using `clsx` and removes duplicate classes using `twMerge`.
 *
 * This function combines multiple class names into a single string and ensures that
 * conflicting or redundant classes are properly merged, improving the performance and styling consistency.
 */
export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves the value of a cookie by its name from the `document.cookie` string.
 *
 * This function searches for a cookie by its name and returns the decoded value if found,
 * or `null` if the cookie does not exist.
 */
export function getCookie<T = string>(name: string): T | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? (decodeURIComponent(match[1]) as T) : null;
}

/**
 * Sets a cookie in the `document.cookie` string with a specified expiration time.
 *
 * This function creates or updates a cookie with a given name and value, and applies
 * an expiration date calculated based on the number of days specified. The cookie is also
 * set with the `SameSite=Lax` attribute for security.
 */
export function setCookie(name: string, value: string, days = 365): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

/**
 * Deduplicates concurrent calls to the same function by caching the promise
 * for a given key. If a request for the same key is already in progress, it
 * returns the cached promise instead of initiating a new request.
 *
 * This is useful to avoid redundant API calls or expensive operations
 * being triggered multiple times concurrently.
 */
export function dedupe<T>(key: string, fn: AsyncFunction<T>): Promise<T> {
  if (dedupe.map.has(key)) {
    return dedupe.map.get(key) as Promise<T>;
  }
  const promise = fn().finally(() => dedupe.map.delete(key));
  dedupe.map.set(key, promise);
  return promise;
}
export namespace dedupe {
  export const map = new Map<string, Promise<unknown>>();
}

export function createDomainAxios(options: CreateAxiosDefaults): AxiosInstance {
  const api = axios.create({withCredentials: true, ...options});

  api.interceptors.request.use(
    config => config,
    (error: AxiosError) => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        const ErrorConstructor = createDomainAxios.statusMap[status] || ServerError;
        throw new ErrorConstructor(message);
      }
      if (error.request) {
        throw new NetworkError();
      }
      throw new ServerError(error.message);
    }
  );

  return api;
}
export namespace createDomainAxios {
  export const statusMap: Record<number, new (..._: any[]) => Error> = {
    400: ValidationError,
    401: UnauthorizedError,
    406: NotAcceptableError,
    503: NetworkError,
    500: ServerError,
  };
}
