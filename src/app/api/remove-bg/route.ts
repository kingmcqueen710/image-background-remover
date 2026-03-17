import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
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
    body.append('size', 'preview')

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

    const arrayBuffer = await upstream.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64 = btoa(binary)

    return NextResponse.json({ result: base64 })
  } catch (err) {
    console.error('[remove-bg]', err)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
