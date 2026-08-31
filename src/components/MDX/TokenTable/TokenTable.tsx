import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import { checkIcon, copyIcon } from '@workday/canvas-system-icons-web'

import {
  COLOR_ROLE_TOKENS,
  colorRoleCaption,
  formatAliasName,
  formatVariableName,
  isColorRoleGroup,
} from './colorRoleTokens'
import type { ColorRoleGroup, ColorRoleToken } from './colorRoleTokens'

import styles from './TokenTable.module.css'

const ICON_SIZE = 16
const COPIED_MS = 1600

type TokenTableProps = {
  group: string
}

export function TokenTable({ group }: TokenTableProps) {
  if (!isColorRoleGroup(group)) {
    throw new Error(`Unknown color role group: ${group}`)
  }

  return <ColorRoleTable group={group} />
}

function ColorRoleTable({ group }: { group: ColorRoleGroup }) {
  const captionId = useId()
  const tokens = COLOR_ROLE_TOKENS[group]
  const caption = colorRoleCaption(group)

  return (
    <div className={styles.Wrap}>
      <table className={styles.Table} aria-labelledby={captionId}>
        <caption id={captionId} className={styles.Caption}>
          {caption}
        </caption>
        <thead>
          <tr>
            <th className={styles.SwatchHead} scope="col">
              Color
            </th>
            <th className={styles.NameHead} scope="col">
              Variable
            </th>
            <th className={styles.AliasHead} scope="col">
              Reference
            </th>
            <th className={styles.UiHead} scope="col">
              UI
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <TokenRow key={token.name} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TokenRow({ token }: { token: ColorRoleToken }) {
  const name = formatVariableName(token.name)

  return (
    <tr>
      <td className={styles.SwatchCell}>
        <span
          className={styles.Swatch}
          style={{ '--swatch': `var(${token.cssVar})` } as CSSProperties}
          aria-hidden
        />
      </td>
      <th className={styles.NameCell} scope="row">
        <div className={styles.Name}>
          {name}
          <CopyName name={name} />
        </div>
      </th>
      <td className={styles.AliasCell}>
        <Alias
          light={formatAliasName(token.light)}
          dark={formatAliasName(token.dark)}
        />
      </td>
      <td className={styles.UiCell}>{token.description}</td>
    </tr>
  )
}

function Alias({ light, dark }: { light: string; dark: string }) {
  if (!light && !dark) {
    return null
  }

  if (light === dark) {
    return light
  }

  return (
    <>
      {light ? <span className={styles.AliasLight}>{light}</span> : null}
      {dark ? <span className={styles.AliasDark}>{dark}</span> : null}
    </>
  )
}

function CopyName({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>(0)

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  const copy = () => {
    void navigator.clipboard.writeText(name).then(() => {
      setCopied(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_MS)
    })
  }

  return (
    <button
      type="button"
      className={styles.Copy}
      aria-label={copied ? `Copied ${name}` : `Copy ${name}`}
      onClick={copy}
    >
      <span className={styles.Icons} data-copied={copied || undefined}>
        <span className={styles.Icon} data-state="copy" aria-hidden>
          <SystemIcon icon={copyIcon} size={ICON_SIZE} color="currentColor" />
        </span>
        <span className={styles.Icon} data-state="check" aria-hidden>
          <SystemIcon icon={checkIcon} size={ICON_SIZE} color="currentColor" />
        </span>
      </span>
    </button>
  )
}
