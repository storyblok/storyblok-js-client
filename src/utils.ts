import type {
  AsyncFn,
  HtmlEscapes,
  ISbResult,
  ISbStoriesParams,
} from './interfaces';

// TODO: Revise this type, is it needed?
interface ISbParams extends ISbStoriesParams {
  [key: string]: any;
}

type ArrayFn = (...args: any) => void;
type FlatMapFn = (...args: any) => [] | any;
type RangeFn = (...args: any) => [];

/**
 * Checks if a URL is a CDN URL
 * @param url - The URL to check
 * @returns boolean indicating if the URL is a CDN URL
 */
export const isCDNUrl = (url = ''): boolean => url.includes('/cdn/');

/**
 * Gets pagination options for the API request
 * @param options - The base options
 * @param perPage - Number of items per page
 * @param page - Current page number
 * @returns Object with pagination options
 */
export const getOptionsPage = (
  options: ISbStoriesParams,
  perPage = 25,
  page = 1,
) => ({
  ...options,
  per_page: perPage,
  page,
});

/**
 * Creates a promise that resolves after the specified milliseconds
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise(res => setTimeout(res, ms));

/**
 * Creates an array of specified length using a mapping function
 * @param length - Length of the array
 * @param func - Mapping function
 * @returns Array of specified length
 */
export const arrayFrom = (length = 0, func: ArrayFn) =>
  Array.from({ length }, func);

/**
 * Creates an array of numbers in the specified range
 * @param start - Start of the range
 * @param end - End of the range
 * @returns Array of numbers in the range
 */
export const range = (start = 0, end = start): Array<any> => {
  const length = Math.abs(end - start) || 0;
  const step = start < end ? 1 : -1;
  return arrayFrom(length, (_, i: number) => i * step + start);
};

/**
 * Maps an array asynchronously
 * @param arr - Array to map
 * @param func - Async mapping function
 * @returns Promise resolving to mapped array
 */
export const asyncMap = async (arr: RangeFn[], func: AsyncFn) =>
  Promise.all(arr.map(func));

/**
 * Flattens an array using a mapping function
 * @param arr - Array to flatten
 * @param func - Mapping function
 * @returns Flattened array
 */
export const flatMap = (arr: ISbResult[] = [], func: FlatMapFn) =>
  arr.map(func).reduce((xs, ys) => [...xs, ...ys], []);

/**
 * Stringifies an object into a URL query string
 * @param params - Parameters to stringify
 * @param prefix - Prefix for nested keys
 * @param isArray - Whether the current level is an array
 * @returns Stringified query parameters
 */
export const stringify = (
  params: ISbParams,
  prefix?: string,
  isArray?: boolean,
): string => {
  const pairs = [];
  for (const key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      continue;
    }
    const value = params[key];
    if (value === null || value === undefined) {
      continue;
    }
    const enkey = isArray ? '' : encodeURIComponent(key);
    let pair;
    if (typeof value === 'object') {
      pair = stringify(
        value,
        prefix ? prefix + encodeURIComponent(`[${enkey}]`) : enkey,
        Array.isArray(value),
      );
    }
    else {
      pair = `${
        prefix ? prefix + encodeURIComponent(`[${enkey}]`) : enkey
      }=${encodeURIComponent(value)}`;
    }
    pairs.push(pair);
  }
  return pairs.join('&');
};

/**
 * Gets the base URL for a specific region
 * @param regionCode - Region code (eu, us, cn, ap, ca)
 * @returns Base URL for the region
 */
export const getRegionURL = (regionCode?: string): string => {
  const REGION_URLS = {
    eu: 'api.storyblok.com',
    us: 'api-us.storyblok.com',
    cn: 'app.storyblokchina.cn',
    ap: 'api-ap.storyblok.com',
    ca: 'api-ca.storyblok.com',
  } as const;

  return REGION_URLS[regionCode as keyof typeof REGION_URLS] ?? REGION_URLS.eu;
};

/**
 * Escapes HTML special characters in a string
 * @param string - String to escape
 * @returns Escaped string
 */
export const escapeHTML = (string: string): string => {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  } as HtmlEscapes;

  const reUnescapedHtml = /[&<>"']/g;
  const reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  return string && reHasUnescapedHtml.test(string)
    ? string.replace(reUnescapedHtml, chr => htmlEscapes[chr])
    : string;
};
