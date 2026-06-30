import { calculateInvoiceTotals } from './calculations';
import { DEFAULT_COUNTRY, findCountryByCallingCode, findCountryByIso2, findCountryByName } from './countries';
import type {
  AppState,
  BankDetails,
  Client,
  CompanyProfile,
  Invoice,
  InvoiceLineItem,
  VatSettings,
} from './types';

const STORAGE_KEY = 'invoicer:v1';
const now = '2026-05-13T10:00:00.000Z';

export const overseasTransferNote =
  'Please ensure that any international or intermediary bank transfer fees are covered by the sender so the full invoice amount is received.';

export const defaultCompanyProfile: CompanyProfile = {
  id: 'company-1',
  name: 'Northway Design',
  logo: '',
  logoFileName: '',
  logoFileFormat: '',
  address: '123 Bridge Street\nDublin 2, D02 XY01\nIreland',
  email: 'info@northway.design',
  phone: '+353 1 234 5678',
  website: 'northway.design',
  vatNumber: 'IE1234567A',
  registrationNumber: 'REG-45821',
  defaultCountry: 'Ireland',
  countryIso2: 'IE',
  countryName: 'Ireland',
  callingCode: '+353',
  defaultCurrency: 'EUR',
  vatRegion: 'EU',
  direction: 'ltr',
};

export const defaultBankDetails: BankDetails = {
  id: 'bank-1',
  bankName: 'AIB Bank',
  accountHolder: 'Northway Design Ltd.',
  iban: 'IE29 AIBK 9311 1234 5678 90',
  swiftBic: 'AIBKIE2D',
  accountNumber: '',
  sortCode: '',
  paymentReference: 'Use invoice number as payment reference.',
  overseasTransferNote,
};

export const defaultVatSettings: VatSettings = {
  enabled: true,
  defaultRate: 23,
  customRate: 23,
  label: 'VAT',
  mode: 'enabled',
  reverseChargeNote: 'Reverse charge applies. Customer to account for VAT.',
};

export const seedClients: Client[] = [
  {
    id: 'client-acme',
    companyName: 'Acme Studios Ltd.',
    contactPerson: 'Mira Collins',
    email: 'accounts@acmestudios.example',
    phone: '+353 1 555 0199',
    countryIso2: 'IE',
    countryName: 'Ireland',
    callingCode: '+353',
    phoneNumber: '1 555 0199',
    website: 'https://acmestudios.example',
    address: '45 Camden Street Lower\nDublin 2, D02 XE80\nIreland',
    country: 'Ireland',
    vatNumber: 'IE9876543B',
    notes: 'Prefers PDF invoices by email.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'client-bright',
    companyName: 'Bright Ideas Ltd.',
    contactPerson: 'Noah Wright',
    email: 'finance@brightideas.example',
    phone: '+44 20 7946 0198',
    countryIso2: 'GB',
    countryName: 'United Kingdom',
    callingCode: '+44',
    phoneNumber: '20 7946 0198',
    website: 'https://brightideas.example',
    address: '18 Featherstone Street\nLondon, EC1Y 8SL\nUnited Kingdom',
    country: 'United Kingdom',
    vatNumber: 'GB123456789',
    notes: '',
    createdAt: now,
    updatedAt: now,
  },
];

const seedItems: InvoiceLineItem[] = [
  { id: 'line-1', description: 'Discovery and Planning', quantity: 1, unitPrice: 600, vatRate: 23, discount: 0, lineTotal: 600 },
  { id: 'line-2', description: 'UI/UX Design', quantity: 1, unitPrice: 1200, vatRate: 23, discount: 0, lineTotal: 1200 },
  { id: 'line-3', description: 'Frontend Development', quantity: 1, unitPrice: 1800, vatRate: 23, discount: 0, lineTotal: 1800 },
  { id: 'line-4', description: 'Content Integration', quantity: 1, unitPrice: 400, vatRate: 23, discount: 0, lineTotal: 400 },
  { id: 'line-5', description: 'Testing and QA', quantity: 1, unitPrice: 300, vatRate: 23, discount: 0, lineTotal: 300 },
];

function createSeedInvoice(): Invoice {
  const totals = calculateInvoiceTotals(seedItems, 'enabled');
  return {
    id: 'invoice-seed-1',
    invoiceNumber: 'INV-2026-0042',
    clientId: seedClients[0].id,
    clientSnapshot: seedClients[0],
    companySnapshot: defaultCompanyProfile,
    bankSnapshot: defaultBankDetails,
    issueDate: '2026-05-13',
    dueDate: '2026-05-27',
    lineItems: seedItems,
    subtotal: totals.subtotal,
    discountTotal: totals.discountTotal,
    vatTotal: totals.vatTotal,
    total: totals.total,
    currency: 'EUR',
    vatMode: 'enabled',
    vatLabel: 'VAT',
    vatNumberDisplay: defaultCompanyProfile.vatNumber,
    reverseChargeNote: defaultVatSettings.reverseChargeNote,
    notes: 'Thank you for your business.\nIf you have any questions, please get in touch.',
    status: 'Paid',
    orientation: 'portrait',
    direction: 'ltr',
    createdAt: now,
    updatedAt: now,
    paidAt: '2026-05-20T09:00:00.000Z',
  };
}

export function createDefaultState(): AppState {
  return {
    companyProfile: defaultCompanyProfile,
    clients: seedClients,
    bankDetails: defaultBankDetails,
    invoices: [createSeedInvoice()],
    invoiceNumberSettings: {
      prefix: 'INV',
      startingNumber: 1,
      padding: 4,
      includeYear: true,
      includeMonth: false,
      nextNumber: 43,
    },
    vatSettings: defaultVatSettings,
    defaultCurrency: 'EUR',
    direction: 'ltr',
  };
}

function splitPhone(phone: string) {
  const match = phone.trim().match(/^(\+\d+)\s*(.*)$/);
  return {
    callingCode: match?.[1] || '',
    phoneNumber: match?.[2] || phone.trim(),
  };
}

function normalizeCompanyProfile(company: CompanyProfile): CompanyProfile {
  const country =
    findCountryByIso2(company.countryIso2)
    ?? findCountryByName(company.countryName)
    ?? findCountryByName(company.defaultCountry)
    ?? DEFAULT_COUNTRY;
  return {
    ...company,
    logoFileName: company.logoFileName || '',
    logoFileFormat: company.logoFileFormat || '',
    defaultCountry: company.defaultCountry || country.name,
    countryIso2: company.countryIso2 || country.iso2,
    countryName: company.countryName || country.name,
    callingCode: company.callingCode || country.callingCode,
    defaultCurrency: company.defaultCurrency || country.defaultCurrency,
    vatRegion: company.vatRegion || country.vatRegion,
  };
}

function normalizeClient(client: Client): Client {
  const split = splitPhone(client.phone || '');
  const country =
    findCountryByIso2(client.countryIso2)
    ?? findCountryByName(client.countryName)
    ?? findCountryByName(client.country)
    ?? findCountryByCallingCode(client.callingCode || split.callingCode)
    ?? DEFAULT_COUNTRY;
  const callingCode = client.callingCode || split.callingCode || country.callingCode;
  const phoneNumber = client.phoneNumber || split.phoneNumber;
  return {
    ...client,
    countryIso2: client.countryIso2 || country.iso2,
    countryName: client.countryName || country.name,
    callingCode,
    phoneNumber,
    country: client.country || country.name,
    phone: client.phone || (phoneNumber ? `${callingCode} ${phoneNumber}`.trim() : ''),
  };
}

function normalizeState(state: AppState): AppState {
  const base = createDefaultState();
  const companyProfile = normalizeCompanyProfile({ ...base.companyProfile, ...state.companyProfile });
  const clients = (state.clients || base.clients).map(normalizeClient);
  return {
    ...base,
    ...state,
    companyProfile,
    clients,
    invoices: (state.invoices || base.invoices).map((invoice) => ({
      ...invoice,
      clientSnapshot: normalizeClient(invoice.clientSnapshot),
      companySnapshot: normalizeCompanyProfile(invoice.companySnapshot),
    })),
  };
}

export function loadAppState(): AppState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();
    return normalizeState({ ...createDefaultState(), ...JSON.parse(stored) } as AppState);
  } catch {
    return createDefaultState();
  }
}

export function saveAppState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAppState() {
  window.localStorage.removeItem(STORAGE_KEY);
}
