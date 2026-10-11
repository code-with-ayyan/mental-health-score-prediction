import { useId } from 'react';

export default function Logo({ size = 36 }) {
  const gradientId = `logo-${useId().replace(/:/g, '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <path
        d="M9 26 15 14l5 10 5-10 6 12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="31" r="1.8" fill="#bae6fd" />
    </svg>
  );
}
