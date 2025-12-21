export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  // Prefer an explicit `NEXT_PUBLIC_API_URL`.
  // If missing, default to localhost in development, otherwise use a relative path in production
  // so the deployed frontend does not try to contact `http://localhost:4000`.
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '')

  let res: Response
  try {
    res = await fetch(`${baseUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        ...(options.headers ?? {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(
      baseUrl
        ? `Could not reach the auth server at ${baseUrl}. Make sure the backend is running and CORS is configured for this origin.`
        : `Could not reach the auth server. Requests are being sent to a relative path; ensure your backend is reachable from this deployment and proxying/CORS is configured.`,
      0,
    )
  }

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')

  if (!res.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload && typeof (payload as any).error === 'string'
        ? (payload as any).error
        : undefined) ?? `Request failed (${res.status})`

    throw new ApiError(message, res.status)
  }

  return payload as T
}
