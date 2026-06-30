import { describe, expect, it } from 'vitest';
import { buildInvoiceNumber, calculateInvoiceTotals, calculateLineDiscount, calculateLineTotal, formatCurrency, invoiceNumberPreview, roundMoney } from './calculations';
import type { InvoiceLineItem, InvoiceNumberSettings } from './types';

const items: InvoiceLineItem[] = [
  { id: '1', description: 'Design', quantity: 2, unitPrice: 100.1, vatRate: 20, discount: 10, lineTotal: 190.2 },
  { id: '2', description: 'Build', quantity: 1, unitPrice: 50, vatRate: 10, discount: 0, lineTotal: 50 },
];

describe('invoice calculations', () => {
  it('calculates discounts and VAT after discount', () => {
    const totals = calculateInvoiceTotals(items, 'enabled');
    expect(totals.subtotal).toBe(250.2);
    expect(totals.discountTotal).toBe(10);
    expect(totals.vatTotal).toBe(43.04);
    expect(totals.total).toBe(283.24);
  });

  it('removes VAT for disabled/tax-exempt modes', () => {
    expect(calculateInvoiceTotals(items, 'disabled').vatTotal).toBe(0);
    expect(calculateInvoiceTotals(items, 'tax-exempt').total).toBe(240.2);
  });

  it('formats configured invoice numbers', () => {
    const settings: InvoiceNumberSettings = {
      prefix: 'UK',
      startingNumber: 1,
      padding: 3,
      includeYear: true,
      includeMonth: true,
      nextNumber: 7,
    };
    expect(invoiceNumberPreview(settings)).toBe('UK-2026-05-007');
  });

  it('formats currency with stable decimals', () => {
    expect(formatCurrency(1234.5, 'GBP')).toBe('£1,234.50');
  });

  it('clamps invalid, negative, and excessive line values', () => {
    const negativeItem: InvoiceLineItem = { id: '3', description: 'Bad input', quantity: -3, unitPrice: 100, vatRate: 23, discount: 0, lineTotal: 0 };
    const discountedItem: InvoiceLineItem = { id: '4', description: 'Discount cap', quantity: 1, unitPrice: 80, vatRate: 23, discount: 200, lineTotal: 0 };

    expect(calculateLineTotal(negativeItem)).toBe(0);
    expect(calculateLineDiscount(discountedItem)).toBe(80);
    expect(calculateLineTotal(discountedItem)).toBe(0);
  });

  it('rounds non-finite money values to zero', () => {
    expect(roundMoney(Number.NaN)).toBe(0);
    expect(roundMoney(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('falls back to sane invoice number defaults', () => {
    const settings: InvoiceNumberSettings = {
      prefix: '   ',
      startingNumber: 9,
      padding: 2,
      includeYear: false,
      includeMonth: false,
      nextNumber: 0,
    };
    expect(buildInvoiceNumber(settings, new Date('2026-06-30T00:00:00'))).toBe('INV-09');
  });
});
