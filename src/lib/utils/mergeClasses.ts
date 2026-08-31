export type ClassValue =
  string | false | 0 | null | undefined | ClassValue[] | Record<string, unknown>

export function mergeClasses(...values: ClassValue[]): string {
  const classNames: string[] = []

  for (const value of values) {
    pushClassNames(classNames, value)
  }

  return classNames.join(' ')
}

export const cn = mergeClasses

function pushClassNames(classNames: string[], value: ClassValue): void {
  if (!value) {
    return
  }

  if (typeof value === 'string') {
    classNames.push(value)
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      pushClassNames(classNames, item)
    }
    return
  }

  for (const [className, enabled] of Object.entries(value)) {
    if (className && enabled) {
      classNames.push(className)
    }
  }
}
