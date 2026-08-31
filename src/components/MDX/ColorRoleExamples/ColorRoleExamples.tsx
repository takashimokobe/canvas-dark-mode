import { useId, useState } from 'react'
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button'
import { FormField } from '@workday/canvas-kit-react/form-field'
import { Switch } from '@workday/canvas-kit-preview-react/switch'

import styles from './ColorRoleExamples.module.css'

export function AccentRoles() {
  return (
    <div className={styles.Accent}>
      <PrimaryButton size="medium">Publish</PrimaryButton>
      <SecondaryButton size="medium">Save draft</SecondaryButton>
      <TertiaryButton size="medium">Preview</TertiaryButton>
      <span className={styles.Caution}>Caution</span>
    </div>
  )
}

export function RoleSwitch() {
  const [on, setOn] = useState(true)

  return (
    <FormField orientation="horizontalStart">
      <FormField.Label>Notifications</FormField.Label>
      <FormField.Field>
        <FormField.Input
          as={Switch}
          checked={on}
          onChange={() => setOn(!on)}
        />
      </FormField.Field>
    </FormField>
  )
}

export function RoleForeground() {
  return (
    <div className={styles.Type}>
      <p className={styles.Heading}>Heading</p>
      <p className={styles.Body}>Body uses fg-default.</p>
      <p className={styles.Muted}>Muted uses fg-muted.</p>
      <a className={styles.Link} href="./dark">
        Dark mode
      </a>
    </div>
  )
}

export function RoleBorder() {
  const nameId = useId()

  return (
    <div className={styles.Row}>
      <label className={styles.Field} htmlFor={nameId}>
        <span>Name</span>
        <input
          className={styles.Input}
          id={nameId}
          type="text"
          name="role-border-name"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <figure className={styles.Tile}>
        <div className={styles.Well}>
          <div className={styles.Elevated} />
        </div>
        <figcaption>Elevated</figcaption>
      </figure>
    </div>
  )
}

export function RoleFocus() {
  return (
    <div className={styles.Row}>
      <TertiaryButton size="medium">Preview</TertiaryButton>
      <PrimaryButton size="medium" className={styles.FocusRing}>
        Publish
      </PrimaryButton>
    </div>
  )
}

export function RoleShadow() {
  return (
    <div className={styles.Well}>
      <div className={styles.Row}>
        <figure className={styles.Tile}>
          <div className={styles.Lift} data-depth="1" />
          <figcaption>Depth 1</figcaption>
        </figure>
        <figure className={styles.Tile}>
          <div className={styles.Lift} data-depth="3" />
          <figcaption>Depth 3</figcaption>
        </figure>
      </div>
    </div>
  )
}
