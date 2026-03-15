import { NextRequest, NextResponse } from 'next/server'

// ── In-memory rate limiter (resets on cold start / redeploy) ──────────────────
const ipMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You can process up to 10 images per hour.' },
      { status: 429 }
    )
  }

  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Service not configured. Please set REMOVE_BG_API_KEY.' },
      { status: 500 }
    )
  }

  let file: File | null = null
  try {
    const form = await req.formData()
    file = form.get('image') as File | null
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: 'No image provided.' }, { status: 400 })
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported format. Please upload JPG, PNG, or WEBP.' },
      { status: 400 }
    )
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10 MB.' },
      { status: 400 }
    )
  }

  try {
    const body = new FormData()
    body.append('image_file', file)
    body.append('size', 'preview') // free tier

    const upstream = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body,
    })

    if (!upstream.ok) {
      const errJson = await upstream.json().catch(() => ({}))
      const msg =
        (errJson as { errors?: { title: string }[] })?.errors?.[0]?.title ??
        'Background removal failed.'
      return NextResponse.json({ error: msg }, { status: upstream.status })
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())

    // Downscale to max 1000px on the longest side (free-tier limitation)
    let outputBuffer = buffer
    try {
      const sharp = (await import('sharp')).default
      const meta = await sharp(buffer).metadata()
      const longest = Math.max(meta.width ?? 0, meta.height ?? 0)
      if (longest > 1000) {
        outputBuffer = await sharp(buffer)
          .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer()
      }
    } catch {
      // sharp optional — skip resize if unavailable
    }

    return NextResponse.json({ result: outputBuffer.toString('base64') })
  } catch (err) {
    console.error('[remove-bg]', err)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
