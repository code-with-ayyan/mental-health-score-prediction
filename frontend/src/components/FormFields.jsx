import { AlertCircle, Check, ChevronDown } from 'lucide-react';

const SEGMENT_COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

function FieldMessages({ id, description, error }) {
  return (
    <>
      <p id={`${id}-hint`} className="mt-2 text-sm leading-snug text-fg-subtle">
        {description}
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-2 text-sm font-medium text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </>
  );
}

const describedBy = (id, error) => (error ? `${id}-hint ${id}-error` : `${id}-hint`);

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-fg">
      {children}
      <span aria-hidden="true" className="ml-1 text-accent-soft">*</span>
      <span className="sr-only"> (required)</span>
    </label>
  );
}

function NumberField({ field, value, error, flagged, onChange, onBlur }) {
  const id = `field-${field.name}`;
  const isInteger = field.control === 'integer';
  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      <div className="relative">
        <input
          id={id}
          name={field.name}
          type="number"
          inputMode={isInteger ? 'numeric' : 'decimal'}
          min={field.min}
          max={field.max}
          step={isInteger ? 1 : field.step ?? 'any'}
          value={value}
          placeholder={field.placeholder}
          aria-required="true"
          aria-invalid={Boolean(error) || flagged}
          aria-describedby={`${describedBy(id, error)}${flagged ? ' hours-total-error' : ''}`}
          className="field-control pr-24"
          onChange={(event) => onChange(field.name, event.target.value)}
          onBlur={() => onBlur(field.name)}
        />
        {field.unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-fg-subtle">
            {field.unit}
          </span>
        )}
      </div>
      <FieldMessages id={id} description={field.description} error={error} />
    </div>
  );
}

function SelectField({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;
  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      <div className="relative">
        <select
          id={id}
          name={field.name}
          value={value}
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
          className="field-control appearance-none pr-11"
          onChange={(event) => onChange(field.name, event.target.value)}
          onBlur={() => onBlur(field.name)}
        >
          <option value="" disabled>
            {field.placeholder}
          </option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-fg-subtle" aria-hidden="true" />
      </div>
      <FieldMessages id={id} description={field.description} error={error} />
    </div>
  );
}

function SegmentedField({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;
  return (
    <fieldset aria-describedby={describedBy(id, error)} aria-invalid={Boolean(error)}>
      <legend className="mb-2 block text-sm font-semibold text-fg">
        {field.label}
        <span aria-hidden="true" className="ml-1 text-accent-soft">*</span>
        <span className="sr-only"> (required)</span>
      </legend>
      <div className={`grid gap-2 ${SEGMENT_COLUMNS[field.options.length]}`}>
        {field.options.map((option, index) => {
          const optionId = index === 0 ? id : `${id}-${index}`;
          return (
            <div key={option.value} className="relative">
              <input
                id={optionId}
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                required
                className="peer sr-only"
                onChange={() => onChange(field.name, option.value)}
                onBlur={() => onBlur(field.name)}
              />
              <label
                htmlFor={optionId}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-ink-950/70 px-3 text-center text-sm font-medium text-fg-muted transition-colors hover:border-ink-600 peer-checked:border-accent-soft peer-checked:bg-accent/20 peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-electric peer-checked:[&_svg]:block"
              >
                <Check className="hidden size-4 text-accent-soft" aria-hidden="true" />
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      <FieldMessages id={id} description={field.description} error={error} />
    </fieldset>
  );
}

export default function FormField({ field, ...props }) {
  if (field.control === 'select') return <SelectField field={field} {...props} />;
  if (field.control === 'segmented') return <SegmentedField field={field} {...props} />;
  return <NumberField field={field} {...props} />;
}
