import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAppState, createDefaultState, loadAppState, saveAppState } from './storage';

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

describe('local-first storage', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a complete default state with seed data and logo metadata defaults', () => {
    const state = createDefaultState();

    expect(state.companyProfile.logo).toBe('');
    expect(state.companyProfile.logoFileName).toBe('');
    expect(state.companyProfile.logoFileFormat).toBe('');
    expect(state.clients.length).toBeGreaterThan(0);
    expect(state.invoices.length).toBeGreaterThan(0);
    expect(state.invoices[0].total).toBe(5289);
  });

  it('saves and loads app state from localStorage', () => {
    const state = createDefaultState();
    const nextState = {
      ...state,
      companyProfile: {
        ...state.companyProfile,
        name: 'Release QA Studio',
        logo: 'data:image/svg+xml;base64,abc',
        logoFileName: 'logo.svg',
        logoFileFormat: 'SVG',
      },
    };

    saveAppState(nextState);
    const loaded = loadAppState();

    expect(localStorageMock.setItem).toHaveBeenCalledWith('invoicer:v1', expect.any(String));
    expect(loaded.companyProfile.name).toBe('Release QA Studio');
    expect(loaded.companyProfile.logoFileName).toBe('logo.svg');
    expect(loaded.companyProfile.logoFileFormat).toBe('SVG');
  });

  it('normalizes legacy stored data that is missing newer fields', () => {
    const legacyState = createDefaultState();
    const legacyCompany = { ...legacyState.companyProfile };
    delete (legacyCompany as Partial<typeof legacyCompany>).logoFileName;
    delete (legacyCompany as Partial<typeof legacyCompany>).logoFileFormat;
    const legacyInvoice = {
      ...legacyState.invoices[0],
      companySnapshot: legacyCompany,
      clientSnapshot: {
        ...legacyState.clients[0],
        countryIso2: '',
        countryName: '',
        callingCode: '',
        phoneNumber: '',
      },
    };

    localStorageMock.setItem('invoicer:v1', JSON.stringify({
      ...legacyState,
      companyProfile: legacyCompany,
      invoices: [legacyInvoice],
    }));

    const loaded = loadAppState();

    expect(loaded.companyProfile.logoFileName).toBe('');
    expect(loaded.companyProfile.logoFileFormat).toBe('');
    expect(loaded.invoices[0].companySnapshot.logoFileName).toBe('');
    expect(loaded.invoices[0].companySnapshot.logoFileFormat).toBe('');
    expect(loaded.invoices[0].clientSnapshot.countryIso2).toBe('IE');
    expect(loaded.invoices[0].clientSnapshot.callingCode).toBe('+353');
  });

  it('falls back to default state when stored JSON is corrupt', () => {
    localStorageMock.setItem('invoicer:v1', '{bad json');

    const loaded = loadAppState();

    expect(loaded.companyProfile.name).toBe(createDefaultState().companyProfile.name);
    expect(loaded.invoices.length).toBe(1);
  });

  it('clears local-first state', () => {
    clearAppState();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('invoicer:v1');
  });
});
