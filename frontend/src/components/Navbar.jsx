import { useEffect, useState } from 'react';
import { LayoutDashboard, Loader2, Menu, Wifi, WifiOff, X } from 'lucide-react';
import Logo from './Logo';
import { useApiStatus } from '../hooks/useApiStatus';

const NAV_ITEMS = [
  { href: '#predict', label: 'Prediction dashboard' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#model-info', label: 'Model information' },
];

const STATUS_VIEW = {
  checking: { label: 'Checking connection', Icon: Loader2, tone: 'text-fg-muted', spin: true },
  online: { label: 'Prediction service connected', Icon: Wifi, tone: 'text-success', spin: false },
  offline: { label: 'Prediction service unreachable', Icon: WifiOff, tone: 'text-danger', spin: false },
};

function ApiStatusBadge() {
  const status = useApiStatus();
  const { label, Icon, tone, spin } = STATUS_VIEW[status];
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/80 px-3 py-1.5 text-xs font-medium text-fg-muted"
    >
      <Icon className={`size-4 ${tone} ${spin ? 'animate-spin' : ''}`} aria-hidden="true" />
      {label}
    </p>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950/80 backdrop-blur-lg pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3 rounded-lg" aria-label="PredictHub by Ayyan home">
          <Logo />
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold tracking-tight">PredictHub</span>
            <span className="block text-xs text-fg-subtle">by Ayyan</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-ink-850 hover:text-fg"
            >
              {index === 0 && <LayoutDashboard className="size-4" aria-hidden="true" />}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ApiStatusBadge />
          </div>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-ink-900 text-fg md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-line bg-ink-950 px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-fg-muted hover:bg-ink-850 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <ApiStatusBadge />
          </div>
        </nav>
      )}
    </header>
  );
}
