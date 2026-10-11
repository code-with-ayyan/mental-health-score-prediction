import { TriangleAlert } from 'lucide-react';

export default function Disclaimer() {
  return (
    <section aria-labelledby="disclaimer-heading" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex gap-4 rounded-2xl border border-line bg-ink-900/60 p-6">
        <TriangleAlert className="mt-1 size-6 shrink-0 text-electric" aria-hidden="true" />
        <div>
          <h2 id="disclaimer-heading" className="text-lg font-semibold">
            Important notice
          </h2>
          <p className="mt-2 leading-relaxed text-fg-muted">
            PredictHub provides an informational estimate only. It is not a clinical assessment, medical diagnosis or
            substitute for professional advice. If you are worried about your mental health, please speak with a qualified
            health professional.
          </p>
        </div>
      </div>
    </section>
  );
}
