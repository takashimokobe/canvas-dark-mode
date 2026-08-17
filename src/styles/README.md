# Styles

> Work in progress — token names and file layout may change.

Layers load in order via `index.css`: **reset** → **base** → **brand** → **theme** → **deprecated** → **components** → **layouts**.

| Folder        | Contents                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `core/`       | Reset.                                                                                            |
| `base/`       | Primitives: palettes, size, motion, opacity, fonts.                                               |
| `brand/`      | Per-brand `--cnvs-brand-*` ramps, keyed by `[data-brand]`.                                        |
| `theme/`      | Semantic `--cnvs-sys-*` tokens, breakpoints, and `@custom-media`. `light-dark()` lives only here. |
| `deprecated/` | Old Canvas Kit names aliased to current tokens, in their own layer.                               |

## Brands

- `shared.css` holds everything common: status ramps, neutrals, action, and focus tokens. Per-brand files map only `--cnvs-brand-primary-*`.
- The default brand uses gray neutrals; tenant brands swap to slate.
- Brand tokens are plain solids (`-*` light, `dark-*` dark); `theme/color.css` picks between them with `light-dark()`.

## Runtime theming

Set both on `<html>` (see `src/routes/__root.tsx`):

```html
<html data-brand="spotify" style="color-scheme: dark"></html>
```

- `data-brand` — one of `default`, `workday`, `airbnb`, `spotify`, `discord`. Use `default` (the Sana theme) unless a tenant brand is required.
- `color-scheme` — `light` or `dark`; omit to follow `prefers-color-scheme`.

## Custom media

`theme/media.css` defines `@custom-media` names (motion, contrast, breakpoints, pointer). PostCSS expands them in every CSS file, including CSS modules, via `@csstools/postcss-global-data`.

```css
@media (--md-n-above) {
}
@media (--highContrast) {
}
@media (--motionNotOK) {
}
```
