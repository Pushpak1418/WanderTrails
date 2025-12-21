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
  // In dev, default to the local auth server to prevent "env not found" footguns.
  // In production you should always set NEXT_PUBLIC_API_URL explicitly.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

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
      `Could not reach the auth server at ${baseUrl}. Make sure the backend is running and CORS is configured for this origin.`,
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
