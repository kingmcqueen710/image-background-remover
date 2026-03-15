'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'
type BgColor = 'transparent' | 'white' | 'black'

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [bgColor, setBgColor] = useState<BgColor>('transparent')
  const [originalName, setOriginalName] = useState<string>('image')

  const processImage = useCallback(async (file: File) => {
    setOriginalName(file.name.replace(/\.[^.]+$/, ''))
    setOriginalUrl(URL.createObjectURL(file))
    setResultUrl(null)
    setStatus('uploading')
    const formData = new FormData()
    formData.append('image', file)
    try {
      setStatus('processing')
      const res = await fetch('/api/remove-bg', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Processing failed')
      setResultUrl(`data:image/png;base64,${data.result}`)
      setStatus('done')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error')
      setStatus('error')
    }
  }, [])

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) processImage(accepted[0])
  }, [processImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `removed-bg-${originalName}.png`
    a.click()
  }

  const bgClass: Record<BgColor, string> = {
    transparent: 'checkerboard',
    white: 'bg-white',
    black: 'bg-black',
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <span className="font-bold text-xl text-gray-900">BGRemover</span>
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Remove Image Background Free
          </h1>
          <p className="text-xl text-gray-500">
            AI-powered background removal. Instant results, no signup required.
          </p>
        </div>

        {(status === 'idle' || status === 'error') && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
            <p className="text-gray-400 mb-4">or click to browse</p>
            <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP · Max 10MB</p>
            {status === 'error' && (
              <p className="mt-4 text-red-500 text-sm">⚠️ {errorMsg} — please try again</p>
            )}
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
            <div className="text-5xl mb-4 animate-spin inline-block">⚙️</div>
            <p className="text-lg font-medium text-gray-700">
              {status === 'uploading' ? 'Uploading...' : 'AI is removing background...'}
            </p>
            <p className="text-gray-400 mt-2 text-sm">This usually takes 3–10 seconds</p>
          </div>
        )}

        {status === 'done' && originalUrl && resultUrl && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" />}
              itemTwo={
                <div className={`w-full h-full ${bgClass[bgColor]}`}>
                  <img src={resultUrl} alt="Background removed" className="w-full h-full object-contain" />
                </div>
              }
              style={{ height: '400px' }}
            />
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Preview background:</span>
                {(['transparent', 'white', 'black'] as BgColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      bgColor === c ? 'border-blue-500 scale-110' : 'border-gray-300'
                    } ${c === 'transparent' ? 'checkerboard' : c === 'white' ? 'bg-white' : 'bg-black'}`}
                    title={c}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setStatus('idle'); setOriginalUrl(null); setResultUrl(null) }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Try another image
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  ⬇️ Download PNG
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: '⚡', title: 'Instant Results', desc: 'AI processes your image in seconds, no waiting.' },
            { icon: '🆓', title: '100% Free', desc: 'No signup, no credit card. Just upload and download.' },
            { icon: '🎯', title: 'High Accuracy', desc: 'Powered by advanced AI for clean, precise cutouts.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Perfect for Every Use Case</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🛍️', title: 'E-commerce', desc: 'Create clean product photos with white or transparent backgrounds for Amazon, Shopify, and more.' },
              { icon: '🪪', title: 'ID Photos', desc: 'Remove backgrounds from portraits and headshots for professional use.' },
              { icon: '🎨', title: 'Design', desc: 'Extract subjects from photos to use in your design projects, presentations, or social media.' },
            ].map((u) => (
              <div key={u.title} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">{u.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is this background remover really free?', a: 'Yes, completely free. No signup or credit card required.' },
              { q: 'What image formats are supported?', a: 'We support JPG, PNG, and WEBP files up to 10MB.' },
              { q: 'How accurate is the AI background removal?', a: 'Our AI handles most subjects well including people, products, and animals. Complex backgrounds may vary.' },
              { q: 'Are my images stored or shared?', a: 'No. Your images are processed and immediately discarded. We do not store or share your photos.' },
              { q: 'Can I use the results commercially?', a: 'Yes, you own the output. Use it however you like.' },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-gray-500 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 BGRemover · Free online background remover · Remove background from image free</p>
      </footer>
    </main>
  )
}
