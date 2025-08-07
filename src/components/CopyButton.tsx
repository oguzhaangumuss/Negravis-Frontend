'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-2 bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 ${className}`}
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span className="text-sm">Copy</span>
        </>
      )}
    </button>
  )
}