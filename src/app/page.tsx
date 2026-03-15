'use client'

import { useCallback, useState } from 'react'
import UploadZone from '@/components/UploadZone'
import ResultViewer from '@/components/ResultViewer'
import FAQ from '@/components/FAQ'

type Status = 'idle' | 'processing' | 'done' | 'error'

const FEATURES = [
  { icon: '⚡', title: 'Instant Results', desc: 'AI processes your image in seconds.' },
  { icon: '🆓', title: '100% Free', desc: 'No signup, no credit card. Just upload and download.' },
  { icon: '🎯', title: 'High Accuracy', desc: 'Clean, precise cutouts powered by advanced AI.' },
]

const USE_CASES = [
  {
    icon: '🛍️',
    title: 'E-commerce',
    desc: 'Create clean product photos with white or transparent backgrounds for Amazon, Shopify, and more.',
  },
  {
    icon: '🪪',
    title: 'ID & Portraits',
    desc: 'Remove backgrounds from headshots and portraits for professional or personal use.',
  },
  {
    icon: '🎨',
    title: 'Design',
    desc: 'Extract subjects from photos to use in presentations, social media, or design projects.',
  },
]

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [originalName, setOriginalName] = useState<string>('image')

  const handleFile = useCallback(async (file: File) => {
    // Revoke previous object URL to avoid memory leaks
    if (originalUrl) URL.revokeObjectURL(originalUrl)

    setOriginalName(file.name.replace(/\.[^.]+$/, ''))
    setOriginalUrl(URL.createObjectURL(file))
    setResultUrl(null)
    setErrorMsg('')
    setStatus('processing')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/remove-bg', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Processing failed. Please try again.')
      setResultUrl(`data:image/png;base64,${data.result}`)
      setStatus('done')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error occurred.')
      setStatus('error')
    }
  }, [originalUrl])

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setStatus('idle')
    setOriginalUrl(null)
    setResultUrl(null)
    setErrorMsg('')
  }, [originalUrl])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
          <span className="text-2xl" aria-hidden>✂️</span>
          <span className="font-bold text-xl text-gray-900">BGRemover</span>
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Free
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Remove Image Background{' '}
            <span className="text-blue-600">Free</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            AI-powered background removal. Instant results, no signup required.
          </p>
        </div>

        {/* ── Upload / Processing / Result ── */}
        {status === 'idle' && (
          <UploadZone onFile={handleFile} />
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-medium mb-1">⚠️ Something went wrong</p>
              <p className="text-red-500 text-sm">{errorMsg}</p>
            </div>
            <UploadZone onFile={handleFile} />
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-white rounded-2xl p-20 text-center border border-gray-200 shadow-sm">
            <div className="flex justify-center mb-5">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700">AI is removing background…</p>
            <p className="text-gray-400 mt-2 text-sm">This usually takes 3–10 seconds</p>
          </div>
        )}

        {status === 'done' && originalUrl && resultUrl && (
          <ResultViewer
            originalUrl={originalUrl}
            resultUrl={resultUrl}
            originalName={originalName}
            onReset={handleReset}
          />
        )}

        {/* ── Features ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm">
              <div className="text-3xl mb-3" aria-hidden>{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* ── Use Cases ── */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perfect for Every Use Case
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((u) => (
              <div key={u.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3" aria-hidden>{u.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQ />
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 mt-20 py-8 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} BGRemover ·{' '}
          <span>Free online background remover</span> ·{' '}
          <span>Remove background from image free</span> ·{' '}
          <span>Transparent background maker</span>
        </p>
      </footer>
    </main>
  )
}
