import { API_BASE_URL } from '../config';
import { FIELDS } from '../data/formFields';

/** Error with a category the interface can turn into a helpful message. */
export class PredictionError extends Error {
  constructor(message, { kind, title, details = [], fieldErrors = {}, status } = {}) {
    super(message);
    this.name = 'PredictionError';
    this.kind = kind; // 'network' | 'validation' | 'server' | 'unexpected'
    this.title = title;
    this.details = details;
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

async function readJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// FastAPI reports validation problems as { detail: [{ loc: ['body', 'age'], msg: '...' }] }.
function parseValidationDetail(detail) {
  const details = [];
  const fieldErrors = {};

  if (typeof detail === 'string') return { details: [detail], fieldErrors };

  if (Array.isArray(detail)) {
    detail.forEach((item) => {
      const message = item?.msg ?? 'Invalid value.';
      const fieldName = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : undefined;
      const field = FIELDS.find((candidate) => candidate.name === fieldName);
      if (field) {
        fieldErrors[field.name] = `${field.label}: ${message}`;
        details.push(`${field.label}: ${message}`);
      } else {
        details.push(message);
      }
    });
  }
  return { details, fieldErrors };
}

/** Sends one JSON object to POST /predict and resolves with the numeric prediction. */
export async function requestPrediction(payload, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new PredictionError('The prediction service could not be reached.', {
      kind: 'network',
      title: 'Cannot reach the prediction service',
      details: [
        `The app tried to connect to ${API_BASE_URL}.`,
        'Make sure the FastAPI server is running, the address is correct, and the browser is allowed to call it (CORS).',
      ],
    });
  }

  const body = await readJsonSafely(response);

  if (!response.ok) {
    if (response.status === 422) {
      const { details, fieldErrors } = parseValidationDetail(body?.detail);
      throw new PredictionError('The prediction service rejected some values.', {
        kind: 'validation',
        title: 'Some answers were not accepted',
        details: details.length ? details : ['Please review your answers and try again.'],
        fieldErrors,
        status: response.status,
      });
    }
    if (response.status >= 500) {
      throw new PredictionError('The prediction service reported an internal error.', {
        kind: 'server',
        title: 'The prediction service ran into a problem',
        details: [
          `The server responded with status ${response.status}.`,
          'Your answers are still in the form. Try again, and check the FastAPI logs if the problem continues.',
        ],
        status: response.status,
      });
    }
    throw new PredictionError('Unexpected response from the prediction service.', {
      kind: 'unexpected',
      title: 'Unexpected response from the service',
      details: [
        `The server responded with status ${response.status}.`,
        'Confirm that the address points to the PredictHub prediction API and that it exposes POST /predict.',
      ],
      status: response.status,
    });
  }

  const rawPrediction = body?.prediction;
  const prediction =
    typeof rawPrediction === 'number'
      ? rawPrediction
      : typeof rawPrediction === 'string' && rawPrediction.trim() !== ''
        ? Number(rawPrediction)
        : Number.NaN;

  if (!Number.isFinite(prediction)) {
    throw new PredictionError('The response did not contain a numeric prediction.', {
      kind: 'unexpected',
      title: 'The response could not be read',
      details: ['The service replied, but the result did not contain a numeric "prediction" value.'],
      status: response.status,
    });
  }

  return prediction;
}

/** Lightweight availability check used by the connection indicator (GET /). */
export async function checkApiAvailability(timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}/`, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
