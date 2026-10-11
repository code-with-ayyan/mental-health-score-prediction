import { forwardRef, useEffect, useState } from 'react';
import { ArrowUpToLine, Info, Pencil, RotateCcw } from 'lucide-react';
import DayRing from './DayRing';
import { FIELD_GROUPS } from '../data/formFields';
import { SCORE_SCALE } from '../config';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function formatAnswer(field, value) {
  const option = field.options?.find((candidate) => candidate.value === value);
  const text = option ? option.label : String(value);
  return field.unit ? `${text} ${field.unit}` : text;
}

const PredictionResult = forwardRef(function PredictionResult({ prediction, payload, onEdit, onReset }, ref) {
  const { min, max, confirmed } = SCORE_SCALE;
  const targetRatio = clamp((prediction - min) / (max - min), 0, 1);
  const isOutsideScale = prediction < min || prediction > max;

  // Start the bar empty, then let it grow once, so the fill is a visible reveal.
  const [ratio, setRatio] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setRatio(targetRatio));
    return () => cancelAnimationFrame(frame);
  }, [targetRatio]);

  const hours = {
    sleep: payload.sleep_hours_per_night,
    study: payload.study_hours,
    activity: payload.physical_activity_hours,
    social: payload.avg_daily_usage_hours,
  };

  return (
    <section
      ref={ref}
      id="results"
      tabIndex={-1}
      aria-labelledby="result-heading"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14 outline-none sm:px-6"
    >
      <div className="animate-rise card overflow-hidden">
        <div className="grid gap-px bg-line lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-ink-900 p-6 sm:p-10">
            <h2 id="result-heading" className="text-base font-semibold text-fg-muted">
              Predicted Mental Health Score
            </h2>
            <p className="mt-3 font-display text-7xl font-bold tracking-tight sm:text-8xl" aria-live="polite">
              {prediction.toFixed(2)}
            </p>

            <div className="mt-8">
              <div className="h-3 overflow-hidden rounded-full bg-ink-800" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-linear-to-r from-accent via-violet to-electric transition-[width] duration-1000 ease-out"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-fg-subtle" aria-hidden="true">
                <span>{min}</span>
                <span>{max}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {confirmed
                  ? `The model's expected scale runs from ${min} to ${max}.`
                  : `The bar uses a ${min} to ${max} reference line for visual orientation only. The scale of the trained model has not been confirmed, so it is not presented as a validated scale.`}
                {isOutsideScale && ` This estimate falls outside that line, so the bar is capped at its edge.`}
              </p>
            </div>

            <p className="mt-6 flex gap-3 rounded-xl border border-line bg-ink-850 p-4 text-sm leading-relaxed text-fg-muted">
              <Info className="mt-0.5 size-5 shrink-0 text-accent-soft" aria-hidden="true" />
              <span>
                This number is a machine learning estimate based only on the information you supplied. It is not a clinical
                assessment, a diagnosis or a recommendation.
              </span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onEdit} className="btn-secondary">
                <Pencil className="size-4" aria-hidden="true" />
                Edit my answers
              </button>
              <button type="button" onClick={onReset} className="btn-primary">
                <RotateCcw className="size-4" aria-hidden="true" />
                Run another prediction
              </button>
            </div>
          </div>

          <div className="bg-ink-900 p-6 sm:p-10">
            <h3 className="text-lg font-semibold">Information you provided</h3>
            <DayRing hours={hours} className="mt-5" />
            <dl className="mt-6 divide-y divide-line text-sm">
              {FIELD_GROUPS.flatMap((group) => group.fields).map((field) => (
                <div key={field.name} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-fg-muted">{field.label}</dt>
                  <dd className="text-right font-medium text-fg">{formatAnswer(field, payload[field.name])}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-fg-subtle">
        <ArrowUpToLine className="size-4" aria-hidden="true" />
        Choose “Edit my answers” to adjust the form above and generate a new estimate.
      </p>
    </section>
  );
});

export default PredictionResult;
