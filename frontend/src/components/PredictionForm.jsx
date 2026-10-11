import { useEffect, useRef, useState } from 'react';
import { AlertCircle, GraduationCap, HeartPulse, Loader2, RefreshCw, Smartphone, Sparkles, User } from 'lucide-react';
import FormField from './FormFields';
import DaySummary from './DaySummary';
import { FIELDS, FIELD_GROUPS, INITIAL_VALUES } from '../data/formFields';
import { buildPayload, getDailyHoursError, validateAll, validateField } from '../utils/formValidation';
import { requestPrediction } from '../services/predictionApi';

const GROUP_ICONS = { user: User, smartphone: Smartphone, heart: HeartPulse };
const GROUP_COLUMNS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };

export default function PredictionForm({ onPredict }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [apiError, setApiError] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const controllerRef = useRef(null);

  // Live check: the four daily-hour answers must fit inside one 24-hour day.
  const hoursTotalError = getDailyHoursError(values);

  // Cancel any request still running if the form is removed.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    // Once a field shows an error, re-check it while the person corrects it.
    if (errors[name]) {
      const field = FIELDS.find((candidate) => candidate.name === name);
      setErrors((current) => ({ ...current, [name]: validateField(field, value) }));
    }
  };

  const handleBlur = (name) => {
    const field = FIELDS.find((candidate) => candidate.name === name);
    if (values[name] === '' && !submitAttempted) return; // do not nag before the person starts
    setErrors((current) => ({ ...current, [name]: validateField(field, values[name]) }));
  };

  const submit = async () => {
    if (status === 'loading') return; // block duplicate submissions

    const validation = validateAll(values);
    const cleaned = Object.fromEntries(Object.entries(validation).filter(([, message]) => message));
    setErrors(cleaned);
    setSubmitAttempted(true);

    const firstInvalid = FIELDS.find((field) => cleaned[field.name]);
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid.name}`)?.focus();
      return;
    }

    // Stop here, before any request is made, if the hours cannot fit in one day.
    if (hoursTotalError) {
      document.getElementById('field-avg_daily_usage_hours')?.focus();
      return;
    }

    const payload = buildPayload(values);
    controllerRef.current = new AbortController();
    setApiError(null);
    setStatus('loading');

    try {
      const prediction = await requestPrediction(payload, { signal: controllerRef.current.signal });
      setStatus('idle');
      onPredict({ prediction, payload });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setStatus('error');
      setApiError({
        kind: error.kind ?? 'unexpected',
        title: error.title ?? 'Something went wrong',
        details: error.details?.length ? error.details : ['An unexpected problem occurred. Please try again.'],
      });
      if (error.fieldErrors && Object.keys(error.fieldErrors).length) {
        setErrors((current) => ({ ...current, ...error.fieldErrors }));
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const isLoading = status === 'loading';

  return (
    <section id="predict" aria-labelledby="predict-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h2 id="predict-heading" className="text-3xl font-bold sm:text-4xl">
          Prediction dashboard
        </h2>
        <p className="mt-3 text-lg text-fg-muted">
          Answer all twelve questions about a typical day. Fields marked with an asterisk are required.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="card space-y-10 p-5 sm:p-8">
          {FIELD_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.icon] ?? GraduationCap;
            return (
              <fieldset key={group.id} className="min-w-0">
                <legend className="mb-6 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-ink-850 text-accent-soft">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold">{group.title}</span>
                    <span className="block text-sm font-normal text-fg-muted">{group.description}</span>
                  </span>
                </legend>
                <div className={`grid gap-x-6 gap-y-7 ${GROUP_COLUMNS[group.columns]}`}>
                  {group.fields.map((field) => (
                    <div key={field.name} className={field.wide ? 'sm:col-span-full' : undefined}>
                      <FormField
                        field={field}
                        value={values[field.name]}
                        error={errors[field.name]}
                        flagged={Boolean(field.countsTowardDay && hoursTotalError)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            );
          })}

          <div className="space-y-4 border-t border-line pt-8">
            {hoursTotalError && (
              <p id="hours-total-error" role="alert" className="flex items-start gap-2 rounded-xl border border-danger/50 bg-danger/10 p-4 text-sm font-medium text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{hoursTotalError}</span>
              </p>
            )}

            {submitAttempted && errorCount > 0 && !apiError && (
              <p role="alert" className="flex items-start gap-2 text-sm font-medium text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {errorCount === 1 ? 'Please correct the highlighted answer.' : `Please correct the ${errorCount} highlighted answers.`}
              </p>
            )}

            {apiError && (
              <div role="alert" className="rounded-xl border border-danger/50 bg-danger/10 p-4">
                <p className="flex items-center gap-2 font-semibold text-danger">
                  <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
                  {apiError.title}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-fg-muted">
                  {apiError.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                {apiError.kind !== 'validation' && (
                  <button type="button" onClick={submit} disabled={isLoading} className="btn-secondary mt-4 min-h-11 px-4 text-sm">
                    <RefreshCw className="size-4" aria-hidden="true" />
                    Try again
                  </button>
                )}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto sm:min-w-72">
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Generating your prediction…
                </>
              ) : (
                <>
                  <Sparkles className="size-5" aria-hidden="true" />
                  Generate My Prediction
                </>
              )}
            </button>
            <p role="status" className="sr-only">
              {isLoading ? 'Contacting the prediction service.' : ''}
            </p>
          </div>
        </form>

        <DaySummary values={values} />
      </div>
    </section>
  );
}
