/**
 * Global Configuration File
 *
 * This file centralizes all configuration settings for the Tesa AI Hub application.
 * It includes environment variables, API endpoints, database connections, and application constants.
 *
 * @module config
 */

import { API_ROUTES, APP_ROUTES } from '../routes/routes';
import {
  DEPARTMENTS,
  STATUS_SEQUENCE,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  STATUS_COLORS,
  DEFAULT_IMAGES,
  VALIDATION,
  UI,
} from '../constants/constants';

/**
 * Environment Configuration
 * All environment variables are loaded from .env file and validated here
 */
export const env = {
  api: {
   baseUrl: import.meta.env.VITE_API_BASE_URL,
  },
   external: {
    sharepoint: import.meta.env.VITE_SHAREPOINT_URL,
    confluence: import.meta.env.VITE_CONFLUENCE_URL,
    bits: import.meta.env.VITE_BITS_URL,
    supportPortal: import.meta.env.VITE_SUPPORT_PORTAL,
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL,
  },
} as const;
/**
 * Database Configuration
 * Connection settings and table names for the database
 */
export const database = {
  tables: {
    useCases: 'use_cases',
    users: 'users',
    departments: 'departments',
  },
  schema: 'public',
} as const;

/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API calls
 * @deprecated Use API_ROUTES from '../routes/routes' instead
 */
export const api = {
  baseUrl: env.api.baseUrl,
  endpoints: {
    useCases: API_ROUTES.USE_CASES.BASE,
    useCaseById: (id: string) => API_ROUTES.USE_CASES.BY_ID(id),
    auth: {
      login: API_ROUTES.AUTH.LOGIN,
    },
  },
} as const;

/**
 * Application Routes
 * Defines the routing structure of the application
 * @deprecated Use APP_ROUTES from '../routes/routes' instead
 */
export const routes = {
  home: APP_ROUTES.HOME,
  overview: APP_ROUTES.OVERVIEW,
  useCase: (id: string) => APP_ROUTES.USE_CASE(id),
} as const;

/**
 * Feature Flags
 * Enable or disable features throughout the application
 */
export const features = {
  authentication: false,
  newUseCaseCreation: true,
  search: true,
  filtering: true,
  darkMode: false,
} as const;

/**
 * Application Constants
 * Reusable constants used throughout the application
 * @deprecated Use imports from '../constants/constants' instead
 */
export const constants = {
  departments: DEPARTMENTS,
  statuses: STATUS_SEQUENCE,
  languages: LANGUAGES,
  defaultLanguage: DEFAULT_LANGUAGE,
  statusColors: STATUS_COLORS,
  defaultImages: DEFAULT_IMAGES,
  validation: VALIDATION,
} as const;

/**
 * UI Configuration
 * Settings related to the user interface
 * @deprecated Use UI from '../constants/constants' instead
 */
export const ui = UI;

/**
 * External Links Configuration
 * Links to external systems and resources
 */
export const externalLinks = {
  sharepoint: {
    baseUrl: env.external.sharepoint,
  },
  confluence: {
    baseUrl: env.external.confluence,
  },
  bits: {
    baseUrl: env.external.bits,
    rolesRequestPath: '/roles/request',
  },
  support: {
    email: env.external.supportEmail,
    portal: env.external.supportPortal,
  },
} as const;

/**
 * Error Messages Configuration
 * Centralized error messages and UI text
 */
export const messages = {
  errors: {
    http: (status: number) => `HTTP error! status: ${status}`,
    unexpected: 'An unexpected error occurred',
    loadUseCases: 'Failed to load use cases',
    saveUseCase: 'Failed to save use case',
    errorLoadingUseCases: 'Error loading use cases',
    deleteUseCase: 'Failed to delete use case',
    loginFailed: 'Login failed',
  },
  loading: {
    useCases: 'Loading use cases...',
  },
  actions: {
    retry: 'Retry',
  },
  placeholders: {
    applicationUrl: 'https://...',
  },
} as const;

/**
 * Validates that all required environment variables are present
 * @throws {Error} If required environment variables are missing
 */
export function validateConfig(): void {
  return;
}

/**
 * Exports a utility function to get the full API endpoint URL
 * @deprecated Use getFullApiUrl from '../routes/routes' instead
 */
export function getApiUrl(endpoint: string): string {
  return `${api.baseUrl}${endpoint}`;
}

export { API_ROUTES, APP_ROUTES } from '../routes/routes';

export default {
  env,
  database,
  api,
  routes,
  features,
  constants,
  ui,
  externalLinks,
  messages,
  validateConfig,
  getApiUrl,
};
