import { describe, expect, it } from 'vitest';
import { getDashboardClientModalOpenAfterNavigation } from './navigation';

describe('navigation state', () => {
  it('closes the dashboard Add Client modal when navigating from the sidebar', () => {
    expect(getDashboardClientModalOpenAfterNavigation({ currentOpen: true, nextPage: 'clients' })).toBe(false);
  });

  it('keeps the dashboard Add Client modal closed during sidebar navigation', () => {
    expect(getDashboardClientModalOpenAfterNavigation({ currentOpen: false, nextPage: 'clients' })).toBe(false);
  });
});
