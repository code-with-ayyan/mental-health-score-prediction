import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <p className="font-display text-lg font-bold">PredictHub <span className="text-sm font-medium text-fg-subtle">by Ayyan</span></p>
            <p className="text-sm text-fg-subtle">A machine learning estimate of digital lifestyle patterns.</p>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            <li><a className="hover:text-fg" href="#predict">Prediction dashboard</a></li>
            <li><a className="hover:text-fg" href="#how-it-works">How it works</a></li>
            <li><a className="hover:text-fg" href="#model-info">Model information</a></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-fg-subtle sm:px-6">
        © {new Date().getFullYear()} PredictHub by Ayyan. For information only; not medical advice.
      </p>
    </footer>
  );
}
