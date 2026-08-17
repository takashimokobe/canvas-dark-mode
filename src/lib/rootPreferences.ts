import { useCallback, useSyncExternalStore } from 'react'

export type Mode = 'light' | 'dark'

export const BRANDS = [
  'default',
  'workday',
  'airbnb',
  'spotify',
  'discord',
] as const

export type Brand = (typeof BRANDS)[number]

/** @deprecated Theme follows `prefers-color-scheme`; kept for clearing legacy values. */
export const MODE_STORAGE_KEY = 'theme'
export const BRAND_STORAGE_KEY = 'brand'
export const BRANDED_STORAGE_KEY = 'branded'
export const DEBUG_STORAGE_KEY = 'debug'

export const BRANDED_BRANDS = BRANDS.filter(
  (brand): brand is Exclude<Brand, 'default'> => brand !== 'default',
)

const listeners = new Set<() => void>()
let mediaQuery: MediaQueryList | null = null
let onSystemThemeChange: (() => void) | null = null

/** Session-only override from the Dark mode switch; cleared when OS theme changes. */
let sessionModeOverride: Mode | null = null

function isBrand(value: string | null): value is Brand {
  return value !== null && (BRANDS as readonly string[]).includes(value)
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
  return isBrand(stored) ? stored : 'default'
}

function getPreferredBranded(): boolean {
  return localStorage.getItem(BRANDED_STORAGE_KEY) === 'true'
}

export function resolveEffectiveBrand(branded: boolean, brand: Brand): Brand {
  if (!branded) return 'default'
  return brand === 'default' ? BRANDED_BRANDS[0] : brand
}

function getPreferredDebug(): boolean {
  const stored = localStorage.getItem(DEBUG_STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return true
}

/**
 * A theme flip (mode or brand) changes color/background/border on nearly
 * every element at once, so every color transition fires together and the
 * switch smears. Disable transitions while the new colors commit, restore
 * after paint.
 */
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
    // Browser preference always wins when it changes.
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
    // Drop legacy sticky theme so reloads follow the browser again.
    localStorage.removeItem(MODE_STORAGE_KEY)
    suppressTransitionsDuringThemeSwap()
    notifyRootPreferenceListeners()
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [setMode, mode])

  return { mode, setMode, toggleMode }
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

  const cycleBrand = useCallback(() => {
    const index = BRANDS.indexOf(brand)
    const next = BRANDS[(index + 1) % BRANDS.length] ?? 'default'
    setBrand(next)
  }, [setBrand, brand])

  return { brand, setBrand, cycleBrand }
}

export function useBranded() {
  const branded = useSyncExternalStore<boolean>(
    subscribeToRootPreferences,
    getPreferredBranded,
    () => false,
  )

  const setBranded = useCallback((next: boolean) => {
    localStorage.setItem(BRANDED_STORAGE_KEY, String(next))
    suppressTransitionsDuringThemeSwap()
    notifyRootPreferenceListeners()
  }, [])

  const toggleBranded = useCallback(() => {
    setBranded(!branded)
  }, [setBranded, branded])

  return { branded, setBranded, toggleBranded }
}

export function useEffectiveBrand() {
  const { brand, setBrand } = useBrand()
  const { branded, setBranded } = useBranded()
  const effectiveBrand = resolveEffectiveBrand(branded, brand)

  const setBrandedTheme = useCallback(
    (next: boolean) => {
      setBranded(next)
      if (next) {
        if (brand === 'default') {
          setBrand(BRANDED_BRANDS[0])
        }
        return
      }
      setBrand('default')
    },
    [brand, setBrand, setBranded],
  )

  return {
    brand,
    branded,
    effectiveBrand,
    setBrand,
    setBrandedTheme,
  }
}

export function useDebug() {
  const debug = useSyncExternalStore<boolean>(
    subscribeToRootPreferences,
    getPreferredDebug,
    () => true,
  )

  const setDebug = useCallback((next: boolean) => {
    localStorage.setItem(DEBUG_STORAGE_KEY, String(next))
    notifyRootPreferenceListeners()
  }, [])

  const toggleDebug = useCallback(() => {
    setDebug(!debug)
  }, [setDebug, debug])

  return { debug, setDebug, toggleDebug }
}

export function formatBrandLabel(brand: Brand) {
  switch (brand) {
    case 'default':
      return 'Default'
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
  return `(function(){try{localStorage.removeItem('${MODE_STORAGE_KEY}');document.documentElement.classList.remove('ui-dark','ui-light');document.documentElement.style.colorScheme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var branded=localStorage.getItem('${BRANDED_STORAGE_KEY}')==='true';var b=localStorage.getItem('${BRAND_STORAGE_KEY}');var brands=${JSON.stringify(BRANDS)};var brandedBrands=${JSON.stringify(BRANDED_BRANDS)};var brand=brands.indexOf(b)>-1?b:'default';var effective=branded?(brand==='default'?brandedBrands[0]:brand):'default';document.documentElement.setAttribute('data-brand',effective);}catch(e){}})();`
}
