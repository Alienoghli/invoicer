import type { CurrencyCode, InvoiceLineItem, InvoiceNumberSettings, VatMode } from './types';

const currencyLocales: Record<string, string> = {
  GBP: 'en-GB',
  EUR: 'en-IE',
  USD: 'en-US',
  TRY: 'tr-TR',
};

export function roundMoney(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

export function calculateLineBase(item: InvoiceLineItem): number {
  return roundMoney(Math.max(0, item.quantity || 0) * Math.max(0, item.unitPrice || 0));
}

export function calculateLineDiscount(item: InvoiceLineItem): number {
  return roundMoney(Math.min(calculateLineBase(item), Math.max(0, item.discount || 0)));
}

export function calculateLineTotal(item: InvoiceLineItem): number {
  return roundMoney(calculateLineBase(item) - calculateLineDiscount(item));
}

export function calculateInvoiceTotals(lineItems: InvoiceLineItem[], vatMode: VatMode) {
  const subtotal = roundMoney(lineItems.reduce((sum, item) => sum + calculateLineBase(item), 0));
  const discountTotal = roundMoney(lineItems.reduce((sum, item) => sum + calculateLineDiscount(item), 0));
  const taxableTotal = roundMoney(subtotal - discountTotal);
  const vatTotal =
    vatMode === 'enabled'
      ? roundMoney(
          lineItems.reduce((sum, item) => {
            const lineTotal = calculateLineTotal(item);
            return sum + lineTotal * (Math.max(0, item.vatRate || 0) / 100);
          }, 0),
        )
      : 0;
  const total = roundMoney(taxableTotal + vatTotal);

  return { subtotal, discountTotal, taxableTotal, vatTotal, total };
}

export function formatCurrency(value: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currencyLocales[currency] ?? 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundMoney(value));
}

export function formatPlainNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundMoney(value));
}

export function buildInvoiceNumber(settings: InvoiceNumberSettings, date = new Date()): string {
  const parts = [settings.prefix.trim() || 'INV'];
  if (settings.includeYear) parts.push(String(date.getFullYear()));
  if (settings.includeMonth) parts.push(String(date.getMonth() + 1).padStart(2, '0'));
  parts.push(String(settings.nextNumber || settings.startingNumber || 1).padStart(settings.padding, '0'));
  return parts.join('-');
}

export function invoiceNumberPreview(settings: InvoiceNumberSettings): string {
  return buildInvoiceNumber(settings, new Date('2026-05-13T12:00:00'));
}
