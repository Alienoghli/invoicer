import type { Invoice } from './types';

function sanitizeFilePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function exportInvoicePdf(node: HTMLElement, invoice: Invoice) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL('image/png');
  const orientation = invoice.orientation === 'landscape' ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
  const clientName = sanitizeFilePart(invoice.clientSnapshot.companyName || 'Client');
  const invoiceNumber = sanitizeFilePart(invoice.invoiceNumber || 'Invoice');
  pdf.save(`${invoiceNumber}-${clientName}.pdf`);
}
