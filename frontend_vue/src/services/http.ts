import { getApiBaseUrl } from '@/utils/env'

export interface HttpClientOptions {
  baseURL?: string
  headers?: Record<string, string>
}

export class HttpError extends Error {
  status: number
  data: unknown
  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

function buildUrl(path: string, baseURL?: string): string {
  const base = baseURL || getApiBaseUrl()
  if (!base) return path // allow relative path when no base (shouldn't be used by API layer when disabled)
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

// PUBLIC_INTERFACE
export async function httpGet<T>(path: string, options?: HttpClientOptions): Promise<T> {
  /** Performs a GET request using fetch and returns JSON parsed body with error handling. */
  const url = buildUrl(path, options?.baseURL)
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  })
  const text = await res.text()
  const data: unknown = text ? safeJson(text) : null
  if (!res.ok) throw new HttpError(`GET ${url} failed`, res.status, data)
  return data as T
}

// PUBLIC_INTERFACE
export async function httpPost<T>(path: string, body?: unknown, options?: HttpClientOptions): Promise<T> {
  /** Performs a POST request using fetch and returns JSON body. */
  const url = buildUrl(path, options?.baseURL)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  const text = await res.text()
  const data: unknown = text ? safeJson(text) : null
  if (!res.ok) throw new HttpError(`POST ${url} failed`, res.status, data)
  return data as T
}

// PUBLIC_INTERFACE
export async function httpPatch<T>(path: string, body?: unknown, options?: HttpClientOptions): Promise<T> {
  /** Performs a PATCH request using fetch and returns JSON body. */
  const url = buildUrl(path, options?.baseURL)
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  const text = await res.text()
  const data: unknown = text ? safeJson(text) : null
  if (!res.ok) throw new HttpError(`PATCH ${url} failed`, res.status, data)
  return data as T
}

// PUBLIC_INTERFACE
export async function httpDelete<T = void>(path: string, options?: HttpClientOptions): Promise<T> {
  /** Performs a DELETE request using fetch and returns JSON body if present. */
  const url = buildUrl(path, options?.baseURL)
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  })
  const text = await res.text()
  const data: unknown = text ? safeJson(text) : null
  if (!res.ok) throw new HttpError(`DELETE ${url} failed`, res.status, data)
  return data as T
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}
