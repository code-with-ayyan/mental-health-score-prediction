import { FIELDS } from '../data/formFields';

const INTEGER_PATTERN = /^-?\d+$/;
const DECIMAL_PATTERN = /^-?(\d+\.?\d*|\.\d+)$/;

/** Returns an error message for one field, or an empty string when the value is valid. */
export function validateField(field, rawValue) {
  const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

  if (value === '' || value === null || value === undefined) {
    return `${field.label} is required.`;
  }

  if (field.control === 'select' || field.control === 'segmented') {
    const isAllowed = field.options.some((option) => option.value === value);
    return isAllowed ? '' : `Choose one of the available options for ${field.label.toLowerCase()}.`;
  }

  const isInteger = field.control === 'integer';
  if (isInteger && !INTEGER_PATTERN.test(value)) {
    return `${field.label} must be a whole number.`;
  }
  if (!isInteger && !DECIMAL_PATTERN.test(value)) {
    return `${field.label} must be a number.`;
  }

  const number = Number(value);
  const hasMin = field.min !== undefined;
  const hasMax = field.max !== undefined;
  const unit = field.unit ? ` ${field.unit}` : '';

  if (hasMin && hasMax && (number < field.min || number > field.max)) {
    return `${field.label} must be between ${field.min} and ${field.max}${unit}.`;
  }
  if (hasMin && number < field.min) {
    return `${field.label} must be ${field.min} or more.`;
  }
  if (hasMax && number > field.max) {
    return `${field.label} must be ${field.max} or less.`;
  }
  return '';
}

export function validateAll(values) {
  const errors = {};
  FIELDS.forEach((field) => {
    const message = validateField(field, values[field.name]);
    if (message) errors[field.name] = message;
  });
  return errors;
}

/**
 * Builds the exact JSON body the backend expects: twelve keys, whole numbers as
 * integers, decimals as numbers, everything else as the original option string.
 */
export function buildPayload(values) {
  const payload = {};
  FIELDS.forEach((field) => {
    const value = String(values[field.name]).trim();
    if (field.control === 'integer') payload[field.name] = Number.parseInt(value, 10);
    else if (field.control === 'decimal') payload[field.name] = Number(value);
    else payload[field.name] = value;
  });
  return payload;
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '0';
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

export const DAY_HOURS = 24;
const DAY_FIELDS = FIELDS.filter((field) => field.countsTowardDay);

/** Sum of the four daily-hour answers. Blank or invalid entries count as 0 (they show their own errors). */
export function getDailyHoursTotal(values) {
  const total = DAY_FIELDS.reduce((sum, field) => {
    const raw = String(values[field.name] ?? '').trim();
    if (validateField(field, raw)) return sum;
    return sum + Number(raw);
  }, 0);
  return Math.round(total * 100) / 100; // avoids 0.1 + 0.2 style rounding noise
}

/** Returns a message when the four daily-hour answers exceed one day, otherwise an empty string. */
export function getDailyHoursError(values) {
  const total = getDailyHoursTotal(values);
  if (total <= DAY_HOURS) return '';
  return `Social media usage, study, physical activity and sleep add up to ${formatNumber(total)} hours, which is more than the ${DAY_HOURS} hours in a day. Reduce one or more of these answers.`;
}
