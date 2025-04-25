import { describe, expect, it, vi } from 'vitest';
import {
  arrayFrom,
  asyncMap,
  delay,
  escapeHTML,
  flatMap,
  getOptionsPage,
  getRegionURL,
  isCDNUrl,
  range,
  stringify,
} from './utils';
import type { ISbResult } from './interfaces';

type RangeFn = (...args: any) => [];

describe('utils', () => {
  describe('isCDNUrl', () => {
    it('returns true if the URL contains /cdn/', () => {
      expect(isCDNUrl('http://example.com/cdn/content')).toBe(true);
    });

    it('returns false if the URL does not contain /cdn/', () => {
      expect(isCDNUrl('http://example.com/content')).toBe(false);
    });
  });

  describe('getOptionsPage', () => {
    it('constructs options with default pagination', () => {
      const options = { uuid: 'awiwi' };
      expect(getOptionsPage(options)).toEqual({
        uuid: 'awiwi',
        per_page: 25,
        page: 1,
      });
    });

    it('overrides defaults when parameters are provided', () => {
      expect(getOptionsPage({ uuid: 'awiwi' }, 10, 2)).toEqual({
        uuid: 'awiwi',
        per_page: 10,
        page: 2,
      });
    });
  });

  describe('delay', () => {
    it('delays execution by specified ms', async () => {
      vi.useFakeTimers();
      const promise = delay(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
      vi.useRealTimers();
    });
  });

  describe('range', () => {
    it('creates an array from start to end', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('asyncMap', () => {
    it('applies an async function to each element in the array', async () => {
      const numbers = [1, 2, 3];
      const doubleAsync = async (n: number) => (n * 2) as unknown as Promise<ISbResult>;
      const results = await asyncMap(numbers as unknown as RangeFn[], doubleAsync);
      expect(results).toEqual([2, 4, 6]);
    });
  });

  describe('flatMap', () => {
    it('maps and flattens the array based on the provided function', () => {
      const data = [
        { id: 1, values: [10, 20] },
        { id: 2, values: [30, 40] },
      ];
      const flattenValues = (item: { values: number[] }) => item.values;
      const result = flatMap(data as unknown as ISbResult[], flattenValues);
      expect(result).toEqual([10, 20, 30, 40]);
    });
  });

  describe('stringify', () => {
    it('stringifies simple objects', () => {
      const params = { name: 'John', age: 30 };
      const result = stringify(params);
      expect(result).toBe('name=John&age=30');
    });

    it('handles arrays correctly', () => {
      const params = { names: ['John', 'Jane'] };
      const result = stringify(params, '', true);
      expect(result).toBe('=John&=Jane');
    });

    it('handles undefined values', () => {
      const params = { name: 'John', age: undefined };
      const result = stringify(params);
      expect(result).toBe('name=John');
    });

    it('handles null values', () => {
      const params = { name: 'John', age: null };
      const result = stringify(params);
      expect(result).toBe('name=John');
    });

    it('handles null and undefined values', () => {
      const params = { name: 'John', age: null, city: undefined, country: 'Italy' };
      const result = stringify(params);
      expect(result).toBe('name=John&country=Italy');
    });

    it('handles empty string values', () => {
      const params = { name: 'John', age: null, city: undefined, country: '' };
      const result = stringify(params);
      expect(result).toBe('name=John&country=');
    });

    it('does not break when given an empty object', () => {
      const params = {};
      const result = stringify(params);
      expect(result).toBe('');
    });

    it('does not break when given a null params', () => {
      const result = stringify(null as any);
      expect(result).toBe('');
    });
  });

  describe('arrayFrom function', () => {
    it('arrayFrom(undefined, (v, i) => i)) should be an empty array', () => {
      expect(arrayFrom(undefined, (_, i) => i)).toEqual([]);
    });

    it('arrayFrom(0, (v, i) => i)) should be an empty array', () => {
      expect(arrayFrom(0, (_, i) => i)).toEqual([]);
    });

    it('arrayFrom(2, () => 1) should be an array with 1 and 1', () => {
      expect(arrayFrom(2, () => 1)).toEqual([1, 1]);
    });

    it('arrayFrom(2, (v, i) => v)) should be an array with undefined values', () => {
      expect(arrayFrom(2, v => v)).toEqual([undefined, undefined]);
    });

    it('arrayFrom(2, (v, i) => i) should be an array with 0 and 1', () => {
      expect(arrayFrom(2, (v, i) => i)).toEqual([0, 1]);
    });
  });

  describe('getRegionURL', () => {
    it('returns the EU API URL by default', () => {
      expect(getRegionURL()).toBe('api.storyblok.com');
      expect(getRegionURL('unknown')).toBe('api.storyblok.com'); // test for unrecognized region code
    });

    it('returns the US API URL when region code is "us"', () => {
      expect(getRegionURL('us')).toBe('api-us.storyblok.com');
    });

    it('returns the CN API URL when region code is "cn"', () => {
      expect(getRegionURL('cn')).toBe('app.storyblokchina.cn');
    });

    it('returns the AP API URL when region code is "ap"', () => {
      expect(getRegionURL('ap')).toBe('api-ap.storyblok.com');
    });

    it('returns the CA API URL when region code is "ca"', () => {
      expect(getRegionURL('ca')).toBe('api-ca.storyblok.com');
    });
  });

  describe('escapeHTML', () => {
    it('escapes HTML characters', () => {
      const str = '<div>Test & "more" test</div>';
      const escaped = escapeHTML(str);
      expect(escaped).toBe(
        '&lt;div&gt;Test &amp; &quot;more&quot; test&lt;/div&gt;',
      );
    });
  });
});
