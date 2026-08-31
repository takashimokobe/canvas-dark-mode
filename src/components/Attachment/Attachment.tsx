import { useEffect, useState } from 'react'
import { TertiaryButton } from '@workday/canvas-kit-react/button'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import { documentFooterIcon, xIcon } from '@workday/canvas-system-icons-web'

import { formatFileSize } from '@/lib/chat/send'

import styles from './Attachment.module.css'

export interface AttachmentProps {
  file: File
  onRemove?: () => void
}

type PreviewKind = 'image' | 'video' | 'file'

function getPreviewKind(file: File): PreviewKind {
  if (file.type.startsWith('image/')) {
    return 'image'
  }
  if (file.type.startsWith('video/')) {
    return 'video'
  }
  return 'file'
}

function fileKind(file: File) {
  const extension = file.name.split('.').pop()
  if (extension && extension !== file.name) {
    return extension.toUpperCase()
  }

  const subtype = file.type.split('/')[1]
  return subtype ? subtype.toUpperCase() : 'FILE'
}

function useObjectUrl(file: File, enabled: boolean) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!enabled) {
      setUrl('')
      return
    }

    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => {
      URL.revokeObjectURL(next)
    }
  }, [enabled, file])

  return url
}

export function Attachment({ file, onRemove }: AttachmentProps) {
  const kind = getPreviewKind(file)
  const [previewFailed, setPreviewFailed] = useState(false)
  const preview = previewFailed ? 'file' : kind
  const objectUrl = useObjectUrl(file, preview !== 'file')
  const meta = `${fileKind(file)} · ${formatFileSize(file.size)}`

  let media = null
  switch (preview) {
    case 'image':
      media = objectUrl ? (
        <img
          className={styles.Media}
          src={objectUrl}
          alt=""
          onError={() => setPreviewFailed(true)}
        />
      ) : null
      break
    case 'video':
      media = objectUrl ? (
        <video
          className={styles.Media}
          src={objectUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onError={() => setPreviewFailed(true)}
        />
      ) : null
      break
    case 'file':
      media = (
        <span className={styles.FileIcon} aria-hidden>
          <SystemIcon
            icon={documentFooterIcon}
            size="md"
            color="var(--cnvs-sys-color-fg-default)"
          />
        </span>
      )
      break
    default: {
      const _exhaustive: never = preview
      return _exhaustive
    }
  }

  return (
    <div className={styles.Attachment} data-preview={preview}>
      <div className={styles.Preview}>{media}</div>
      <div className={styles.Body}>
        <span className={styles.Name}>{file.name}</span>
        <span className={styles.Meta}>{meta}</span>
      </div>
      {onRemove ? (
        <div className={styles.Remove}>
          <Tooltip title={`Remove ${file.name}`}>
            <TertiaryButton
              type="button"
              size="extraSmall"
              icon={xIcon}
              aria-label={`Remove ${file.name}`}
              onClick={onRemove}
            />
          </Tooltip>
        </div>
      ) : null}
    </div>
  )
}
