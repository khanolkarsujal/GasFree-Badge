import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely — handles conditional classes and
 * resolves conflicts (e.g. p-2 + p-4 → p-4).
 * Shadcn/ui pattern, used across the codebase.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
