/**
 * Runtime configuration for the frontend. Treated as the single source of
 * truth for backend URLs so they can be swapped per environment via the
 * Angular CLI `fileReplacements` mechanism (see `angular.json`) without
 * hunting through the codebase for hardcoded hosts.
 */
export const environment = {
  production: false,
  /** Origin of the backend (no trailing slash). */
  apiHost: 'http://localhost:4300',
};
