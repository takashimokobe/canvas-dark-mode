import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Mode = 'light' | 'dark'

export const BRANDS = [
  'default',
  'workday',
  'discord',
  'spotify',
  'airbnb',
] as const

export type Brand = (typeof BRANDS)[number]

export const PAGE_BACKGROUNDS = ['default', 'alt'] as const

export type PageBackground = (typeof PAGE_BACKGROUNDS)[number]

const LEGACY_MODE_STORAGE_KEY = 'theme'
const MODE_STORAGE_KEY = 'mode'
export const BRAND_STORAGE_KEY = 'brand'
export const PAGE_BG_STORAGE_KEY = 'page-bg'

const listeners = new Set<() => void>()
let mediaQuery: MediaQueryList | null = null
let onSystemThemeChange: (() => void) | null = null

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value)
}

export function isPageBackground(value: string): value is PageBackground {
  return (PAGE_BACKGROUNDS as readonly string[]).includes(value)
}

function isMode(value: string): value is Mode {
  return value === 'light' || value === 'dark'
}

function getSystemMode(): Mode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredMode(): Mode | null {
  const stored = localStorage.getItem(MODE_STORAGE_KEY)
  return stored !== null && isMode(stored) ? stored : null
}

function getPreferredMode(): Mode {
  return getStoredMode() ?? getSystemMode()
}

function getPreferredBrand(): Brand {
  const stored = localStorage.getItem(BRAND_STORAGE_KEY)
  return stored !== null && isBrand(stored) ? stored : 'default'
}

function getPreferredPageBackground(): PageBackground {
  const stored = localStorage.getItem(PAGE_BG_STORAGE_KEY)
  return stored !== null && isPageBackground(stored) ? stored : 'alt'
}

export function applyRootMode(mode: Mode) {
  const root = document.documentElement
  root.classList.toggle('light', mode === 'light')
  root.classList.toggle('dark', mode === 'dark')
  root.classList.remove('ui-light', 'ui-dark')
  root.style.colorScheme = mode
}

export function applyRootBrand(brand: Brand) {
  document.documentElement.setAttribute('data-brand', brand)
}

export function applyRootPageBackground(background: PageBackground) {
  document.documentElement.setAttribute('data-page-bg', background)
}

/** Disable transitions while new colors commit so the theme switch does not smear. */
function suppressTransitionsDuringThemeSwap() {
  const style = document.createElement('style')
  style.appendChild(
    document.createTextNode('*,*::before,*::after{transition:none !important}'),
  )
  document.head.appendChild(style)
  void document.body.offsetHeight

  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove())
  })
}

function ensureSystemThemeListener() {
  if (mediaQuery != null) return

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  onSystemThemeChange = () => {
    if (getStoredMode() != null) return
    suppressTransitionsDuringThemeSwap()
    applyRootMode(getSystemMode())
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
    localStorage.removeItem(LEGACY_MODE_STORAGE_KEY)
    localStorage.setItem(MODE_STORAGE_KEY, next)
    suppressTransitionsDuringThemeSwap()
    applyRootMode(next)
    notifyRootPreferenceListeners()
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [setMode, mode])

  return { mode, setMode, toggleMode }
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  switch (target.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
    case 'SELECT':
      return true
    default:
      return false
  }
}

export function useModeKeyboardShortcut() {
  const { toggleMode } = useMode()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.code !== 'KeyD') return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      toggleMode()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleMode])
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
    applyRootBrand(next)
    notifyRootPreferenceListeners()
  }, [])

  return { brand, setBrand }
}

export function usePageBackground() {
  const background = useSyncExternalStore<PageBackground>(
    subscribeToRootPreferences,
    getPreferredPageBackground,
    () => 'alt',
  )

  const setBackground = useCallback((next: PageBackground) => {
    localStorage.setItem(PAGE_BG_STORAGE_KEY, next)
    suppressTransitionsDuringThemeSwap()
    applyRootPageBackground(next)
    notifyRootPreferenceListeners()
  }, [])

  return { background, setBackground }
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
  return `(function(){try{localStorage.removeItem('${LEGACY_MODE_STORAGE_KEY}');var r=document.documentElement;var stored=localStorage.getItem('${MODE_STORAGE_KEY}');var mode=stored==='light'||stored==='dark'?stored:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.classList.remove('ui-dark','ui-light','light','dark');r.classList.add(mode);r.style.colorScheme=mode;var b=localStorage.getItem('${BRAND_STORAGE_KEY}');var brands=${JSON.stringify(BRANDS)};var brand=brands.indexOf(b)>-1?b:'default';r.setAttribute('data-brand',brand);var bg=localStorage.getItem('${PAGE_BG_STORAGE_KEY}');r.setAttribute('data-page-bg',bg==='default'?'default':'alt');}catch(e){}})();`
}
