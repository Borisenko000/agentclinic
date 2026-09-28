export const DEFAULT_BACKEND_URL = "http://localhost:8080";

/**
 * Absolute backend URL for requests made on the Next.js server
 * (Server Components cannot use the relative `/api` proxy).
 */
export function backendUrl(): string {
  return process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL;
}
