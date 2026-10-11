import { formatNumber } from '../utils/formValidation';

const SEGMENTS = [
  { key: 'sleep', label: 'Sleep', color: '#818cf8' },
  { key: 'study', label: 'Study', color: '#38bdf8' },
  { key: 'activity', label: 'Physical activity', color: '#2dd4bf' },
  { key: 'social', label: 'Social media', color: '#c084fc' },
];

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

/**
 * Ring that shows how the supplied hours divide a 24-hour day.
 * `decorative` renders an illustration with no numbers (used in the hero).
 * The legend always names every segment so colour is never the only cue.
 */
export default function DayRing({ hours, decorative = false, className = '' }) {
  const total = SEGMENTS.reduce((sum, segment) => sum + (hours[segment.key] || 0), 0);
  const denominator = Math.max(24, total);
  let consumed = 0;

  const arcs = SEGMENTS.map((segment) => {
    const value = hours[segment.key] || 0;
    const length = (value / denominator) * CIRCUMFERENCE;
    const visible = Math.max(0, length - (length > GAP * 2 ? GAP : 0));
    const offset = -consumed;
    consumed += length;
    return { ...segment, value, visible, offset };
  });

  return (
    <div className={className}>
      <div className="relative mx-auto aspect-square w-full max-w-[240px]">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden="true" focusable="false">
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#172041" strokeWidth="16" />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth="16"
              strokeDasharray={`${arc.visible} ${CIRCUMFERENCE - arc.visible}`}
              strokeDashoffset={arc.offset}
              style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-3xl font-bold">{decorative ? '24' : formatNumber(total)}</span>
          <span className="text-xs text-fg-muted">{decorative ? 'hours in a day' : 'hours entered'}</span>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {arcs.map((arc) => (
          <li key={arc.key} className="flex items-center gap-2 text-fg-muted">
            <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: arc.color }} aria-hidden="true" />
            <span>
              {arc.label}
              {!decorative && <span className="block text-fg">{formatNumber(arc.value)} hours</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
