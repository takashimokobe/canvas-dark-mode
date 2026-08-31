import type { ComponentProps } from 'react'

function resolveDocImageSrc(src?: string) {
  if (!src) {
    return src
  }

  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src
  }

  const base = import.meta.env.BASE_URL
  if (src.startsWith(base)) {
    return src
  }

  const path = src.replace(/^\.\//, '').replace(/^\//, '')
  return `${base}${path}`
}

export function MdxImage({ src, alt, ...props }: ComponentProps<'img'>) {
  return <img src={resolveDocImageSrc(src)} alt={alt ?? ''} {...props} />
}
