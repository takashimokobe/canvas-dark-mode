import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'

import styles from './Response.module.css'

const markdownComponents: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
}

/** Markdown body for assistant replies. */
export function Response({ text }: { text: string }) {
  return (
    <div className={styles.Response}>
      <Markdown components={markdownComponents}>{text}</Markdown>
    </div>
  )
}
