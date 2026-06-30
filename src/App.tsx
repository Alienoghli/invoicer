import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
  Badge,
  Banner,
  Button,
  Checkbox,
  Combobox,
  Dialog,
  Input,
  InputArea,
  InputGroup,
  LayerCard,
  Loader,
  Select,
  Table,
  Tabs,
} from '@cloudflare/kumo';
import {
  ArrowUpRight,
  Check,
  CopySimple,
  DownloadSimple,
  DotsThree,
  FilePdf,
  FloppyDisk,
  GithubLogo,
  GlobeSimple,
  GridFour,
  LinkedinLogo,
  LockKey,
  MagnifyingGlass,
  MediumLogo,
  NotePencil,
  PencilSimple,
  Plus,
  Question,
  Receipt,
  ShieldCheck,
  SpinnerGap,
  Trash,
  UploadSimple,
  WarningCircle,
} from '@phosphor-icons/react';
import { buildInvoiceNumber, calculateInvoiceTotals, calculateLineTotal, formatCurrency } from './calculations';
import invoicerLogoUrl from './assets/invoicer-logo.svg';
import supportAvatarUrl from './assets/support-avatar.jpg';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  countryOptionLabel,
  findCountryByCallingCode,
  findCountryByIso2,
  findCountryByName,
  resolveCountry,
  type Country,
} from './countries';
import { exportInvoicePdf } from './pdf';
import { getDashboardClientModalOpenAfterNavigation, type AppPage } from './navigation';
import { createDefaultState, loadAppState, saveAppState } from './storage';
import { appToastManager } from './toast-manager';
import type {
  AppState,
  BankDetails,
  Client,
  CompanyProfile,
  CurrencyCode,
  Invoice,
  InvoiceLineItem,
  InvoiceOrientation,
  InvoiceStatus,
  VatMode,
} from './types';

type Page = AppPage;
type ToastKind = 'success' | 'error' | 'info';
type StatusFilter = 'All' | InvoiceStatus;

interface MenuPosition {
  top: number;
  left: number;
}

interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface PhoneRow {
  id: string;
  type: string;
  countryIso2: string;
  countryName: string;
  callingCode: string;
  value: string;
}

type CountryOption = Country & {
  value: string;
  label: string;
  searchText: string;
};

const statuses: InvoiceStatus[] = ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'];
const statusFilterOptions: StatusFilter[] = ['All', ...statuses];
const currencies: CurrencyCode[] = Array.from(new Set(['GBP', 'EUR', 'USD', 'TRY', ...COUNTRIES.map((country) => country.defaultCurrency)])).sort();
const vatModes: VatMode[] = ['enabled', 'disabled', 'reverse-charge', 'zero-rated', 'tax-exempt'];
const emailTypes = ['Work', 'Home', 'School', 'Billing', 'Other'];
const phoneTypes = ['Work', 'Mobile', 'Home', 'Billing', 'Other'];
const alphaCollator = new Intl.Collator('en', { sensitivity: 'base' });
const countryOptions: CountryOption[] = [...COUNTRIES]
  .sort((first, second) => alphaCollator.compare(first.name, second.name))
  .map((country) => ({
    ...country,
    value: country.iso2,
    label: countryOptionLabel(country),
    searchText: `${country.name} ${country.callingCode} ${country.iso2} ${country.iso3} ${country.defaultCurrency}`,
  }));
const countryNameOptions: CountryOption[] = countryOptions.map((country) => ({
  ...country,
  label: country.name,
}));
const defaultCountry = DEFAULT_COUNTRY;
const today = new Date().toISOString().slice(0, 10);
const nextDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

function coerceNativeChange(value: unknown) {
  const stringValue = String(value ?? '');
  return { target: { value: stringValue }, currentTarget: { value: stringValue } };
}

function coerceSelectValue(value: React.SelectHTMLAttributes<HTMLSelectElement>['value']) {
  if (Array.isArray(value)) return value.map(String);
  if (value === undefined || value === null) return value;
  if (value === '') return null;
  return String(value);
}

function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(' ');
}

function optionElementsFromChildren(children: React.ReactNode) {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return [];
    if (child.type !== 'option') return [];
    const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
    const value = props.value ?? (typeof props.children === 'string' ? props.children : '');
    return (
      <Select.Option disabled={props.disabled} key={String(value)} value={String(value)}>
        {props.children}
      </Select.Option>
    );
  });
}

function optionLabelsFromChildren(children: React.ReactNode) {
  return React.Children.toArray(children).reduce<Record<string, React.ReactNode>>((labels, child) => {
    if (!React.isValidElement(child) || child.type !== 'option') return labels;
    const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
    const value = props.value ?? (typeof props.children === 'string' ? props.children : '');
    labels[String(value)] = props.children;
    return labels;
  }, {});
}

function selectPlaceholderFromChildren(children: React.ReactNode) {
  const placeholderOption = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child) || child.type !== 'option') return false;
    const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
    return String(props.value ?? '') === '';
  });
  if (!React.isValidElement(placeholderOption)) return undefined;
  const props = placeholderOption.props as React.OptionHTMLAttributes<HTMLOptionElement>;
  return typeof props.children === 'string' ? props.children : undefined;
}

function findClientCountry(client: Client) {
  return (
    findCountryByIso2(client.countryIso2)
    ?? findCountryByName(client.countryName)
    ?? findCountryByName(client.country)
    ?? findCountryByCallingCode(client.callingCode)
    ?? defaultCountry
  );
}

function findPhoneCountry(row: { countryIso2?: string; callingCode?: string; countryName?: string }) {
  return (
    findCountryByIso2(row.countryIso2)
    ?? findCountryByName(row.countryName)
    ?? findCountryByCallingCode(row.callingCode, row.countryName)
    ?? defaultCountry
  );
}

function findCompanyCountry(company: CompanyProfile) {
  return (
    findCountryByIso2(company.countryIso2)
    ?? findCountryByName(company.countryName)
    ?? findCountryByName(company.defaultCountry)
    ?? findCountryByCallingCode(company.callingCode)
    ?? defaultCountry
  );
}

function countryOptionFromCountry(country: Country | undefined) {
  if (!country) return null;
  return countryOptions.find((option) => option.iso2 === country.iso2) ?? null;
}

function countryNameOptionFromCountry(country: Country | undefined) {
  if (!country) return null;
  return countryNameOptions.find((option) => option.iso2 === country.iso2) ?? null;
}

function resolveCountryOption(value: unknown) {
  const country = resolveCountry(value);
  return countryOptionFromCountry(country);
}

function parsePhone(phone: string) {
  const match = phone.trim().match(/^(\+\d+)\s*(.*)$/);
  return {
    callingCode: match?.[1] || '',
    phoneNumber: match?.[2] || phone.trim(),
  };
}

function createPhoneRow(country: Country = defaultCountry, value = ''): PhoneRow {
  return {
    id: uid('phone'),
    type: 'Work',
    countryIso2: country.iso2,
    countryName: country.name,
    callingCode: country.callingCode,
    value,
  };
}

function phoneRowFromClient(client: Client): PhoneRow {
  const parsed = parsePhone(client.phone || '');
  const country = findClientCountry(client);
  return {
    ...createPhoneRow(country, client.phoneNumber || parsed.phoneNumber),
    callingCode: client.callingCode || parsed.callingCode || country.callingCode,
  };
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function emptyClient(): Client {
  const stamp = new Date().toISOString();
  return {
    id: uid('client'),
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    countryIso2: '',
    countryName: '',
    callingCode: '',
    phoneNumber: '',
    website: '',
    address: '',
    country: '',
    vatNumber: '',
    notes: '',
    createdAt: stamp,
    updatedAt: stamp,
  };
}

function emptyLine(vatRate: number): InvoiceLineItem {
  return {
    id: uid('line'),
    description: '',
    quantity: 1,
    unitPrice: 0,
    vatRate,
    discount: 0,
    lineTotal: 0,
  };
}

function createDraftInvoice(state: AppState): Invoice {
  const client = state.clients[0] ?? emptyClient();
  const lineItems = [emptyLine(state.vatSettings.defaultRate)];
  const totals = calculateInvoiceTotals(lineItems, state.vatSettings.mode);
  const stamp = new Date().toISOString();
  return {
    id: uid('invoice'),
    invoiceNumber: buildInvoiceNumber(state.invoiceNumberSettings),
    clientId: client.id,
    clientSnapshot: client,
    companySnapshot: state.companyProfile,
    bankSnapshot: state.bankDetails,
    issueDate: today,
    dueDate: nextDueDate,
    lineItems,
    subtotal: totals.subtotal,
    discountTotal: totals.discountTotal,
    vatTotal: totals.vatTotal,
    total: totals.total,
    currency: state.defaultCurrency,
    vatMode: state.vatSettings.mode,
    vatLabel: state.vatSettings.label,
    vatNumberDisplay: state.companyProfile.vatNumber,
    reverseChargeNote: state.vatSettings.reverseChargeNote,
    notes: 'Thank you for your business.\nIf you have any questions, please get in touch.',
    status: 'Draft',
    orientation: 'portrait',
    direction: 'ltr',
    createdAt: stamp,
    updatedAt: stamp,
    paidAt: '',
  };
}

function mergeInvoiceTotals(invoice: Invoice): Invoice {
  const lineItems = invoice.lineItems.map((item) => ({ ...item, lineTotal: calculateLineTotal(item) }));
  const totals = calculateInvoiceTotals(lineItems, invoice.vatMode);
  return { ...invoice, ...totals, lineItems };
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const variant: React.ComponentProps<typeof Badge>['variant'] =
    status === 'Paid'
      ? 'success'
      : status === 'Overdue'
        ? 'warning'
        : status === 'Cancelled'
          ? 'neutral'
          : status === 'Pending'
            ? 'info'
            : 'secondary';
  return <Badge className={`status-badge status-${status.toLowerCase()}`} variant={variant}>{status}</Badge>;
}

function LogoMark({ company }: { company: CompanyProfile }) {
  if (company.logo) {
    return <img className="logo-image" src={company.logo} alt={`${company.name} logo`} />;
  }
  const initials = company.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return <div className="logo-mark" aria-hidden="true">{initials || 'IN'}</div>;
}

function Field({
  label,
  children,
  error,
  hint,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  const fieldId = useId();
  const caption = error ? <small className="field-caption">{error}</small> : hint ? <small className="field-hint">{hint}</small> : null;
  const kumoCaption = !error && hint ? <small className="field-hint">{hint}</small> : null;
  const child = React.Children.only(children);
  if (React.isValidElement(child)) {
    if (child.type === 'input') {
      const { children: _children, size: _size, ...inputProps } = child.props as React.InputHTMLAttributes<HTMLInputElement>;
      return (
        <label className={`field-shell ${error ? 'field-error' : ''} ${className}`.trim()}>
          <span className="field-label">{label}</span>
          <Input
            {...inputProps}
            aria-label={inputProps['aria-label'] ?? label}
            aria-invalid={inputProps['aria-invalid'] ?? (error ? true : undefined)}
            className={classNames('app-field-control', inputProps.className)}
          />
          {caption}
        </label>
      );
    }

    if (child.type === 'textarea') {
      const { children: textareaChildren, ...textareaProps } = child.props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
      return (
        <label className={`field-shell ${error ? 'field-error' : ''} ${className}`.trim()}>
          <span className="field-label">{label}</span>
          <InputArea
            {...textareaProps}
            aria-label={textareaProps['aria-label'] ?? label}
            aria-invalid={textareaProps['aria-invalid'] ?? (error ? true : undefined)}
            className={classNames('app-field-control', textareaProps.className)}
          >
            {textareaChildren}
          </InputArea>
          {caption}
        </label>
      );
    }

    if (child.type === 'select') {
      const {
        children: optionChildren,
        onChange,
        value,
        defaultValue,
        size: _size,
        ...selectProps
      } = child.props as React.SelectHTMLAttributes<HTMLSelectElement>;
      const optionLabels = optionLabelsFromChildren(optionChildren);
      return (
        <div className={`field-shell ${error ? 'field-error' : ''} ${className}`.trim()}>
          <span className="field-label" id={fieldId}>{label}</span>
          <Select
            {...selectProps}
            aria-labelledby={selectProps['aria-labelledby'] ?? fieldId}
            className={classNames('app-field-control', selectProps.className)}
            value={coerceSelectValue(value)}
            defaultValue={coerceSelectValue(defaultValue)}
            error={error}
            placeholder={selectPlaceholderFromChildren(optionChildren)}
            renderValue={(selectedValue) => {
              if (Array.isArray(selectedValue)) {
                return selectedValue.map((item) => optionLabels[String(item)] ?? String(item)).join(', ');
              }
              return optionLabels[String(selectedValue)] ?? String(selectedValue);
            }}
            onValueChange={(nextValue) => onChange?.(coerceNativeChange(nextValue) as React.ChangeEvent<HTMLSelectElement>)}
          >
            {optionElementsFromChildren(optionChildren)}
          </Select>
          {kumoCaption}
        </div>
      );
    }
  }

  return (
    <label className={`field ${error ? 'field-error' : ''} ${className}`.trim()}>
      <span>{label}</span>
      {children}
      {error ? <small className="field-caption">{error}</small> : hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <Receipt className="empty-state-icon" size={34} weight="duotone" />
        <h2>{title}</h2>
        <p>{body}</p>
        {action ? <div className="empty-state-action">{action}</div> : null}
      </div>
    </div>
  );
}

function DashboardTableEmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-hero">
        <GridFour className="dashboard-empty-icon" size={34} weight="duotone" />
        <h2>{title}</h2>
        <p>{body}</p>
        {action ? <div className="dashboard-empty-action">{action}</div> : null}
      </div>
    </div>
  );
}

type OperationalStateKind = 'empty' | 'loading' | 'error' | 'permission' | 'duplicate' | 'unsaved';

const operationalStateKumoConfig: Record<OperationalStateKind, { icon: React.ReactNode; variant: React.ComponentProps<typeof Banner>['variant'] }> = {
  empty: { icon: <Receipt size={18} weight="duotone" />, variant: 'default' },
  loading: { icon: <SpinnerGap size={18} weight="bold" />, variant: 'default' },
  error: { icon: <WarningCircle size={18} weight="fill" />, variant: 'error' },
  permission: { icon: <LockKey size={18} weight="fill" />, variant: 'alert' },
  duplicate: { icon: <CopySimple size={18} weight="fill" />, variant: 'alert' },
  unsaved: { icon: <NotePencil size={18} weight="fill" />, variant: 'alert' },
};

function OperationalState({
  kind,
  title,
  body,
  action,
  compact = false,
}: {
  kind: OperationalStateKind;
  title: string;
  body: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  const config = operationalStateKumoConfig[kind];
  return (
    <Banner
      action={action ? <div className="operational-state-action">{action}</div> : undefined}
      className={`operational-state operational-state-${kind} ${compact ? 'compact' : ''}`.trim()}
      description={body}
      icon={config.icon}
      title={title}
      variant={config.variant}
    />
  );
}

function ConfirmationModal({
  opened,
  title,
  body,
  cancelLabel = 'Close',
  secondaryLabel,
  confirmLabel,
  danger = false,
  onCancel,
  onSecondary,
  onConfirm,
}: {
  opened: boolean;
  title: string;
  body: string;
  cancelLabel?: string;
  secondaryLabel?: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onSecondary?: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root disablePointerDismissal open={opened} onOpenChange={(nextOpen) => { if (!nextOpen) onCancel(); }} role={danger ? 'alertdialog' : 'dialog'}>
      <Dialog className={`app-dialog ${danger ? 'app-dialog-danger' : ''}`} size={secondaryLabel ? 'base' : 'sm'}>
        <div className="app-dialog-header">
          {danger ? (
            <span className="app-dialog-icon" aria-hidden="true">
              <WarningCircle size={20} weight="fill" />
            </span>
          ) : null}
          <Dialog.Title>{title}</Dialog.Title>
        </div>
        <Dialog.Description className="app-dialog-description">{body}</Dialog.Description>
        <div className="app-dialog-actions">
          <Button size="sm" variant={secondaryLabel ? 'ghost' : 'secondary'} onClick={onCancel}>{cancelLabel}</Button>
          {secondaryLabel && onSecondary ? (
            <Button size="sm" variant="secondary" onClick={onSecondary}>{secondaryLabel}</Button>
          ) : null}
          <Button size="sm" variant={danger ? 'destructive' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
}

const supportLinks = [
  {
    label: 'Personal website',
    description: 'Visit my work and profile',
    href: 'https://alienoghli.com/',
    icon: GlobeSimple,
  },
  {
    label: 'LinkedIn',
    description: 'Connect professionally',
    href: 'https://www.linkedin.com/in/ali-e-noghli',
    icon: LinkedinLogo,
  },
  {
    label: 'GitHub',
    description: 'View source, star, or fork',
    href: 'https://github.com/alienoghli/',
    icon: GithubLogo,
  },
  {
    label: 'Medium',
    description: 'Read project updates',
    href: 'https://medium.com/@alienoghli',
    icon: MediumLogo,
  },
];

function SupportModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Dialog.Root open={opened} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog className="support-modal" size="base">
        <LayerCard className="support-modal-card">
          <LayerCard.Secondary className="support-modal-header">
            <div>
              <Dialog.Title>Support</Dialog.Title>
            </div>
          </LayerCard.Secondary>
          <LayerCard.Primary className="support-modal-body">
            <Dialog.Description className="support-project-description">
              Invoicer is an open-source, local-first invoice tool. Your data stays in your browser and is never sent to me or shared by the app.
            </Dialog.Description>

            <div className="support-badges" aria-label="Project qualities">
              <span className="support-badge support-badge-open">
                <Check size={13} weight="bold" />
                Open source
              </span>
              <span className="support-badge support-badge-private">
                <ShieldCheck size={13} weight="fill" />
                Privacy-friendly
              </span>
            </div>

            <section className="support-owner-section" aria-label="Owner and support links">
              <div className="support-owner-card">
                <div className="support-owner-header">
                  <img className="support-avatar" src={supportAvatarUrl} alt="Ali Ezzatnoghli" />
                  <div className="support-owner-identity">
                    <h3>Ali Ezzatnoghli</h3>
                    <p>Product Designer</p>
                  </div>
                </div>
                <div className="support-owner-divider" />
                <p className="support-owner-support">Follow the project, share feedback, or contribute if you would like to support its development.</p>
              </div>

              <div className="support-link-list" aria-label="Contact and social links">
                {supportLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a className="support-link-row" href={link.href} key={link.label} rel="noreferrer" target={link.href.startsWith('mailto:') ? undefined : '_blank'}>
                      <span className="support-link-icon" aria-hidden="true"><Icon size={16} weight="fill" /></span>
                      <span className="support-link-copy">
                        <span>{link.label}</span>
                        <small>{link.description}</small>
                      </span>
                      <ArrowUpRight className="support-link-arrow" size={15} />
                    </a>
                  );
                })}
              </div>
            </section>
          </LayerCard.Primary>
          <LayerCard.Secondary className="support-modal-footer">
            <span><Check size={13} weight="bold" /> All data stays on this device</span>
            <Button className="secondary-button" onClick={onClose} size="sm" type="button" variant="secondary">Close</Button>
          </LayerCard.Secondary>
        </LayerCard>
      </Dialog>
    </Dialog.Root>
  );
}

function isPanelHeading(child: React.ReactNode) {
  if (!React.isValidElement(child)) return false;
  const className = (child.props as { className?: string }).className;
  return typeof className === 'string' && className.split(/\s+/).includes('panel-heading');
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const childItems = React.Children.toArray(children);
  const headingIndex = childItems.findIndex(isPanelHeading);

  if (headingIndex === -1) {
    return (
      <LayerCard className={`panel ${className}`.trim()}>
        <LayerCard.Primary className="panel-primary">{children}</LayerCard.Primary>
      </LayerCard>
    );
  }

  return (
    <LayerCard className={`panel ${className}`.trim()}>
      <LayerCard.Secondary className="panel-secondary">
        {childItems[headingIndex]}
      </LayerCard.Secondary>
      <LayerCard.Primary className="panel-primary">
        {childItems.filter((_, index) => index !== headingIndex)}
      </LayerCard.Primary>
    </LayerCard>
  );
}

function findDuplicateValues(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  values
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .forEach((value) => {
      if (seen.has(value)) duplicates.add(value);
      seen.add(value);
    });
  return duplicates;
}

function getInvoiceEmptyState(statusFilter: 'All' | InvoiceStatus, query: string) {
  const hasSearch = query.trim().length > 0;
  const statusCopy: Record<InvoiceStatus, { title: string; body: string }> = {
    Draft: {
      title: 'No draft invoices',
      body: 'Draft invoices you save before sending will appear here.',
    },
    Pending: {
      title: 'No pending invoices',
      body: 'Invoices waiting for payment will appear here once they are marked as pending.',
    },
    Paid: {
      title: 'No paid invoices',
      body: 'Invoices marked as paid will appear here so you can review completed payments.',
    },
    Overdue: {
      title: 'No overdue invoices',
      body: 'Overdue invoices will appear here when payment deadlines pass without being paid.',
    },
    Cancelled: {
      title: 'No cancelled invoices',
      body: 'Cancelled invoices will appear here when you choose to keep a record without collecting payment.',
    },
  };

  if (statusFilter === 'All') {
    return hasSearch
      ? {
          title: 'No matching invoices',
          body: 'Try a different invoice number, client name, or status filter.',
        }
      : {
          title: 'No invoices yet',
          body: 'Create your first invoice and start tracking payments locally.',
        };
  }

  if (hasSearch) {
    return {
      title: `No matching ${statusFilter.toLowerCase()} invoices`,
      body: `There are no ${statusFilter.toLowerCase()} invoices matching your search. Try another client name or invoice number.`,
    };
  }

  return statusCopy[statusFilter];
}

function getOverlayPosition(anchor: HTMLElement, menuWidth: number, menuHeight: number): MenuPosition {
  const rect = anchor.getBoundingClientRect();
  const margin = 12;
  const gap = 7;
  const left = Math.min(window.innerWidth - menuWidth - margin, Math.max(margin, rect.right - menuWidth));
  let top = rect.bottom + gap;

  if (top + menuHeight > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - menuHeight - gap);
  }

  return { top, left };
}

function menuStyle(position: MenuPosition | null): CSSProperties {
  return {
    visibility: position ? 'visible' : 'hidden',
    ...(position ?? { top: 0, left: 0 }),
  };
}

function InvoiceTemplate({ invoice, compact = false }: { invoice: Invoice; compact?: boolean }) {
  const paymentReference = invoice.bankSnapshot.paymentReference || `Use ${invoice.invoiceNumber} as payment reference.`;
  const vatNote =
    invoice.vatMode === 'reverse-charge'
      ? invoice.reverseChargeNote
      : invoice.vatMode === 'zero-rated'
        ? 'Zero-rated supply.'
        : invoice.vatMode === 'tax-exempt'
          ? 'Tax-exempt supply.'
          : '';

  return (
    <article
      className={`invoice-document ${invoice.orientation} ${compact ? 'compact' : ''}`}
      dir="ltr"
      aria-label={`Invoice ${invoice.invoiceNumber}`}
    >
      <header className="invoice-header">
        <div className="company-lockup">
          <LogoMark company={invoice.companySnapshot} />
          <div>
            <h2>{invoice.companySnapshot.name || 'Your company name'}</h2>
            <p>{invoice.companySnapshot.address || 'Company address'}</p>
            <p>{invoice.companySnapshot.email || 'email@example.com'}</p>
            <p>{invoice.companySnapshot.phone || 'Phone number'}</p>
            {invoice.companySnapshot.vatNumber && <p>VAT {invoice.companySnapshot.vatNumber}</p>}
          </div>
        </div>
        <div className="invoice-title-block">
          <h1>INVOICE</h1>
          <dl>
            <div>
              <dt>Invoice No.</dt>
              <dd><bdi>{invoice.invoiceNumber || 'INV-0001'}</bdi></dd>
            </div>
            <div>
              <dt>Issue Date</dt>
              <dd><bdi>{invoice.issueDate || today}</bdi></dd>
            </div>
            <div>
              <dt>Due Date</dt>
              <dd><bdi>{invoice.dueDate || nextDueDate}</bdi></dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><StatusBadge status={invoice.status} /></dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="billing-grid">
        <div>
          <h3>Bill To</h3>
          <strong>{invoice.clientSnapshot.companyName || 'Client company name'}</strong>
          {invoice.clientSnapshot.contactPerson && <p>{invoice.clientSnapshot.contactPerson}</p>}
          <p>{invoice.clientSnapshot.address || 'Client address'}</p>
          {invoice.clientSnapshot.email && <p>{invoice.clientSnapshot.email}</p>}
          {invoice.clientSnapshot.vatNumber && <p>VAT {invoice.clientSnapshot.vatNumber}</p>}
        </div>
        <div className="project-meta">
          <div>
            <span>Currency</span>
            <strong><bdi>{invoice.currency}</bdi></strong>
          </div>
          <div>
            <span>Reference</span>
            <strong><bdi>{paymentReference}</bdi></strong>
          </div>
        </div>
      </section>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>{invoice.vatLabel || 'VAT'}</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.description || 'Service description'}</td>
              <td><bdi>{item.quantity}</bdi></td>
              <td><bdi>{formatCurrency(item.unitPrice, invoice.currency)}</bdi></td>
              <td><bdi>{invoice.vatMode === 'enabled' ? `${item.vatRate}%` : '-'}</bdi></td>
              <td><bdi>{formatCurrency(calculateLineTotal(item), invoice.currency)}</bdi></td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="invoice-summary-block">
        <div className="amount-words">
          <h3>Notes</h3>
          <p>{invoice.notes || 'Thank you for your business.'}</p>
          {vatNote && <p className="muted-note">{vatNote}</p>}
        </div>
        <dl className="totals">
          <div>
            <dt>Subtotal</dt>
            <dd><bdi>{formatCurrency(invoice.subtotal, invoice.currency)}</bdi></dd>
          </div>
          {invoice.discountTotal > 0 && (
            <div>
              <dt>Discount</dt>
              <dd><bdi>-{formatCurrency(invoice.discountTotal, invoice.currency)}</bdi></dd>
            </div>
          )}
          <div>
            <dt>{invoice.vatLabel || 'VAT'}</dt>
            <dd><bdi>{formatCurrency(invoice.vatTotal, invoice.currency)}</bdi></dd>
          </div>
          <div className="total-due">
            <dt>Total Due</dt>
            <dd><bdi>{formatCurrency(invoice.total, invoice.currency)}</bdi></dd>
          </div>
        </dl>
      </section>

      <section className="payment-section">
        <div>
          <h3>Payment Details</h3>
          <dl>
            <div><dt>Bank</dt><dd>{invoice.bankSnapshot.bankName || 'Bank name'}</dd></div>
            <div><dt>Account Name</dt><dd>{invoice.bankSnapshot.accountHolder || 'Account holder'}</dd></div>
            {invoice.bankSnapshot.iban && <div><dt>IBAN</dt><dd><bdi>{invoice.bankSnapshot.iban}</bdi></dd></div>}
            {invoice.bankSnapshot.swiftBic && <div><dt>SWIFT/BIC</dt><dd><bdi>{invoice.bankSnapshot.swiftBic}</bdi></dd></div>}
            {invoice.bankSnapshot.accountNumber && <div><dt>Account No.</dt><dd><bdi>{invoice.bankSnapshot.accountNumber}</bdi></dd></div>}
            {invoice.bankSnapshot.sortCode && <div><dt>Sort Code</dt><dd><bdi>{invoice.bankSnapshot.sortCode}</bdi></dd></div>}
          </dl>
        </div>
        <div>
          <h3>Overseas Transfer</h3>
          <p>{invoice.bankSnapshot.overseasTransferNote}</p>
          <p>{paymentReference}</p>
        </div>
      </section>

      <footer className="invoice-footer">
        <p>Thank you for your business.</p>
        <span>Page 1 of 1</span>
      </footer>
    </article>
  );
}

function AppShell({
  page,
  setPage,
  onSupportClick,
  children,
}: {
  page: Page;
  setPage: (page: Page) => void;
  onSupportClick: () => void;
  children: React.ReactNode;
}) {
  const navItems: { page: Page; icon: string; label: string }[] = [
    { page: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { page: 'invoices', icon: 'receipt_long', label: 'Invoices' },
    { page: 'clients', icon: 'group', label: 'Clients' },
    { page: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const pageTitle = page === 'create' ? 'Create Invoice' : navItems.find((item) => item.page === page)?.label;

  return (
    <div className="app-shell cf-shell" dir="ltr">
      <aside className="sidebar cf-sidebar">
        <div className="brand cf-brand">
          <img className="brand-logo cf-brand-logo" src={invoicerLogoUrl} alt="Invoicer" />
        </div>

        <nav aria-label="Primary navigation" className="cf-nav">
          <div className="nav-group">
            {navItems.map((item) => (
              <button
                key={item.page}
                className={page === item.page ? 'active' : ''}
                onClick={() => setPage(item.page)}
                type="button"
              >
                <span className="material-symbols-rounded">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer cf-sidebar-footer">
          <span>All data stays on this device</span>
        </div>
      </aside>
      <main className={`main-panel cf-main ${page === 'create' ? 'main-panel-create' : ''} ${page === 'settings' ? 'main-panel-settings' : ''}`.trim()}>
        <header className="topbar cf-topbar">
          <div className="topbar-title">
            <h1>{pageTitle}</h1>
            <span>Invoice Manager workspace</span>
          </div>
          <div className="topbar-actions">
            <Button className="topbar-link" icon={<Question size={16} weight="fill" />} onClick={onSupportClick} variant="ghost" type="button">
              Support
            </Button>
          </div>
        </header>
        <div className="cf-content">
          {children}
        </div>
        {page === 'settings' ? (
          <footer className="page-footer settings-footer">
            <div className="footer-actions">
              <Button className="secondary-button" form="settings-form" type="reset" variant="secondary">Restore seed data</Button>
              <Button className="primary-button" form="settings-form" type="submit" variant="primary">Save settings</Button>
            </div>
          </footer>
        ) : null}
      </main>
    </div>
  );
}

function CreateInvoicePage({
  state,
  setState,
  editingInvoice,
  clearEditing,
  notify,
  requestPdf,
  onDirtyChange,
  registerDraftSave,
  onClose,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  editingInvoice: Invoice | null;
  clearEditing: () => void;
  notify: (toast: Omit<Toast, 'id'>) => void;
  requestPdf: (invoice: Invoice) => void;
  onDirtyChange: (dirty: boolean) => void;
  registerDraftSave: (handler: (() => boolean) | null) => void;
  onClose: () => void;
}) {
  const [invoice, setInvoice] = useState<Invoice>(() => editingInvoice ?? createDraftInvoice(state));
  const [selectedClientId, setSelectedClientId] = useState(invoice.clientId);
  const [clientDraft, setClientDraft] = useState<Client>(invoice.clientSnapshot);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [showValidation, setShowValidation] = useState(false);
  const [dragLineId, setDragLineId] = useState<string | null>(null);
  const [savedFingerprint, setSavedFingerprint] = useState('');

  useEffect(() => {
    const nextInvoice = editingInvoice ?? createDraftInvoice(state);
    setInvoice(nextInvoice);
    setSelectedClientId(nextInvoice.clientId);
    setClientDraft(nextInvoice.clientSnapshot);
    setShowValidation(false);
    setSavedFingerprint(JSON.stringify({ invoice: nextInvoice, selectedClientId: nextInvoice.clientId, clientDraft: nextInvoice.clientSnapshot }));
  }, [editingInvoice, state.clients.length]);

  const preparedInvoice = useMemo(
    () =>
      mergeInvoiceTotals({
        ...invoice,
        clientId: selectedClientId,
        clientSnapshot: clientDraft,
        companySnapshot: state.companyProfile,
        bankSnapshot: state.bankDetails,
      }),
    [invoice, selectedClientId, clientDraft, state.companyProfile, state.bankDetails],
  );

  const draftFingerprint = useMemo(
    () => JSON.stringify({ invoice, selectedClientId, clientDraft }),
    [invoice, selectedClientId, clientDraft],
  );
  const hasUnsavedChanges = Boolean(savedFingerprint && draftFingerprint !== savedFingerprint);
  const invoiceNumberDuplicate = state.invoices.some(
    (item) => item.id !== preparedInvoice.id && item.invoiceNumber.trim().toLowerCase() === preparedInvoice.invoiceNumber.trim().toLowerCase(),
  );

  useEffect(() => {
    onDirtyChange(hasUnsavedChanges);
    return () => onDirtyChange(false);
  }, [hasUnsavedChanges, onDirtyChange]);

  function updateInvoice<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    setInvoice((current) => ({ ...current, [key]: value }));
  }

  function updateLine(id: string, patch: Partial<InvoiceLineItem>) {
    setInvoice((current) => ({
      ...current,
      lineItems: current.lineItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function reorderLine(targetId: string) {
    if (!dragLineId || dragLineId === targetId) return;
    setInvoice((current) => {
      const lineItems = [...current.lineItems];
      const fromIndex = lineItems.findIndex((item) => item.id === dragLineId);
      const toIndex = lineItems.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [moved] = lineItems.splice(fromIndex, 1);
      lineItems.splice(toIndex, 0, moved);
      return { ...current, lineItems };
    });
    setDragLineId(null);
  }

  function selectClient(id: string) {
    if (id === 'new') {
      const client = emptyClient();
      setSelectedClientId(client.id);
      setClientDraft(client);
      return;
    }
    const client = state.clients.find((item) => item.id === id);
    if (client) {
      setSelectedClientId(client.id);
      setClientDraft(client);
    }
  }

  function saveClientDraft() {
    if (!clientDraft.companyName.trim()) {
      notify({ kind: 'error', title: 'Client could not be saved', body: 'Client company name is required.' });
      return;
    }
    setState((current) => ({
      ...current,
      clients: current.clients.some((client) => client.id === clientDraft.id)
        ? current.clients.map((client) => (client.id === clientDraft.id ? { ...clientDraft, updatedAt: new Date().toISOString() } : client))
        : [{ ...clientDraft, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current.clients],
    }));
    notify({ kind: 'success', title: 'Client saved successfully' });
  }

  function validateInvoice(candidate: Invoice) {
    if (!candidate.companySnapshot.name.trim()) return 'Company name is required.';
    if (!candidate.clientSnapshot.companyName.trim()) return 'Client name is required.';
    if (!candidate.invoiceNumber.trim()) return 'Invoice number is required.';
    if (invoiceNumberDuplicate) return 'This invoice number already exists. Use a unique invoice number before saving.';
    if (!candidate.issueDate.trim()) return 'Issue date is required.';
    if (!candidate.lineItems.length) return 'At least one service line item is required.';
    if (candidate.lineItems.some((item) => !item.description.trim() || item.unitPrice <= 0)) {
      return 'Every line item needs a description and fee.';
    }
    return '';
  }

  function saveInvoice(status: InvoiceStatus, exportAfterSave = false) {
    const candidate = mergeInvoiceTotals({
      ...preparedInvoice,
      status,
      paidAt: status === 'Paid' ? new Date().toISOString() : preparedInvoice.paidAt,
      updatedAt: new Date().toISOString(),
    });
    const error = validateInvoice(candidate);
    if (error) {
      setShowValidation(true);
      notify({ kind: 'error', title: 'Invoice could not be saved', body: error });
      return false;
    }
    const isExisting = state.invoices.some((item) => item.id === candidate.id);
    setState((current) => ({
      ...current,
      invoices: isExisting ? current.invoices.map((item) => (item.id === candidate.id ? candidate : item)) : [candidate, ...current.invoices],
      invoiceNumberSettings: isExisting
        ? current.invoiceNumberSettings
        : { ...current.invoiceNumberSettings, nextNumber: current.invoiceNumberSettings.nextNumber + 1 },
    }));
    setInvoice(candidate);
    setSelectedClientId(candidate.clientId);
    setClientDraft(candidate.clientSnapshot);
    setSavedFingerprint(JSON.stringify({ invoice: candidate, selectedClientId: candidate.clientId, clientDraft: candidate.clientSnapshot }));
    clearEditing();
    notify({ kind: 'success', title: status === 'Draft' ? 'Invoice saved successfully' : 'Invoice marked as pending' });
    if (exportAfterSave) requestPdf(candidate);
    return true;
  }

  const saveDraftRef = useRef<() => boolean>(() => false);
  saveDraftRef.current = () => saveInvoice('Draft');

  useEffect(() => {
    registerDraftSave(() => saveDraftRef.current());
    return () => registerDraftSave(null);
  }, [registerDraftSave]);

  function exportPreview() {
    const error = validateInvoice(preparedInvoice);
    if (error) {
      setShowValidation(true);
      notify({ kind: 'error', title: 'PDF export failed', body: error });
      return;
    }
    requestPdf(preparedInvoice);
  }

  const invoiceNumberError = invoiceNumberDuplicate
    ? 'This invoice number already exists.'
    : showValidation && !invoice.invoiceNumber.trim()
      ? 'Invoice number is mandatory.'
      : '';
  const issueDateError = showValidation && !invoice.issueDate.trim() ? 'Issue date is mandatory.' : '';
  const clientNameError = showValidation && !clientDraft.companyName.trim() ? 'Client company name is mandatory.' : '';

  return (
    <>
      <section className="create-page">
      {invoiceNumberDuplicate && (
        <div className="create-state-banner">
          <OperationalState kind="duplicate" title="Duplicate invoice number" body="This invoice number is already used by another invoice. Update it before saving or exporting." compact />
        </div>
      )}
      <div className="mobile-switch" role="tablist" aria-label="Create invoice view">
        <button className={mobileTab === 'edit' ? 'selected' : ''} onClick={() => setMobileTab('edit')} type="button">Edit</button>
        <button className={mobileTab === 'preview' ? 'selected' : ''} onClick={() => setMobileTab('preview')} type="button">Preview</button>
      </div>
      <div className={`editor-pane ${mobileTab === 'edit' ? 'show-mobile' : ''}`}>
        <Panel>
          <div className="panel-heading">
            <h2>Invoice details</h2>
          </div>
          <div className="form-grid two">
            <Field label="Invoice number" error={invoiceNumberError}>
              <input placeholder="e.g. INV-2026-0043" value={invoice.invoiceNumber} onChange={(event) => updateInvoice('invoiceNumber', event.target.value)} />
            </Field>
            <Field label="Status">
              <select value={invoice.status} onChange={(event) => updateInvoice('status', event.target.value as InvoiceStatus)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </Field>
            <Field label="Issue date" error={issueDateError}>
              <input type="date" value={invoice.issueDate} onChange={(event) => updateInvoice('issueDate', event.target.value)} />
            </Field>
            <Field label="Due date (optional)">
              <input type="date" value={invoice.dueDate} onChange={(event) => updateInvoice('dueDate', event.target.value)} />
            </Field>
            <Field label="Currency">
              <select value={invoice.currency} onChange={(event) => updateInvoice('currency', event.target.value as CurrencyCode)}>
                {currencies.map((currency) => <option key={currency}>{currency}</option>)}
              </select>
            </Field>
          </div>
        </Panel>

        <Panel>
          <div className="panel-heading row">
            <div>
              <h2>Bill to</h2>
            </div>
            <Button className="text-button" onClick={saveClientDraft} size="sm" type="button" variant="ghost">Save client</Button>
          </div>
          <Field label="Client">
            <select value={state.clients.some((client) => client.id === selectedClientId) ? selectedClientId : 'new'} onChange={(event) => selectClient(event.target.value)}>
              {state.clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
              <option value="new">New client</option>
            </select>
          </Field>
          <div className="form-grid two">
            <Field label="Company name" error={clientNameError}>
              <input placeholder="e.g. Pars Creative Studio" value={clientDraft.companyName} onChange={(event) => setClientDraft({ ...clientDraft, companyName: event.target.value })} />
            </Field>
            <Field label="Contact person">
              <input placeholder="e.g. Nima Farhadi" value={clientDraft.contactPerson} onChange={(event) => setClientDraft({ ...clientDraft, contactPerson: event.target.value })} />
            </Field>
            <Field label="Email">
              <input placeholder="e.g. nima@parscreative.studio" value={clientDraft.email} onChange={(event) => setClientDraft({ ...clientDraft, email: event.target.value })} />
            </Field>
            <Field label="VAT / tax number">
              <input placeholder="e.g. IR14001234567" value={clientDraft.vatNumber} onChange={(event) => setClientDraft({ ...clientDraft, vatNumber: event.target.value })} />
            </Field>
          </div>
          <Field label="Address">
            <textarea placeholder="e.g. Unit 6, Valiasr Street, Tehran, Iran" value={clientDraft.address} onChange={(event) => setClientDraft({ ...clientDraft, address: event.target.value })} />
          </Field>
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2>Line items</h2>
          </div>
          <div className="line-items-editor">
            {invoice.lineItems.map((item, index) => {
              const descriptionError = showValidation && !item.description.trim();
              const priceError = showValidation && item.unitPrice <= 0;
              return (
                <div
                  className={`line-editor-row ${descriptionError || priceError ? 'line-row-error' : ''}`}
                  draggable
                  key={item.id}
                  onDragEnd={() => setDragLineId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDragLineId(item.id)}
                  onDrop={() => reorderLine(item.id)}
                >
                  <button className="drag-handle" aria-label={`Reorder line ${index + 1}`} type="button">
                    <span className="material-symbols-rounded" aria-hidden="true">drag_indicator</span>
                  </button>
                  <span className="line-number">{index + 1}</span>
                  <label className="line-control line-description">
                    <span>Description</span>
                    <input placeholder="e.g. Website redesign" value={item.description} onChange={(event) => updateLine(item.id, { description: event.target.value })} />
                  </label>
                  <label className="line-control line-qty">
                    <span>Qty</span>
                    <input type="number" min="0" placeholder="1" value={item.quantity} onChange={(event) => updateLine(item.id, { quantity: Number(event.target.value) })} />
                  </label>
                  <label className="line-control line-unit-price">
                    <span>Unit price</span>
                    <input type="number" min="0" placeholder="500" value={item.unitPrice} onChange={(event) => updateLine(item.id, { unitPrice: Number(event.target.value) })} />
                  </label>
                  <label className="line-control line-vat">
                    <span>VAT %</span>
                    <input type="number" min="0" placeholder="23" value={item.vatRate} onChange={(event) => updateLine(item.id, { vatRate: Number(event.target.value) })} />
                  </label>
                  <label className="line-control line-discount">
                    <span>Discount</span>
                    <input type="number" min="0" placeholder="0" value={item.discount} onChange={(event) => updateLine(item.id, { discount: Number(event.target.value) })} />
                  </label>
                  <div className="line-total">
                    <span>Total</span>
                    <strong><bdi>{formatCurrency(calculateLineTotal(item), invoice.currency)}</bdi></strong>
                  </div>
                  <Button
                    aria-label="Remove line"
                    className="danger"
                    disabled={invoice.lineItems.length === 1}
                    icon={Trash}
                    onClick={() => setInvoice((current) => ({ ...current, lineItems: current.lineItems.filter((line) => line.id !== item.id) }))}
                    shape="square"
                    size="sm"
                    type="button"
                    variant="ghost"
                  />
                  {(descriptionError || priceError) && <p className="line-error-caption">Description and unit price are mandatory.</p>}
                </div>
              );
            })}
          </div>
          <Button className="tertiary-button add-line-button" icon={Plus} onClick={() => setInvoice((current) => ({ ...current, lineItems: [...current.lineItems, emptyLine(state.vatSettings.defaultRate)] }))} type="button" variant="ghost">
            Add line
          </Button>
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2>VAT and notes</h2>
          </div>
          <div className="form-grid three">
            <Field label="VAT mode">
              <select value={invoice.vatMode} onChange={(event) => updateInvoice('vatMode', event.target.value as VatMode)}>
                {vatModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </Field>
            <Field label="VAT label">
              <input value={invoice.vatLabel} onChange={(event) => updateInvoice('vatLabel', event.target.value)} />
            </Field>
            <Field label="VAT number display">
              <input value={invoice.vatNumberDisplay} onChange={(event) => updateInvoice('vatNumberDisplay', event.target.value)} />
            </Field>
          </div>
          <Field label="Invoice notes">
            <textarea value={invoice.notes} onChange={(event) => updateInvoice('notes', event.target.value)} />
          </Field>
        </Panel>

      </div>

      <LayerCard className={`preview-pane ${mobileTab === 'preview' ? 'show-mobile' : ''}`}>
        <LayerCard.Secondary className="preview-toolbar">
          <span>Live preview</span>
          <div className="preview-toolbar-actions">
            <StatusBadge status={preparedInvoice.status} />
            <Tabs
              className="orientation-tabs"
              onValueChange={(value) => updateInvoice('orientation', value as InvoiceOrientation)}
              size="sm"
              tabs={[
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
              ]}
              value={invoice.orientation}
              variant="segmented"
            />
          </div>
        </LayerCard.Secondary>
        <LayerCard.Primary className="preview-sheet">
          <div className={`document-scale-frame ${preparedInvoice.orientation}`}>
            <InvoiceTemplate invoice={preparedInvoice} />
          </div>
        </LayerCard.Primary>
      </LayerCard>
      </section>
      <div className="sticky-actions">
        <dl className="mini-total">
          <div><dt>VAT</dt><dd>{formatCurrency(preparedInvoice.vatTotal, preparedInvoice.currency)}</dd></div>
          <div><dt>Total</dt><dd>{formatCurrency(preparedInvoice.total, preparedInvoice.currency)}</dd></div>
        </dl>
        <div className="footer-actions">
          <Button className="secondary-button" onClick={onClose} type="button" variant="secondary">Close</Button>
          <Button className="secondary-button" icon={FloppyDisk} onClick={() => saveInvoice('Draft')} type="button" variant="secondary">Save Draft</Button>
          <Button className="secondary-button" icon={FilePdf} onClick={exportPreview} type="button" variant="secondary">Preview PDF</Button>
          <Button className="primary-button" icon={DownloadSimple} onClick={() => saveInvoice('Pending', true)} type="button" variant="primary">Save and Export PDF</Button>
        </div>
      </div>
    </>
  );
}

function DashboardPage({
  state,
  setState,
  editInvoice,
  createInvoice,
  createClient,
  requestPdf,
  requestPrint,
  showRecentClients = true,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  editInvoice: (invoice: Invoice) => void;
  createInvoice: () => void;
  createClient: () => void;
  requestPdf: (invoice: Invoice) => void;
  requestPrint: (invoice: Invoice) => void;
  showRecentClients?: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [query, setQuery] = useState('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState<MenuPosition | null>(null);
  const [invoicePendingDelete, setInvoicePendingDelete] = useState<Invoice | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuOverlayRef = useRef<HTMLDivElement>(null);
  const actionMenuButtonRef = useRef<HTMLButtonElement>(null);

  const filteredInvoices = state.invoices.filter((invoice) => {
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    const searchable = `${invoice.invoiceNumber} ${invoice.clientSnapshot.companyName}`.toLowerCase();
    return matchesStatus && searchable.includes(query.toLowerCase());
  });

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        actionMenuRef.current
        && !actionMenuRef.current.contains(target)
        && !actionMenuOverlayRef.current?.contains(target)
      ) {
        setOpenActionMenuId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenActionMenuId(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (openActionMenuId && actionMenuButtonRef.current) {
      const menu = actionMenuOverlayRef.current;
      setActionMenuPosition(getOverlayPosition(actionMenuButtonRef.current, menu?.offsetWidth ?? 218, menu?.offsetHeight ?? 300));
    } else {
      setActionMenuPosition(null);
    }

  }, [openActionMenuId, filteredInvoices.length, statusFilter]);

  useEffect(() => {
    if (!openActionMenuId) return undefined;

    function handleViewportChange() {
      if (openActionMenuId && actionMenuButtonRef.current) {
        const menu = actionMenuOverlayRef.current;
        setActionMenuPosition(getOverlayPosition(actionMenuButtonRef.current, menu?.offsetWidth ?? 218, menu?.offsetHeight ?? 300));
      }
    }

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [openActionMenuId]);

  const counts = statuses.reduce(
    (acc, status) => ({ ...acc, [status]: state.invoices.filter((invoice) => invoice.status === status).length }),
    {} as Record<InvoiceStatus, number>,
  );

  const emptyState = getInvoiceEmptyState(statusFilter, query);
  const hasInvoices = state.invoices.length > 0;
  const dashboardEmptyState = hasInvoices
    ? emptyState
    : {
        title: "You don't have any invoices yet",
        body: 'Create your first invoice to start tracking payments locally.',
      };
  const duplicateInvoiceNumbers = findDuplicateValues(state.invoices.map((invoice) => invoice.invoiceNumber));

  function markStatus(invoice: Invoice, status: InvoiceStatus) {
    if (invoice.status === status) {
      setOpenActionMenuId(null);
      return;
    }

    setState((current) => ({
      ...current,
      invoices: current.invoices.map((item) =>
        item.id === invoice.id
          ? { ...item, status, paidAt: status === 'Paid' ? new Date().toISOString() : item.paidAt, updatedAt: new Date().toISOString() }
          : item,
      ),
    }));
    setOpenActionMenuId(null);
  }

  function duplicateInvoice(invoice: Invoice) {
    const copy: Invoice = {
      ...invoice,
      id: uid('invoice'),
      invoiceNumber: buildInvoiceNumber(state.invoiceNumberSettings),
      status: 'Draft',
      paidAt: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      invoices: [copy, ...current.invoices],
      invoiceNumberSettings: { ...current.invoiceNumberSettings, nextNumber: current.invoiceNumberSettings.nextNumber + 1 },
    }));
    setOpenActionMenuId(null);
  }

  function deleteInvoice(id: string) {
    setState((current) => ({
      ...current,
      invoices: current.invoices.filter((invoice) => invoice.id !== id),
    }));
    setInvoicePendingDelete(null);
    setOpenActionMenuId(null);
  }

  return (
    <section className="dashboard-page">
      {duplicateInvoiceNumbers.size > 0 && (
        <OperationalState
          kind="duplicate"
          title="Duplicate invoice numbers detected"
          body="One or more invoice numbers appear more than once. Open the affected invoices and assign unique numbers before sending them."
          compact
        />
      )}
      <div className="summary-grid">
        {statuses.map((status) => (
          <LayerCard
            className={`summary-card summary-${status.toLowerCase()} ${statusFilter === status ? 'selected' : ''}`}
            key={status}
            onClick={() => setStatusFilter(status)}
            render={<button type="button" />}
          >
            <span>{status}</span>
            <strong>{counts[status]}</strong>
          </LayerCard>
        ))}
      </div>

      <section className="cloudflare-grid-section dashboard-table-panel">
        {hasInvoices ? (
          <div className="cloudflare-grid-toolbar">
            <InputGroup className="cloudflare-grid-search" size="base">
              <InputGroup.Addon>
                <MagnifyingGlass size={16} />
              </InputGroup.Addon>
              <InputGroup.Input aria-label="Search invoices" placeholder="Search invoices..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </InputGroup>
            <div className="invoice-toolbar-actions">
              <Select
                aria-label="Filter invoices by status"
                className="status-select"
                value={statusFilter}
                renderValue={(value) => String(value) === 'All' ? 'All Status' : String(value)}
                onValueChange={(value) => setStatusFilter(String(value) as StatusFilter)}
              >
                {statusFilterOptions.map((option) => (
                  <Select.Option key={option} value={option}>{option === 'All' ? 'All Status' : option}</Select.Option>
                ))}
              </Select>
              <Button className="primary-button" icon={Plus} onClick={createInvoice} type="button" variant="primary">
                Create invoice
              </Button>
            </div>
          </div>
        ) : null}
        {filteredInvoices.length ? (
          <>
          <div className="cloudflare-data-grid">
            <Table className="cloudflare-table" layout="fixed">
              <colgroup>
                <col className="invoice-number-column" />
                <col className="client-column" />
                <col className="date-column" />
                <col className="date-column" />
                <col className="amount-column" />
                <col className="status-column" />
                <col className="actions-column" />
              </colgroup>
              <Table.Header variant="compact" sticky>
                <Table.Row>
                  <Table.Head>Invoice No.</Table.Head>
                  <Table.Head>Client</Table.Head>
                  <Table.Head>Issue Date</Table.Head>
                  <Table.Head>Due Date</Table.Head>
                  <Table.Head>Total</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredInvoices.map((invoice) => (
                  <Table.Row key={invoice.id}>
                    <Table.Cell title={invoice.invoiceNumber}>
                      <span className="invoice-number-cell">
                        <bdi>{invoice.invoiceNumber}</bdi>
                        {duplicateInvoiceNumbers.has(invoice.invoiceNumber.trim().toLowerCase()) && (
                          <span className="material-symbols-rounded duplicate-indicator" title="Duplicate invoice number" aria-label="Duplicate invoice number">content_copy</span>
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell title={invoice.clientSnapshot.companyName}>{invoice.clientSnapshot.companyName}</Table.Cell>
                    <Table.Cell><bdi>{invoice.issueDate}</bdi></Table.Cell>
                    <Table.Cell><bdi>{invoice.dueDate}</bdi></Table.Cell>
                    <Table.Cell><bdi>{formatCurrency(invoice.total, invoice.currency)}</bdi></Table.Cell>
                    <Table.Cell><StatusBadge status={invoice.status} /></Table.Cell>
                    <Table.Cell>
                      <div className="table-actions">
                        <Button
                          aria-label={`Edit ${invoice.invoiceNumber}`}
                          icon={PencilSimple}
                          onClick={() => editInvoice(invoice)}
                          shape="square"
                          size="sm"
                          title="Edit"
                          type="button"
                          variant="ghost"
                        />
                        <Button
                          aria-label={`Delete ${invoice.invoiceNumber}`}
                          className="danger"
                          icon={Trash}
                          onClick={() => setInvoicePendingDelete(invoice)}
                          shape="square"
                          size="sm"
                          title="Delete"
                          type="button"
                          variant="ghost"
                        />
                        <div className="action-menu-anchor" ref={openActionMenuId === invoice.id ? actionMenuRef : null}>
                          <Button
                            aria-expanded={openActionMenuId === invoice.id}
                            aria-haspopup="menu"
                            aria-label={`More actions for ${invoice.invoiceNumber}`}
                            icon={DotsThree}
                            shape="square"
                            size="sm"
                            title="More"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenActionMenuId((current) => (current === invoice.id ? null : invoice.id));
                            }}
                            ref={openActionMenuId === invoice.id ? actionMenuButtonRef : null}
                            type="button"
                            variant="ghost"
                          />
                          {openActionMenuId === invoice.id && createPortal(
                            <div className="action-menu" ref={actionMenuOverlayRef} role="menu" style={menuStyle(actionMenuPosition)}>
                              <div className="action-menu-heading">Status</div>
                              {statuses.map((status) => {
                                const active = status === invoice.status;
                                return (
                                  <button
                                    aria-current={active ? 'true' : undefined}
                                    className={active ? 'selected-menu-item' : ''}
                                    key={status}
                                    onClick={() => markStatus(invoice, status)}
                                    role="menuitem"
                                    type="button"
                                  >
                                    <span>{status}</span>
                                    {active ? <span className="menu-check material-symbols-rounded" aria-hidden="true">check</span> : null}
                                  </button>
                                );
                              })}
                              <div className="action-menu-separator" />
                              <button onClick={() => duplicateInvoice(invoice)} role="menuitem" type="button">
                                Duplicate invoice
                              </button>
                              <button onClick={() => { setOpenActionMenuId(null); requestPdf(invoice); }} role="menuitem" type="button">
                                Download as PDF
                              </button>
                              <button onClick={() => { setOpenActionMenuId(null); requestPrint(invoice); }} role="menuitem" type="button">
                                Print
                              </button>
                            </div>,
                            document.body,
                          )}
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="cloudflare-grid-footer">
            <span>Showing 1 - {filteredInvoices.length} of {filteredInvoices.length}</span>
          </div>
          </>
        ) : (
          <DashboardTableEmptyState
            title={dashboardEmptyState.title}
            body={dashboardEmptyState.body}
            action={<Button className="secondary-button" icon={Plus} onClick={createInvoice} type="button" variant="secondary">Create invoice</Button>}
          />
        )}
      </section>

      {showRecentClients ? (
        <div className="dashboard-lower-grid">
          <Panel>
            <div className="panel-heading row recent-clients-heading">
              <h2>Recent clients</h2>
              {state.clients.length ? (
                <Button
                  aria-label="Add client"
                  className="secondary-button recent-clients-add-button"
                  icon={Plus}
                  onClick={createClient}
                  shape="square"
                  size="sm"
                  title="Add client"
                  type="button"
                  variant="secondary"
                />
              ) : null}
            </div>
            {state.clients.length ? (
              <div className="mini-list">
                {state.clients.slice(0, 5).map((client) => (
                  <div key={client.id}>
                    <span>{client.companyName}</span>
                    <strong>{state.invoices.filter((invoice) => invoice.clientId === client.id).length} invoices</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="recent-clients-empty-state">
                <Receipt className="dashboard-empty-icon" size={34} weight="duotone" />
                <h2>No recent clients yet</h2>
                <p>Add a client to see recent activity here.</p>
                <div className="dashboard-empty-action">
                  <Button className="secondary-button" icon={Plus} onClick={createClient} type="button" variant="secondary">
                    Add client
                  </Button>
                </div>
              </div>
            )}
          </Panel>
        </div>
      ) : null}
      <ConfirmationModal
        opened={Boolean(invoicePendingDelete)}
        title="Delete invoice?"
        body={invoicePendingDelete ? `This will remove ${invoicePendingDelete.invoiceNumber} from local storage. This action cannot be undone.` : ''}
        confirmLabel="Delete invoice"
        danger
        onCancel={() => setInvoicePendingDelete(null)}
        onConfirm={() => invoicePendingDelete && deleteInvoice(invoicePendingDelete.id)}
      />
    </section>
  );
}

function ClientsPage({
  state,
  setState,
  notify,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  notify: (toast: Omit<Toast, 'id'>) => void;
}) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Client>(emptyClient());
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailRows, setEmailRows] = useState([{ id: uid('email'), type: 'Work', value: '' }]);
  const [phoneRows, setPhoneRows] = useState<PhoneRow[]>([createPhoneRow()]);
  const [clientPendingDelete, setClientPendingDelete] = useState<Client | null>(null);
  const filtered = state.clients.filter((client) => `${client.companyName} ${client.contactPerson} ${client.email} ${client.phone} ${client.phoneNumber || ''} ${client.callingCode || ''} ${client.countryName || client.country || ''} ${client.countryIso2 || ''} ${client.website || ''}`.toLowerCase().includes(query.toLowerCase()));
  const editingExisting = state.clients.some((client) => client.id === draft.id);
  const duplicateClientNames = findDuplicateValues(state.clients.map((client) => client.companyName));

  function openAddClientModal() {
    setDraft(emptyClient());
    setEmailRows([{ id: uid('email'), type: 'Work', value: '' }]);
    setPhoneRows([createPhoneRow()]);
    setFormSubmitted(false);
    setModalOpen(true);
  }

  function openEditClientModal(client: Client) {
    setDraft(client);
    setEmailRows([{ id: uid('email'), type: 'Work', value: client.email }]);
    setPhoneRows([phoneRowFromClient(client)]);
    setFormSubmitted(false);
    setModalOpen(true);
  }

  function closeClientModal() {
    setModalOpen(false);
    setFormSubmitted(false);
  }

  function saveClient(mode: 'close' | 'new') {
    setFormSubmitted(true);
    if (!draft.companyName.trim() || !draft.contactPerson.trim()) {
      notify({ kind: 'error', title: 'Client could not be saved', body: 'Company name and contact person are mandatory.' });
      return;
    }
    const primaryEmail = emailRows.find((row) => row.value.trim())?.value.trim() || '';
    const primaryPhoneRow = phoneRows.find((row) => row.value.trim());
    const hasSelectedCountry = Boolean(draft.countryIso2 || draft.countryName || draft.country);
    const selectedCountry = hasSelectedCountry ? findClientCountry(draft) : null;
    const primaryPhoneCountry = primaryPhoneRow ? findPhoneCountry(primaryPhoneRow) : (selectedCountry ?? defaultCountry);
    const primaryCallingCode = primaryPhoneRow?.callingCode || primaryPhoneCountry.callingCode;
    const primaryPhoneNumber = primaryPhoneRow?.value.trim() || '';
    const primaryPhone = primaryPhoneNumber ? `${primaryCallingCode} ${primaryPhoneNumber}`.trim() : '';
    const nextClient = {
      ...draft,
      email: primaryEmail,
      phone: primaryPhone,
      countryIso2: selectedCountry?.iso2 || '',
      countryName: selectedCountry?.name || '',
      callingCode: primaryCallingCode,
      phoneNumber: primaryPhoneNumber,
      country: selectedCountry?.name || '',
      updatedAt: new Date().toISOString(),
    };
    setState((current) => ({
      ...current,
      clients: current.clients.some((client) => client.id === nextClient.id)
        ? current.clients.map((client) => (client.id === nextClient.id ? nextClient : client))
        : [{ ...nextClient, createdAt: new Date().toISOString() }, ...current.clients],
    }));
    notify({ kind: 'success', title: editingExisting ? 'Client updated successfully' : 'Client added successfully' });
    if (mode === 'new') {
      setDraft(emptyClient());
      setEmailRows([{ id: uid('email'), type: 'Work', value: '' }]);
      setPhoneRows([createPhoneRow()]);
      setFormSubmitted(false);
      return;
    }
    closeClientModal();
  }

  function deleteClient(id: string) {
    setState((current) => ({ ...current, clients: current.clients.filter((client) => client.id !== id) }));
    setClientPendingDelete(null);
    notify({ kind: 'success', title: 'Client removed successfully' });
  }

  function updateEmailRow(id: string, patch: Partial<{ type: string; value: string }>) {
    setEmailRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function updatePhoneRow(id: string, patch: Partial<PhoneRow>) {
    setPhoneRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  return (
    <section className="clients-page">
      {duplicateClientNames.size > 0 && (
        <OperationalState kind="duplicate" title="Duplicate client names detected" body="Some company names are repeated. Review the client table before creating new invoices." compact />
      )}
      <section className="cloudflare-grid-section clients-grid-section">
        <div className="cloudflare-grid-toolbar">
          <InputGroup className="cloudflare-grid-search clients-search" size="base">
            <InputGroup.Addon>
              <MagnifyingGlass size={16} />
            </InputGroup.Addon>
            <InputGroup.Input aria-label="Search clients" placeholder="Search by company, contact, email, or phone" value={query} onChange={(event) => setQuery(event.target.value)} />
          </InputGroup>
          <div className="clients-page-actions">
            <Button className="primary-button" icon={Plus} onClick={openAddClientModal} type="button" variant="primary">
              Add client
            </Button>
          </div>
        </div>
        {filtered.length ? (
          <>
          <div className="cloudflare-data-grid">
            <Table className="cloudflare-table clients-table" layout="fixed">
              <colgroup>
                <col className="client-company-column" />
                <col className="client-contact-column" />
                <col className="client-email-column" />
                <col className="client-phone-column" />
                <col className="client-website-column" />
                <col className="client-country-column" />
                <col className="client-vat-column" />
                <col className="client-actions-column" />
              </colgroup>
              <Table.Header variant="compact">
                <Table.Row>
                  <Table.Head>Company name</Table.Head>
                  <Table.Head>Contact person</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Phone</Table.Head>
                  <Table.Head>Company website</Table.Head>
                  <Table.Head>Country</Table.Head>
                  <Table.Head>VAT number</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filtered.map((client) => (
                  <Table.Row key={client.id}>
                    <Table.Cell title={client.companyName}>
                      <span className="invoice-number-cell">
                        <span className="cell-truncate">{client.companyName}</span>
                        {duplicateClientNames.has(client.companyName.trim().toLowerCase()) && (
                          <span className="material-symbols-rounded duplicate-indicator" title="Duplicate client name" aria-label="Duplicate client name">content_copy</span>
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell title={client.contactPerson}>{client.contactPerson || '-'}</Table.Cell>
                    <Table.Cell title={client.email}>{client.email || '-'}</Table.Cell>
                    <Table.Cell title={client.phone}>{client.phone || '-'}</Table.Cell>
                    <Table.Cell title={client.website || ''}>{client.website || '-'}</Table.Cell>
                    <Table.Cell>{client.countryName || client.country || '-'}</Table.Cell>
                    <Table.Cell>{client.vatNumber || '-'}</Table.Cell>
                    <Table.Cell>
                      <div className="table-actions">
                        <Button
                          aria-label={`Edit ${client.companyName}`}
                          icon={PencilSimple}
                          onClick={() => openEditClientModal(client)}
                          shape="square"
                          size="sm"
                          type="button"
                          variant="ghost"
                        />
                        <Button
                          aria-label={`Delete ${client.companyName}`}
                          className="danger"
                          icon={Trash}
                          onClick={() => setClientPendingDelete(client)}
                          shape="square"
                          size="sm"
                          type="button"
                          variant="ghost"
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="cloudflare-grid-footer">
            <span>Showing 1 - {filtered.length} of {filtered.length}</span>
          </div>
          </>
        ) : (
          <EmptyState title="No clients yet" body="Add your first client to reuse their details in future invoices." />
        )}
      </section>

      <ConfirmationModal
        opened={Boolean(clientPendingDelete)}
        title="Delete client?"
        body={clientPendingDelete ? `This will remove ${clientPendingDelete.companyName} from the local client list. Existing invoice snapshots will stay unchanged.` : ''}
        confirmLabel="Delete client"
        danger
        onCancel={() => setClientPendingDelete(null)}
        onConfirm={() => clientPendingDelete && deleteClient(clientPendingDelete.id)}
      />

      <Dialog.Root disablePointerDismissal open={modalOpen} onOpenChange={(nextOpen) => { if (!nextOpen) closeClientModal(); }}>
        <Dialog className="client-modal" size="xl">
          <LayerCard className="client-modal-card">
            <LayerCard.Secondary className="modal-header">
              <Dialog.Title>{editingExisting ? 'Edit client' : 'Add client'}</Dialog.Title>
            </LayerCard.Secondary>
            <LayerCard.Primary className="modal-body">
              <div className="form-grid two">
                <Field label="Company name *" error={formSubmitted && !draft.companyName.trim() ? 'Company name is mandatory.' : ''}>
                  <input placeholder="e.g. Pars Creative Studio" value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} />
                </Field>
                <Field label="Contact person *" error={formSubmitted && !draft.contactPerson.trim() ? 'Contact person is mandatory.' : ''}>
                  <input placeholder="e.g. Nima Farhadi" value={draft.contactPerson} onChange={(event) => setDraft({ ...draft, contactPerson: event.target.value })} />
                </Field>
                <Field label="Company website">
                  <input placeholder="https://www.example.com" value={draft.website || ''} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
                </Field>
                <div className="field-shell">
                  <span className="field-label">Country</span>
                  <Combobox
                    items={countryNameOptions}
                    value={(draft.countryIso2 || draft.countryName || draft.country) ? countryNameOptionFromCountry(findClientCountry(draft)) : null}
                    onValueChange={(value) => {
                      const selected = resolveCountryOption(value);
                      setDraft({
                        ...draft,
                        countryIso2: selected?.iso2 || '',
                        countryName: selected?.name || '',
                        country: selected?.name || '',
                      });
                    }}
                  >
                    <Combobox.TriggerValue className="app-field-control" placeholder="Select country" />
                    <Combobox.Content className="combobox-search-menu">
                      <div className="combobox-search-input-wrap">
                        <Combobox.Input placeholder="Search countries" />
                      </div>
                      <Combobox.Empty>No countries found.</Combobox.Empty>
                      <Combobox.List>
                        {(country: CountryOption) => (
                          <Combobox.Item key={country.iso2} value={country}>
                            <span className="country-name-option">{country.name}</span>
                            <span className="sr-only">{country.searchText}</span>
                          </Combobox.Item>
                        )}
                      </Combobox.List>
                    </Combobox.Content>
                  </Combobox>
                </div>
                <Field label="VAT number"><input placeholder="e.g. IR14001234567" value={draft.vatNumber} onChange={(event) => setDraft({ ...draft, vatNumber: event.target.value })} /></Field>
                <Field label="Address"><input placeholder="e.g. Unit 6, Valiasr Street, Tehran" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></Field>
              </div>

              <div className="contact-options-section">
                <div className="panel-heading row compact-heading">
                  <div><h3>Email options</h3></div>
                </div>
                {emailRows.map((row) => (
                  <div className="contact-option-row" key={row.id}>
                    <Select aria-label="Email label" className="contact-label-select" value={row.type} onValueChange={(value) => updateEmailRow(row.id, { type: String(value) })}>
                      {emailTypes.map((type) => <Select.Option key={type} value={type}>{type}</Select.Option>)}
                    </Select>
                    <Input aria-label="Email address" placeholder="name@example.com" value={row.value} onChange={(event) => updateEmailRow(row.id, { value: event.target.value })} />
                    <Button
                      aria-label="Remove email"
                      className="danger"
                      disabled={emailRows.length === 1}
                      icon={Trash}
                      onClick={() => setEmailRows((current) => current.filter((item) => item.id !== row.id))}
                      shape="square"
                      size="sm"
                      type="button"
                      variant="ghost"
                    />
                  </div>
                ))}
                <Button className="tertiary-button contact-add-button" icon={Plus} onClick={() => setEmailRows((current) => [...current, { id: uid('email'), type: 'Work', value: '' }])} type="button" variant="ghost">
                  Add another
                </Button>
              </div>

              <div className="contact-options-section">
                <div className="panel-heading row compact-heading">
                  <div><h3>Phone options</h3></div>
                </div>
                {phoneRows.map((row) => (
                  <div className="contact-option-row phone-option-row" key={row.id}>
                    <Select aria-label="Phone label" className="contact-label-select" value={row.type} onValueChange={(value) => updatePhoneRow(row.id, { type: String(value) })}>
                      {phoneTypes.map((type) => <Select.Option key={type} value={type}>{type}</Select.Option>)}
                    </Select>
                    <Combobox
                      items={countryOptions}
                      value={countryOptionFromCountry(findPhoneCountry(row))}
                      onValueChange={(value) => {
                        const selected = resolveCountryOption(value) ?? countryOptionFromCountry(defaultCountry);
                        if (!selected) return;
                        updatePhoneRow(row.id, {
                          countryIso2: selected.iso2,
                          countryName: selected.name,
                          callingCode: selected.callingCode,
                        });
                      }}
                    >
                      <Combobox.TriggerValue aria-label="Country calling code" className="contact-country-select" />
                      <Combobox.Content className="combobox-search-menu contact-country-menu">
                        <div className="combobox-search-input-wrap">
                          <Combobox.Input placeholder="Search countries or codes" />
                        </div>
                        <Combobox.Empty>No countries found.</Combobox.Empty>
                        <Combobox.List>
                          {(country: CountryOption) => (
                            <Combobox.Item key={country.iso2} value={country}>
                              <span className="country-option-row">
                                <span>{country.name}</span>
                                <span>{country.callingCode}</span>
                              </span>
                              <span className="sr-only">{country.searchText}</span>
                            </Combobox.Item>
                          )}
                        </Combobox.List>
                      </Combobox.Content>
                    </Combobox>
                    <Input aria-label="Phone number" placeholder="123-456-7890" value={row.value} onChange={(event) => updatePhoneRow(row.id, { value: event.target.value })} />
                    <Button
                      aria-label="Remove phone"
                      className="danger"
                      disabled={phoneRows.length === 1}
                      icon={Trash}
                      onClick={() => setPhoneRows((current) => current.filter((item) => item.id !== row.id))}
                      shape="square"
                      size="sm"
                      type="button"
                      variant="ghost"
                    />
                  </div>
                ))}
                <Button className="tertiary-button contact-add-button" icon={Plus} onClick={() => setPhoneRows((current) => [...current, createPhoneRow()])} type="button" variant="ghost">
                  Add another
                </Button>
              </div>

              <Field label="Notes"><textarea placeholder="Optional internal notes about this client" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
            </LayerCard.Primary>
            <LayerCard.Secondary className="modal-footer">
              <Button className="secondary-button" onClick={closeClientModal} type="button" variant="secondary">Close</Button>
              <Button className="secondary-button" onClick={() => saveClient('new')} type="button" variant="secondary">Save and add another</Button>
              <Button className="primary-button" onClick={() => saveClient('close')} type="button" variant="primary">Save Client</Button>
            </LayerCard.Secondary>
          </LayerCard>
        </Dialog>
      </Dialog.Root>
    </section>
  );
}

function AddClientModal({
  opened,
  onClose,
  setState,
  notify,
}: {
  opened: boolean;
  onClose: () => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  notify: (toast: Omit<Toast, 'id'>) => void;
}) {
  const [draft, setDraft] = useState<Client>(emptyClient());
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailRows, setEmailRows] = useState([{ id: uid('email'), type: 'Work', value: '' }]);
  const [phoneRows, setPhoneRows] = useState<PhoneRow[]>([createPhoneRow()]);

  useEffect(() => {
    if (!opened) return;
    setDraft(emptyClient());
    setEmailRows([{ id: uid('email'), type: 'Work', value: '' }]);
    setPhoneRows([createPhoneRow()]);
    setFormSubmitted(false);
  }, [opened]);

  function closeClientModal() {
    setFormSubmitted(false);
    onClose();
  }

  function updateEmailRow(id: string, patch: Partial<{ type: string; value: string }>) {
    setEmailRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function updatePhoneRow(id: string, patch: Partial<PhoneRow>) {
    setPhoneRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function saveClient(mode: 'close' | 'new') {
    setFormSubmitted(true);
    if (!draft.companyName.trim() || !draft.contactPerson.trim()) {
      notify({ kind: 'error', title: 'Client could not be saved', body: 'Company name and contact person are mandatory.' });
      return;
    }
    const primaryEmail = emailRows.find((row) => row.value.trim())?.value.trim() || '';
    const primaryPhoneRow = phoneRows.find((row) => row.value.trim());
    const hasSelectedCountry = Boolean(draft.countryIso2 || draft.countryName || draft.country);
    const selectedCountry = hasSelectedCountry ? findClientCountry(draft) : null;
    const primaryPhoneCountry = primaryPhoneRow ? findPhoneCountry(primaryPhoneRow) : (selectedCountry ?? defaultCountry);
    const primaryCallingCode = primaryPhoneRow?.callingCode || primaryPhoneCountry.callingCode;
    const primaryPhoneNumber = primaryPhoneRow?.value.trim() || '';
    const primaryPhone = primaryPhoneNumber ? `${primaryCallingCode} ${primaryPhoneNumber}`.trim() : '';
    const stamp = new Date().toISOString();
    const nextClient = {
      ...draft,
      email: primaryEmail,
      phone: primaryPhone,
      countryIso2: selectedCountry?.iso2 || '',
      countryName: selectedCountry?.name || '',
      callingCode: primaryCallingCode,
      phoneNumber: primaryPhoneNumber,
      country: selectedCountry?.name || '',
      createdAt: stamp,
      updatedAt: stamp,
    };
    setState((current) => ({
      ...current,
      clients: [nextClient, ...current.clients],
    }));
    notify({ kind: 'success', title: 'Client added successfully' });
    if (mode === 'new') {
      setDraft(emptyClient());
      setEmailRows([{ id: uid('email'), type: 'Work', value: '' }]);
      setPhoneRows([createPhoneRow()]);
      setFormSubmitted(false);
      return;
    }
    closeClientModal();
  }

  return (
    <Dialog.Root disablePointerDismissal open={opened} onOpenChange={(nextOpen) => { if (!nextOpen) closeClientModal(); }}>
      <Dialog className="client-modal" size="xl">
        <LayerCard className="client-modal-card">
          <LayerCard.Secondary className="modal-header">
            <Dialog.Title>Add client</Dialog.Title>
          </LayerCard.Secondary>
          <LayerCard.Primary className="modal-body">
            <div className="form-grid two">
              <Field label="Company name *" error={formSubmitted && !draft.companyName.trim() ? 'Company name is mandatory.' : ''}>
                <input placeholder="e.g. Pars Creative Studio" value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} />
              </Field>
              <Field label="Contact person *" error={formSubmitted && !draft.contactPerson.trim() ? 'Contact person is mandatory.' : ''}>
                <input placeholder="e.g. Nima Farhadi" value={draft.contactPerson} onChange={(event) => setDraft({ ...draft, contactPerson: event.target.value })} />
              </Field>
              <Field label="Company website">
                <input placeholder="https://www.example.com" value={draft.website || ''} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
              </Field>
              <div className="field-shell">
                <span className="field-label">Country</span>
                <Combobox
                  items={countryNameOptions}
                  value={(draft.countryIso2 || draft.countryName || draft.country) ? countryNameOptionFromCountry(findClientCountry(draft)) : null}
                  onValueChange={(value) => {
                    const selected = resolveCountryOption(value);
                    setDraft({
                      ...draft,
                      countryIso2: selected?.iso2 || '',
                      countryName: selected?.name || '',
                      country: selected?.name || '',
                    });
                  }}
                >
                  <Combobox.TriggerValue className="app-field-control" placeholder="Select country" />
                  <Combobox.Content className="combobox-search-menu">
                    <div className="combobox-search-input-wrap">
                      <Combobox.Input placeholder="Search countries" />
                    </div>
                    <Combobox.Empty>No countries found.</Combobox.Empty>
                    <Combobox.List>
                      {(country: CountryOption) => (
                        <Combobox.Item key={country.iso2} value={country}>
                          <span className="country-name-option">{country.name}</span>
                          <span className="sr-only">{country.searchText}</span>
                        </Combobox.Item>
                      )}
                    </Combobox.List>
                  </Combobox.Content>
                </Combobox>
              </div>
              <Field label="VAT number"><input placeholder="e.g. IR14001234567" value={draft.vatNumber} onChange={(event) => setDraft({ ...draft, vatNumber: event.target.value })} /></Field>
              <Field label="Address"><input placeholder="e.g. Unit 6, Valiasr Street, Tehran" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></Field>
            </div>

            <div className="contact-options-section">
              <div className="panel-heading row compact-heading">
                <div><h3>Email options</h3></div>
              </div>
              {emailRows.map((row) => (
                <div className="contact-option-row" key={row.id}>
                  <Select aria-label="Email label" className="contact-label-select" value={row.type} onValueChange={(value) => updateEmailRow(row.id, { type: String(value) })}>
                    {emailTypes.map((type) => <Select.Option key={type} value={type}>{type}</Select.Option>)}
                  </Select>
                  <Input aria-label="Email address" placeholder="name@example.com" value={row.value} onChange={(event) => updateEmailRow(row.id, { value: event.target.value })} />
                  <Button
                    aria-label="Remove email"
                    className="danger"
                    disabled={emailRows.length === 1}
                    icon={Trash}
                    onClick={() => setEmailRows((current) => current.filter((item) => item.id !== row.id))}
                    shape="square"
                    size="sm"
                    type="button"
                    variant="ghost"
                  />
                </div>
              ))}
              <Button className="tertiary-button contact-add-button" icon={Plus} onClick={() => setEmailRows((current) => [...current, { id: uid('email'), type: 'Work', value: '' }])} type="button" variant="ghost">
                Add another
              </Button>
            </div>

            <div className="contact-options-section">
              <div className="panel-heading row compact-heading">
                <div><h3>Phone options</h3></div>
              </div>
              {phoneRows.map((row) => (
                <div className="contact-option-row phone-option-row" key={row.id}>
                  <Select aria-label="Phone label" className="contact-label-select" value={row.type} onValueChange={(value) => updatePhoneRow(row.id, { type: String(value) })}>
                    {phoneTypes.map((type) => <Select.Option key={type} value={type}>{type}</Select.Option>)}
                  </Select>
                  <Combobox
                    items={countryOptions}
                    value={countryOptionFromCountry(findPhoneCountry(row))}
                    onValueChange={(value) => {
                      const selected = resolveCountryOption(value) ?? countryOptionFromCountry(defaultCountry);
                      if (!selected) return;
                      updatePhoneRow(row.id, {
                        countryIso2: selected.iso2,
                        countryName: selected.name,
                        callingCode: selected.callingCode,
                      });
                    }}
                  >
                    <Combobox.TriggerValue aria-label="Country calling code" className="contact-country-select" />
                    <Combobox.Content className="combobox-search-menu contact-country-menu">
                      <div className="combobox-search-input-wrap">
                        <Combobox.Input placeholder="Search countries or codes" />
                      </div>
                      <Combobox.Empty>No countries found.</Combobox.Empty>
                      <Combobox.List>
                        {(country: CountryOption) => (
                          <Combobox.Item key={country.iso2} value={country}>
                            <span className="country-option-row">
                              <span>{country.name}</span>
                              <span>{country.callingCode}</span>
                            </span>
                            <span className="sr-only">{country.searchText}</span>
                          </Combobox.Item>
                        )}
                      </Combobox.List>
                    </Combobox.Content>
                  </Combobox>
                  <Input aria-label="Phone number" placeholder="123-456-7890" value={row.value} onChange={(event) => updatePhoneRow(row.id, { value: event.target.value })} />
                  <Button
                    aria-label="Remove phone"
                    className="danger"
                    disabled={phoneRows.length === 1}
                    icon={Trash}
                    onClick={() => setPhoneRows((current) => current.filter((item) => item.id !== row.id))}
                    shape="square"
                    size="sm"
                    type="button"
                    variant="ghost"
                  />
                </div>
              ))}
              <Button className="tertiary-button contact-add-button" icon={Plus} onClick={() => setPhoneRows((current) => [...current, createPhoneRow()])} type="button" variant="ghost">
                Add another
              </Button>
            </div>

            <Field label="Notes"><textarea placeholder="Optional internal notes about this client" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></Field>
          </LayerCard.Primary>
          <LayerCard.Secondary className="modal-footer">
            <Button className="secondary-button" onClick={closeClientModal} type="button" variant="secondary">Close</Button>
            <Button className="secondary-button" onClick={() => saveClient('new')} type="button" variant="secondary">Save and add another</Button>
            <Button className="primary-button" onClick={() => saveClient('close')} type="button" variant="primary">Save Client</Button>
          </LayerCard.Secondary>
        </LayerCard>
      </Dialog>
    </Dialog.Root>
  );
}

function getLogoFileFormat(file: File) {
  const extension = file.name.split('.').pop()?.trim().toUpperCase();
  if (extension) return extension === 'JPEG' ? 'JPG' : extension;
  const mimeSubtype = file.type.split('/').pop()?.trim().toUpperCase();
  if (!mimeSubtype) return 'IMAGE';
  return mimeSubtype === 'SVG+XML' ? 'SVG' : mimeSubtype === 'JPEG' ? 'JPG' : mimeSubtype;
}

function SettingsPage({ state, setState, notify }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; notify: (toast: Omit<Toast, 'id'>) => void }) {
  const [company, setCompany] = useState(state.companyProfile);
  const [bank, setBank] = useState(state.bankDetails);
  const [numbering, setNumbering] = useState(state.invoiceNumberSettings);
  const [vat, setVat] = useState(state.vatSettings);
  const [logoPendingDelete, setLogoPendingDelete] = useState(false);
  const [seedRestorePending, setSeedRestorePending] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const hasLogo = Boolean(company.logo);
  const logoFileName = company.logoFileName || 'Uploaded logo';
  const logoFileFormat = company.logoFileFormat || 'IMAGE';

  useEffect(() => {
    setCompany(state.companyProfile);
    setBank(state.bankDetails);
    setNumbering(state.invoiceNumberSettings);
    setVat(state.vatSettings);
  }, [state.companyProfile, state.bankDetails, state.invoiceNumberSettings, state.vatSettings]);

  function saveSettings(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setState((current) => ({
      ...current,
      companyProfile: company,
      bankDetails: bank,
      invoiceNumberSettings: numbering,
      vatSettings: vat,
      defaultCurrency: company.defaultCurrency || state.defaultCurrency,
    }));
    notify({ kind: 'success', title: 'Settings saved successfully' });
  }

  function restoreSettings(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSeedRestorePending(true);
  }

  function confirmSeedRestore() {
    setState(createDefaultState());
    setSeedRestorePending(false);
    notify({
      kind: 'success',
      title: 'Seed data restored',
      body: 'Invoices, clients, settings, and logo data were reset to the default sample state.',
    });
  }

  function readLogo(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompany((current) => ({
        ...current,
        logo: String(reader.result || ''),
        logoFileName: file.name,
        logoFileFormat: getLogoFileFormat(file),
      }));
      if (logoInputRef.current) logoInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setCompany((current) => ({
      ...current,
      logo: '',
      logoFileName: '',
      logoFileFormat: '',
    }));
    if (logoInputRef.current) logoInputRef.current.value = '';
    setLogoPendingDelete(false);
  }

  return (
    <>
      <form className="settings-layout" id="settings-form" onReset={restoreSettings} onSubmit={saveSettings}>
        <Panel>
          <div className="panel-heading">
            <h2>Company details</h2>
          </div>
          <div className="form-grid two">
            <Field label="Company name"><input value={company.name} onChange={(event) => setCompany({ ...company, name: event.target.value })} /></Field>
            <Field label="Email"><input value={company.email} onChange={(event) => setCompany({ ...company, email: event.target.value })} /></Field>
            <Field label="Phone"><input value={company.phone} onChange={(event) => setCompany({ ...company, phone: event.target.value })} /></Field>
            <Field label="Website"><input value={company.website} onChange={(event) => setCompany({ ...company, website: event.target.value })} /></Field>
            <Field label="VAT number"><input value={company.vatNumber} onChange={(event) => setCompany({ ...company, vatNumber: event.target.value })} /></Field>
            <Field label="Registration number"><input value={company.registrationNumber} onChange={(event) => setCompany({ ...company, registrationNumber: event.target.value })} /></Field>
            <div className="field-shell">
              <span className="field-label">Default country</span>
              <Combobox
                items={countryOptions}
                value={countryOptionFromCountry(findCompanyCountry(company))}
                onValueChange={(value) => {
                  const selected = resolveCountryOption(value);
                  if (!selected) return;
                  setCompany({
                    ...company,
                    defaultCountry: selected.name,
                    countryIso2: selected.iso2,
                    countryName: selected.name,
                    callingCode: selected.callingCode,
                    defaultCurrency: selected.defaultCurrency,
                    vatRegion: selected.vatRegion,
                  });
                }}
              >
                <Combobox.TriggerValue className="app-field-control" placeholder="Select country" />
                <Combobox.Content className="combobox-search-menu">
                  <div className="combobox-search-input-wrap">
                    <Combobox.Input placeholder="Search countries or codes" />
                  </div>
                  <Combobox.Empty>No countries found.</Combobox.Empty>
                  <Combobox.List>
                    {(country: CountryOption) => (
                      <Combobox.Item key={country.iso2} value={country}>
                        <span className="country-option-row">
                          <span>{country.name}</span>
                          <span>{country.callingCode}</span>
                        </span>
                        <span className="sr-only">{country.searchText}</span>
                      </Combobox.Item>
                    )}
                  </Combobox.List>
                </Combobox.Content>
              </Combobox>
            </div>
          </div>
          <Field label="Address"><textarea value={company.address} onChange={(event) => setCompany({ ...company, address: event.target.value })} /></Field>
          <div className="file-upload-field">
            <span>Logo upload</span>
            <div className="file-upload-row">
              <span className="logo-upload-action" title={hasLogo ? 'Delete the existing logo to upload a new one.' : undefined}>
                <Button disabled={hasLogo} icon={UploadSimple} onClick={() => logoInputRef.current?.click()} type="button" variant="secondary">
                  Choose logo
                </Button>
              </span>
              {!hasLogo ? <span>No logo selected</span> : null}
              <input ref={logoInputRef} hidden type="file" accept="image/*" onChange={(event) => readLogo(event.target.files?.[0])} />
            </div>
            {hasLogo ? (
              <div className="uploaded-logo-card">
                <div className="uploaded-logo-preview">
                  <img src={company.logo} alt={`${logoFileName} preview`} />
                </div>
                <div className="uploaded-logo-details">
                  <div className="uploaded-logo-title-row">
                    <strong>{logoFileName}</strong>
                    <span>{logoFileFormat}</span>
                  </div>
                  <p>Your selected logo will appear on your invoice.</p>
                </div>
                <Button aria-label="Delete uploaded logo" className="logo-delete-button" icon={Trash} onClick={() => setLogoPendingDelete(true)} shape="square" type="button" variant="ghost" />
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel>
          <div className="panel-heading">
            <h2>Bank details</h2>
          </div>
          <div className="form-grid two">
            <Field label="Bank name"><input value={bank.bankName} onChange={(event) => setBank({ ...bank, bankName: event.target.value })} /></Field>
            <Field label="Account holder"><input value={bank.accountHolder} onChange={(event) => setBank({ ...bank, accountHolder: event.target.value })} /></Field>
            <Field label="IBAN"><input value={bank.iban} onChange={(event) => setBank({ ...bank, iban: event.target.value })} /></Field>
            <Field label="SWIFT/BIC"><input value={bank.swiftBic} onChange={(event) => setBank({ ...bank, swiftBic: event.target.value })} /></Field>
            <Field label="Account number"><input value={bank.accountNumber} onChange={(event) => setBank({ ...bank, accountNumber: event.target.value })} /></Field>
            <Field label="Sort code"><input value={bank.sortCode} onChange={(event) => setBank({ ...bank, sortCode: event.target.value })} /></Field>
          </div>
          <Field label="Payment reference"><input value={bank.paymentReference} onChange={(event) => setBank({ ...bank, paymentReference: event.target.value })} /></Field>
          <Field label="Overseas transfer note"><textarea value={bank.overseasTransferNote} onChange={(event) => setBank({ ...bank, overseasTransferNote: event.target.value })} /></Field>
        </Panel>

      <Panel>
        <div className="panel-heading">
          <h2>Numbering and VAT</h2>
        </div>
        <div className="form-grid three">
          <Field label="Prefix"><input value={numbering.prefix} onChange={(event) => setNumbering({ ...numbering, prefix: event.target.value })} /></Field>
          <Field label="Next number"><input type="number" min="1" value={numbering.nextNumber} onChange={(event) => setNumbering({ ...numbering, nextNumber: Number(event.target.value) })} /></Field>
          <Field label="Padding"><input type="number" min="1" value={numbering.padding} onChange={(event) => setNumbering({ ...numbering, padding: Number(event.target.value) })} /></Field>
          <Field label="VAT mode">
            <select value={vat.mode} onChange={(event) => setVat({ ...vat, mode: event.target.value as VatMode, enabled: event.target.value === 'enabled' })}>
              {vatModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </Field>
          <Field label="VAT label"><input value={vat.label} onChange={(event) => setVat({ ...vat, label: event.target.value })} /></Field>
          <Field label="Default rate"><input type="number" min="0" value={vat.defaultRate} onChange={(event) => setVat({ ...vat, defaultRate: Number(event.target.value), customRate: Number(event.target.value) })} /></Field>
        </div>
        <div className="checkbox-row">
          <Checkbox
            checked={numbering.includeYear}
            label="Include year"
            onCheckedChange={(checked) => setNumbering({ ...numbering, includeYear: Boolean(checked) })}
          />
          <Checkbox
            checked={numbering.includeMonth}
            label="Include month"
            onCheckedChange={(checked) => setNumbering({ ...numbering, includeMonth: Boolean(checked) })}
          />
        </div>
        <Field label="Reverse charge note"><textarea value={vat.reverseChargeNote} onChange={(event) => setVat({ ...vat, reverseChargeNote: event.target.value })} /></Field>
        </Panel>
      </form>
      <ConfirmationModal
        opened={logoPendingDelete}
        title="Remove logo?"
        body="This logo will be removed from your invoice settings."
        cancelLabel="Cancel"
        confirmLabel="Remove logo"
        danger
        onCancel={() => setLogoPendingDelete(false)}
        onConfirm={removeLogo}
      />
      <ConfirmationModal
        opened={seedRestorePending}
        title="Restore seed data?"
        body="This will replace your current local app data with the default sample workspace. Company details, bank details, numbering and VAT settings, uploaded logo, clients, and invoices stored in this browser will be reset. This action cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Restore seed data"
        danger
        onCancel={() => setSeedRestorePending(false)}
        onConfirm={confirmSeedRestore}
      />
    </>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [page, setPage] = useState<Page>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [createHasUnsavedChanges, setCreateHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<Page | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [dashboardClientModalOpen, setDashboardClientModalOpen] = useState(false);
  const hiddenPdfRef = useRef<HTMLDivElement>(null);
  const createDraftSaveRef = useRef<(() => boolean) | null>(null);

  useEffect(() => {
    saveAppState(state);
    document.documentElement.dir = 'ltr';
  }, [state]);

  useEffect(() => {
    if (!pdfInvoice) return;
    const timer = window.setTimeout(async () => {
      if (!hiddenPdfRef.current) return;
      setIsPdfExporting(true);
      try {
        await exportInvoicePdf(hiddenPdfRef.current, pdfInvoice);
        notify({ kind: 'success', title: 'PDF exported successfully' });
      } catch {
        notify({ kind: 'error', title: 'PDF export failed', body: 'Please check the invoice details and try again.' });
      } finally {
        setIsPdfExporting(false);
        setPdfInvoice(null);
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pdfInvoice]);

  useEffect(() => {
    if (!printInvoice) return;
    const timer = window.setTimeout(() => {
      window.print();
      setPrintInvoice(null);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [printInvoice]);

  function notify(toast: Omit<Toast, 'id'>) {
    appToastManager.add({
      title: toast.title,
      description: toast.body,
      variant: toast.kind === 'error' ? 'error' : toast.kind === 'success' ? 'success' : 'info',
    });
  }

  function navigate(nextPage: Page) {
    if (page === 'create' && nextPage !== 'create' && createHasUnsavedChanges) {
      setPendingNavigation(nextPage);
      return;
    }
    setDashboardClientModalOpen(getDashboardClientModalOpenAfterNavigation({ currentOpen: dashboardClientModalOpen, nextPage }));
    setPage(nextPage);
    if (nextPage !== 'create') {
      setEditingInvoice(null);
      setCreateHasUnsavedChanges(false);
    }
  }

  const registerCreateDraftSave = useCallback((handler: (() => boolean) | null) => {
    createDraftSaveRef.current = handler;
  }, []);

  function confirmNavigationAway() {
    if (!pendingNavigation) return;
    const nextPage = pendingNavigation;
    setPendingNavigation(null);
    setCreateHasUnsavedChanges(false);
    setEditingInvoice(null);
    setDashboardClientModalOpen(getDashboardClientModalOpenAfterNavigation({ currentOpen: dashboardClientModalOpen, nextPage }));
    setPage(nextPage);
  }

  function saveDraftAndNavigateAway() {
    if (!pendingNavigation) return;
    const saveDraft = createDraftSaveRef.current;
    if (!saveDraft) return;
    const nextPage = pendingNavigation;
    const saved = saveDraft();
    if (!saved) {
      setPendingNavigation(null);
      return;
    }
    setPendingNavigation(null);
    setCreateHasUnsavedChanges(false);
    setEditingInvoice(null);
    setDashboardClientModalOpen(getDashboardClientModalOpenAfterNavigation({ currentOpen: dashboardClientModalOpen, nextPage }));
    setPage(nextPage);
  }

  function editInvoice(invoice: Invoice) {
    setEditingInvoice(invoice);
    setPage('create');
  }

  return (
    <>
      <AppShell
        page={page}
        setPage={navigate}
        onSupportClick={() => setSupportModalOpen(true)}
      >
        {(page === 'dashboard' || page === 'invoices') && (
          <DashboardPage
            state={state}
            setState={setState}
            editInvoice={editInvoice}
            createInvoice={() => {
              setEditingInvoice(null);
              setCreateHasUnsavedChanges(false);
              setPage('create');
            }}
            createClient={() => {
              setDashboardClientModalOpen(true);
            }}
            requestPdf={setPdfInvoice}
            requestPrint={setPrintInvoice}
            showRecentClients={page === 'dashboard'}
          />
        )}
        {page === 'create' && (
          <CreateInvoicePage
            state={state}
            setState={setState}
            editingInvoice={editingInvoice}
            clearEditing={() => setEditingInvoice(null)}
            notify={notify}
            requestPdf={setPdfInvoice}
            onDirtyChange={setCreateHasUnsavedChanges}
            registerDraftSave={registerCreateDraftSave}
            onClose={() => navigate('dashboard')}
          />
        )}
        {page === 'clients' && <ClientsPage state={state} setState={setState} notify={notify} />}
        {page === 'settings' && <SettingsPage state={state} setState={setState} notify={notify} />}
      </AppShell>
      <AddClientModal
        opened={dashboardClientModalOpen}
        onClose={() => setDashboardClientModalOpen(false)}
        setState={setState}
        notify={notify}
      />
      {isPdfExporting && (
        <div className="global-loading-state" role="status">
          <Loader size={18} />
          <span>Exporting PDF...</span>
        </div>
      )}
      <ConfirmationModal
        opened={Boolean(pendingNavigation)}
        title="Leave invoice creation?"
        body="You have unsaved invoice details. If you leave this page, your changes may be lost."
        cancelLabel="Cancel"
        secondaryLabel="Save Draft"
        confirmLabel="Leave page"
        danger
        onCancel={() => setPendingNavigation(null)}
        onSecondary={saveDraftAndNavigateAway}
        onConfirm={confirmNavigationAway}
      />
      <SupportModal opened={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
      <div className="pdf-offscreen" aria-hidden="true">
        {pdfInvoice && (
          <div ref={hiddenPdfRef}>
            <InvoiceTemplate invoice={pdfInvoice} />
          </div>
        )}
      </div>
      <div className="print-area" aria-hidden="true">
        {printInvoice && <InvoiceTemplate invoice={printInvoice} />}
      </div>
    </>
  );
}
