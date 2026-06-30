# Invoicer

Invoicer is a local-first invoice management web app for freelancers and small businesses. You can run it locally, use it from your browser, manage clients and invoices, and export invoices as PDF without setting up a backend.

## Download And Use

If you only want to use the app and do not want to work with code:

1. Open the GitHub repository: https://github.com/Alienoghli/invoicer
2. Go to **Releases**.
3. Download `Invoicer.html` from the latest release.
4. Double-click `Invoicer.html` to open it in your browser.

This project works best in desktop view. Invoice creation, invoice preview, tables, and PDF export need more screen space than a small phone screen can comfortably provide.

## Features

- Local-first invoice management in the browser.
- Dashboard overview with invoice status summary.
- Invoice creation with live edit and preview workflow.
- Invoice management with search, filters, duplicate, edit, print, and PDF export.
- Client address book for reusable billing details.
- Company profile settings.
- Bank and payment details.
- Invoice numbering, currency, direction, and VAT settings.
- Invoice status tracking for Draft, Pending, Paid, Overdue, and Cancelled invoices.
- A4 invoice layout with portrait and landscape orientation.
- Country and calling code support for client details.
- Browser-based usage with no backend required for the current version.

## Local-First Privacy

Invoicer is local-first. In the current version, it does not require a backend account, cloud database, or server.

The app stores data in your browser using `localStorage` under the key `invoicer:v1`. This includes company profile details, clients, bank details, invoices, invoice numbering rules, VAT defaults, default currency, and display direction.

Your invoice, client, and business data stay in your browser storage unless you export, delete, reset, or clear them. Browser storage can also be cleared by browser settings, private browsing behavior, device cleanup tools, or user action.

## How To Run Locally

For developers or users who want to run the source project:

```bash
npm install
npm run dev
```

After the dev server starts, open the local browser URL shown in the terminal.

Build and test:

```bash
npm run build
npm run test
```

The production build is emitted as a single-file HTML app at `dist/index.html`, so it can be opened directly in a browser after building.

## How To Use The App

1. Open Invoicer in your browser.
2. Go to Settings.
3. Add your company details.
4. Add bank and payment details.
5. Add clients.
6. Create an invoice.
7. Add services, quantities, fees, discounts, and VAT settings.
8. Review the invoice preview.
9. Export the invoice as PDF.
10. Track the invoice status from the dashboard and invoice list.

## Main Sections

**Dashboard** shows invoice overview, status summaries, and quick access to create invoices.

**Invoices** lets you view, manage, edit, delete, duplicate, print, download, and update the status of invoices.

**Clients** lets you add and manage client details, then reuse client information when creating invoices.

**Settings** lets you manage company profile details, bank details, invoice numbering, VAT behavior, currency, and app preferences.

## Current Limitations

- Best used on desktop.
- No cloud sync in the current version.
- No multi-user accounts or authentication.
- Browser storage can be cleared by browser or user action.
- Advanced VAT and tax rules may require manual configuration depending on country and business type.
- Currency can be configured, but automatic exchange rates are not included.
- PDF export depends on how the browser renders the invoice document.

## Future Improvements

- Advanced multi-currency and exchange-rate support.
- Cloud sync and backup options.
- Import and export for local data backup.
- Multiple invoice templates.
- Recurring invoices.
- Payment reminders.
- Multi-business profile support.
- Mobile and tablet optimization.
- More advanced VAT and tax configuration.

## Contributing

Contributions, ideas, and improvements are welcome. If you want to suggest a change, open an issue or pull request on GitHub.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
