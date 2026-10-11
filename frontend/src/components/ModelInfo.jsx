import { Database } from 'lucide-react';

export default function ModelInfo() {
  return (
    <section id="model-info" aria-labelledby="model-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-6 sm:px-6">
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-soft">
          <Database className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 id="model-heading" className="text-2xl font-semibold">
            Model information
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">
            The result comes from a previously trained machine learning pipeline that the prediction service loads from a saved file.
            It was not retrained or changed for this interface. The service returns a single number, so no accuracy figures,
            training statistics or comparisons are shown here.
          </p>
        </div>
      </div>
    </section>
  );
}
