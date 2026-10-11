import { ArrowRight, ShieldCheck } from 'lucide-react';
import DayRing from './DayRing';

// Illustration only: these hours are not user data and no numbers are shown.
const ILLUSTRATION_HOURS = { sleep: 7.5, study: 4, activity: 1.5, social: 4 };

export default function HeroSection() {
  return (
    <section id="top" className="relative scroll-mt-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(143,155,192,0.25)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/70 px-3 py-1.5 text-sm text-fg-muted">
            <ShieldCheck className="size-4 text-accent-soft" aria-hidden="true" />
            An informational estimate, not a diagnosis
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Understand your digital lifestyle
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Share how you use social media and how you study, move and sleep. A machine learning model
            trained on similar information returns an estimated mental health score based on the answers you provide.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#predict" className="btn-primary">
              Start your prediction
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        <div className="animate-rise card mx-auto w-full max-w-sm p-6 sm:p-8">
          <DayRing hours={ILLUSTRATION_HOURS} decorative />
          <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-fg-subtle">
            Illustration of the daily habits the model considers. It does not show your data.
          </p>
        </div>
      </div>
    </section>
  );
}
