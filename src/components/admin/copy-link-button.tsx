'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CopyLinkButtonProps {
  invoiceId: string
}

/**
 * 견적서 클라이언트 공유 링크 복사 버튼 (Client Component)
 * navigator.clipboard.writeText()로 /invoice/[id] URL 복사
 * 복사 완료 시 Check 아이콘으로 1.5초간 전환 후 복원
 */
export function CopyLinkButton({ invoiceId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/invoice/${invoiceId}`

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // 구형 브라우저 폴백: document.execCommand
      try {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      } catch {
        toast.error('링크 복사에 실패했습니다.')
        return
      }
    }

    toast.success('링크가 클립보드에 복사되었습니다.')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="견적서 공유 링크 복사"
      title={copied ? '복사됨' : '링크 복사'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  )
}
