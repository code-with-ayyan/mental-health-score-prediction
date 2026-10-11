// The API address comes from the Vite environment variable VITE_API_BASE_URL.
// This is the only place that reads it; every other module imports API_BASE_URL.
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');

// Reference scale used by the result gauge.
// Set `confirmed` to true ONLY after you have verified that the trained model's
// target really spans this range. While it is false, the interface states that
// the scale is unconfirmed and does not present it as validated.
export const SCORE_SCALE = {
  min: 0,
  max: 9,
  confirmed: false,
};
