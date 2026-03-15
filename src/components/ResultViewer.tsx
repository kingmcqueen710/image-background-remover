'use client'

import { useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

type BgColor = 'transparent' | 'white' | 'black'

interface Props {
  originalUrl: string
  resultUrl: string
  originalName: string
  onReset: () => void
}

const BG_OPTIONS: { value: BgColor; label: string; cls: string }[] = [
  { value: 'transparent', label: 'Transparent', cls: 'checkerboard' },
  { value: 'white', label: 'White', cls: 'bg-white' },
  { value: 'black', label: 'Black', cls: 'bg-black' },
]

export default function ResultViewer({ originalUrl, resultUrl, originalName, onReset }: Props) {
  const [bg, setBg] = useState<BgColor>('transparent')

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `removed-bg-${originalName}.png`
    a.click()
  }

  const currentBg = BG_OPTIONS.find((o) => o.value === bg)!

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Compare slider */}
      <div className="relative">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage src={originalUrl} alt="Original image" />
          }
          itemTwo={
            <div className={`w-full h-full ${currentBg.cls}`}>
              <img
                src={resultUrl}
                alt="Background removed"
                className="w-full h-full object-contain"
              />
            </div>
          }
          style={{ height: '420px' }}
        />
        {/* Labels */}
        <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
          Original
        </span>
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
          Removed BG
        </span>
      </div>

      {/* Controls */}
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
        {/* Background picker */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">Preview on:</span>
          <div className="flex gap-2">
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBg(opt.value)}
                title={opt.label}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all
                  ${opt.cls}
                  ${bg === opt.value ? 'border-blue-500 scale-110 shadow-md' : 'border-gray-300 hover:border-gray-400'}
                `}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            ↩ Try another
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm font-semibold shadow-sm"
          >
            ⬇ Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
