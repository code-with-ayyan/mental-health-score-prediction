import { Lock } from 'lucide-react';
import DayRing from './DayRing';
import { DAY_HOURS, formatNumber, getDailyHoursTotal } from '../utils/formValidation';

// Turns a form value into hours, ignoring blanks and values outside 0-24.
const toHours = (value) => {
  const number = Number(value);
  return value !== '' && Number.isFinite(number) && number >= 0 && number <= 24 ? number : 0;
};

export default function DaySummary({ values }) {
  const hours = {
    sleep: toHours(values.sleep_hours_per_night),
    study: toHours(values.study_hours),
    activity: toHours(values.physical_activity_hours),
    social: toHours(values.avg_daily_usage_hours),
  };
  const total = getDailyHoursTotal(values);
  const remaining = DAY_HOURS - total;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24" aria-label="Live summary of your daily hours">
      <div className="card p-6">
        <h3 className="text-lg font-semibold">Your 24 hours at a glance</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          This ring updates as you enter hours. Social media usage, study, physical activity and sleep together cannot be more than 24 hours.
        </p>
        <DayRing hours={hours} className="mt-6" />
        {total > 0 && (
          <p role="status" className={`mt-4 rounded-xl border p-3 text-sm ${remaining < 0 ? 'border-danger/50 bg-danger/10 font-medium text-danger' : 'border-line bg-ink-850 text-fg-muted'}`}>
            {remaining < 0
              ? `Over the limit by ${formatNumber(Math.round(-remaining * 100) / 100)} hours. Reduce one or more answers.`
              : `${formatNumber(Math.round(remaining * 100) / 100)} hours of the day are not accounted for.`}
          </p>
        )}
      </div>

      <div className="card flex gap-3 p-5 text-sm leading-relaxed text-fg-muted">
        <Lock className="mt-0.5 size-5 shrink-0 text-accent-soft" aria-hidden="true" />
        <p>
          Your answers are sent to the prediction service only when you generate a prediction. This interface does not save them.
        </p>
      </div>
    </aside>
  );
}
