import { useId } from 'react'
import { MDXContent } from '@content-collections/mdx/react'
import { Divider } from '@workday/canvas-kit-preview-react'

import { mdxComponents } from './mdxComponents'
import styles from './MDX.module.css'

type MDXProps = {
  title: string
  description: string
  code: string
}

export function MDX({ title, description, code }: MDXProps) {
  const titleId = useId()

  return (
    <article className={styles.Article} aria-labelledby={titleId}>
      <h1 id={titleId} className={styles.Title}>
        {title}
      </h1>
      <p className={styles.Lead}>{description}</p>
      <Divider
        cs={{
          marginBlockEnd: 'var(--cnvs-sys-padding-lg)',
          borderColor: 'var(--cnvs-sys-color-border-default)',
          borderWidth: '2px',
        }}
      />
      <div className={styles.Body}>
        <MDXContent code={code} components={mdxComponents} />
      </div>
    </article>
  )
}
