import { useCallback, useSyncExternalStore } from 'react'

export type Mode = 'light' | 'dark'

export const BRANDS = [
  'default',
  'workday',
  'discord',
  'spotify',
  'airbnb',
] as const

export type Brand = (typeof BRANDS)[number]

const LEGACY_MODE_STORAGE_KEY = 'theme'
export const BRAND_STORAGE_KEY = 'brand'

const listeners = new Set<() => void>()
let mediaQuery: MediaQueryList | null = null
let onSystemThemeChange: (() => void) | null = null

let sessionModeOverride: Mode | null = null

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value)
}

function getSystemMode(): Mode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getPreferredMode(): Mode {
  return sessionModeOverride ?? getSystemMode()
}

function getPreferredBrand(): Brand {
  const stored = localStorage.getItem(BRAND_STORAGE_KEY)
  return stored !== null && isBrand(stored) ? stored : 'default'
}

/** Disable transitions while new colors commit so the theme switch does not smear. */
function suppressTransitionsDuringThemeSwap() {
  const style = document.createElement('style')
  style.appendChild(
    document.createTextNode('*,*::before,*::after{transition:none !important}'),
  )
  document.head.appendChild(style)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove())
  })
}

function ensureSystemThemeListener() {
  if (mediaQuery != null) return

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  onSystemThemeChange = () => {
    sessionModeOverride = null
    suppressTransitionsDuringThemeSwap()
    notifyRootPreferenceListeners()
  }
  mediaQuery.addEventListener('change', onSystemThemeChange)
}

function notifyRootPreferenceListeners() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribeToRootPreferences(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  ensureSystemThemeListener()

  return () => {
    listeners.delete(onStoreChange)
    if (
      listeners.size === 0 &&
      mediaQuery != null &&
      onSystemThemeChange != null
    ) {
      mediaQuery.removeEventListener('change', onSystemThemeChange)
      mediaQuery = null
      onSystemThemeChange = null
    }
  }
}

export function useMode() {
  const mode = useSyncExternalStore<Mode>(
    subscribeToRootPreferences,
    getPreferredMode,
    () => 'light',
  )

  const setMode = useCallback((next: Mode) => {
    sessionModeOverride = next
    localStorage.removeItem(LEGACY_MODE_STORAGE_KEY)
    suppressTransitionsDuringThemeSwap()
    notifyRootPreferenceListeners()
  }, [])

  return { mode, setMode }
}

export function useBrand() {
  const brand = useSyncExternalStore<Brand>(
    subscribeToRootPreferences,
    getPreferredBrand,
    () => 'default',
  )

  const setBrand = useCallback((next: Brand) => {
    localStorage.setItem(BRAND_STORAGE_KEY, next)
    suppressTransitionsDuringThemeSwap()
    notifyRootPreferenceListeners()
  }, [])

  return { brand, setBrand }
}

export function formatBrandLabel(brand: Brand) {
  switch (brand) {
    case 'default':
      return 'None'
    case 'workday':
      return 'Workday'
    case 'airbnb':
      return 'Airbnb'
    case 'spotify':
      return 'Spotify'
    case 'discord':
      return 'Discord'
    default: {
      const unreachable: never = brand
      return unreachable
    }
  }
}

export function buildRootInitScript() {
  return `(function(){try{localStorage.removeItem('${LEGACY_MODE_STORAGE_KEY}');document.documentElement.classList.remove('ui-dark','ui-light');document.documentElement.style.colorScheme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var b=localStorage.getItem('${BRAND_STORAGE_KEY}');var brands=${JSON.stringify(BRANDS)};var brand=brands.indexOf(b)>-1?b:'default';document.documentElement.setAttribute('data-brand',brand);}catch(e){}})();`
}
