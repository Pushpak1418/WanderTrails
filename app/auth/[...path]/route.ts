import { NextRequest } from 'next/server'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
])

async function proxy(request: Request, params: { path?: string[] }) {
  const backend = process.env.NEXT_PUBLIC_API_URL

  if (!backend) {
    return new Response(
      JSON.stringify({ error: 'NEXT_PUBLIC_API_URL is not set. Configure your backend URL in Vercel.' }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    )
  }

  const path = (params.path ?? []).join('/')
  const incomingUrl = new URL(request.url)
  let target = backend.replace(/\/$/, '') + '/' + path
  if (incomingUrl.search) target += incomingUrl.search

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== 'host') {
      headers.set(key, value)
    }
  })

  const resp = await fetch(target, {
    method: request.method,
    headers,
    body: request.body,
  })

  const respHeaders = new Headers()
  resp.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) respHeaders.set(key, value)
  })

  const body = await resp.arrayBuffer()
  return new Response(body, { status: resp.status, headers: respHeaders })
}

export async function GET(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}

export async function POST(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}

export async function PUT(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}

export async function PATCH(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}

export async function DELETE(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}

export async function OPTIONS(request: Request, context: { params: { path?: string[] } }) {
  return proxy(request, context.params)
}
