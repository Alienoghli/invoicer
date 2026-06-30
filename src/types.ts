export type Direction = 'ltr' | 'rtl';
export type InvoiceOrientation = 'portrait' | 'landscape';
export type InvoiceStatus = 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
export type CurrencyCode = string;
export type VatMode = 'enabled' | 'disabled' | 'reverse-charge' | 'zero-rated' | 'tax-exempt';

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  logoFileName: string;
  logoFileFormat: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  vatNumber: string;
  registrationNumber: string;
  defaultCountry: string;
  countryIso2: string;
  countryName: string;
  callingCode: string;
  defaultCurrency: string;
  vatRegion: string;
  direction: Direction;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  countryIso2: string;
  countryName: string;
  callingCode: string;
  phoneNumber: string;
  website: string;
  address: string;
  country: string;
  vatNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  swiftBic: string;
  accountNumber: string;
  sortCode: string;
  paymentReference: string;
  overseasTransferNote: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientSnapshot: Client;
  companySnapshot: CompanyProfile;
  bankSnapshot: BankDetails;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  total: number;
  currency: CurrencyCode;
  vatMode: VatMode;
  vatLabel: string;
  vatNumberDisplay: string;
  reverseChargeNote: string;
  notes: string;
  status: InvoiceStatus;
  orientation: InvoiceOrientation;
  direction: Direction;
  createdAt: string;
  updatedAt: string;
  paidAt: string;
}

export interface InvoiceNumberSettings {
  prefix: string;
  startingNumber: number;
  padding: number;
  includeYear: boolean;
  includeMonth: boolean;
  nextNumber: number;
}

export interface VatSettings {
  enabled: boolean;
  defaultRate: number;
  customRate: number;
  label: string;
  mode: VatMode;
  reverseChargeNote: string;
}

export interface AppState {
  companyProfile: CompanyProfile;
  clients: Client[];
  bankDetails: BankDetails;
  invoices: Invoice[];
  invoiceNumberSettings: InvoiceNumberSettings;
  vatSettings: VatSettings;
  defaultCurrency: CurrencyCode;
  direction: Direction;
}
