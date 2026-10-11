export function scrollToId(id) {
  const element = document.getElementById(id);
  if (!element) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}
