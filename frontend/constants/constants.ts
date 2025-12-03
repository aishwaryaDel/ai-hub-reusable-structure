/**
 * Application Constants
 *
 * This file contains all hardcoded values used throughout the application.
 * Centralizing constants makes the application easier to maintain and update.
 */

export const DEPARTMENTS = ['Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations'] as const;
export type Department = typeof DEPARTMENTS[number];

export const STATUS_SEQUENCE = ['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived'] as const;
export type UseCaseStatus = typeof STATUS_SEQUENCE[number];

export const LANGUAGES = ['en', 'de'] as const;
export type Language = typeof LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'de';

export const STATUS_COLORS: Record<UseCaseStatus, string> = {
  Live: 'bg-green-600',
  MVP: 'bg-blue-600',
  PoC: 'bg-orange-500',
  Evaluation: 'bg-yellow-600',
  'Pre-Evaluation': 'bg-purple-600',
  Ideation: 'bg-gray-500',
  Archived: 'bg-gray-400',
} as const;

export const DEFAULT_IMAGES: Record<Department, string> = {
  Marketing: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
  'R&D': 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
  Procurement: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=800',
  IT: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800',
  HR: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
  Operations: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800',
} as const;

export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  maxTitleLength: 200,
  maxShortDescriptionLength: 300,
  maxFullDescriptionLength: 5000,
} as const;

export const UI = {
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [6, 12, 24, 48] as const,
  },
  animation: {
    duration: 200,
    easing: 'ease-in-out' as const,
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
} as const;
