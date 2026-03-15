'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onFile: (file: File) => void
  disabled?: boolean
}

export default function UploadZone({ onFile, disabled }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0])
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
        transition-all duration-200 select-none
        ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-5xl mb-4">🖼️</div>
      <p className="text-lg font-semibold text-gray-700 mb-2">
        {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
      </p>
      <p className="text-gray-400 mb-5">or</p>
      <span className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
        Browse files
      </span>
      <p className="mt-5 text-xs text-gray-400">Supports JPG, PNG, WEBP · Max 10 MB</p>
    </div>
  )
}
