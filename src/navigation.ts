export type AppPage = 'dashboard' | 'invoices' | 'create' | 'clients' | 'settings';

export function getDashboardClientModalOpenAfterNavigation({
  currentOpen: _currentOpen,
  nextPage: _nextPage,
}: {
  currentOpen: boolean;
  nextPage: AppPage;
}) {
  return false;
}
