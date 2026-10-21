import { formatPrice, formatChange } from './index';

describe('utils', () => {
  describe('formatPrice', () => {
    it('formats a regular price with default 2 decimal places', () => {
      expect(formatPrice(1234.56)).toBe('1,234.56');
    });

    it('formats zero correctly with 2 decimal places', () => {
      expect(formatPrice(0)).toBe('0.00');
    });

    it('formats large numbers with commas', () => {
      expect(formatPrice(67999.5)).toBe('67,999.50');
      expect(formatPrice(1000000)).toBe('1,000,000.00');
    });

    it('respects custom decimal parameter', () => {
      expect(formatPrice(1234.5678, 4)).toBe('1,234.5678');
      expect(formatPrice(1234.5, 0)).toBe('1,235');
    });

    it('handles negative numbers', () => {
      expect(formatPrice(-50.25)).toBe('-50.25');
    });
  });

  describe('formatChange', () => {
    it('formats positive change with a plus sign', () => {
      expect(formatChange(2.45)).toBe('+2.45%');
      expect(formatChange(10.5)).toBe('+10.50%');
    });

    it('formats zero change with a plus sign', () => {
      expect(formatChange(0)).toBe('+0.00%');
    });

    it('formats negative change without duplicate signs', () => {
      expect(formatChange(-1.23)).toBe('-1.23%');
      expect(formatChange(-0.45)).toBe('-0.45%');
    });
  });
});

