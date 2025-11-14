export type NodeEnv = 'development' | 'production' | 'test' | string

type ImportMetaEnvLike = {
  [key: string]: unknown
  MODE?: string
  BASE_URL?: string
  DEV?: boolean
  PROD?: boolean
  SSR?: boolean
}

// PUBLIC_INTERFACE
export function getEnvVar(name: string): string | undefined {
  /** Gets a Vite environment variable from import.meta.env safely. */
  const meta = import.meta as unknown as { env?: ImportMetaEnvLike }
  const val = meta?.env?.[name]
  if (typeof val === 'string') return val
  return undefined
}

// PUBLIC_INTERFACE
export function getApiBaseUrl(): string | undefined {
  /** Returns the API base URL using VITE_API_BASE or VITE_BACKEND_URL (VITE_API_BASE preferred). */
  const base = getEnvVar('VITE_API_BASE')
  const alt = getEnvVar('VITE_BACKEND_URL')
  const url = (base && base.trim()) || (alt && alt.trim()) || ''
  return url || undefined
}

// PUBLIC_INTERFACE
export function isBackendEnabled(): boolean {
  /** Determines if backend sync should be used based on the presence of an API base URL. */
  return !!getApiBaseUrl()
}

// PUBLIC_INTERFACE
export function getNodeEnv(): NodeEnv {
  /** Returns the current node-like env from Vite (if set). */
  const meta = import.meta as unknown as { env?: ImportMetaEnvLike }
  return (getEnvVar('VITE_NODE_ENV') as NodeEnv) || meta?.env?.MODE || 'development'
}
