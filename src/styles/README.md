# Styles

> Work in progress — token names and file layout may change.

Why surfaces and alphas work the way they do is in [Dark mode](../content/docs/dark.mdx). Token names live in [Color roles](../content/docs/roles.mdx).

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
- Brand neutrals follow the tenant: `default` maps to Neutral, `workday` maps to Slate, and Airbnb, Spotify, and Discord tint Neutral with `--cnvs-brand-neutral-hue` and a small `--cnvs-brand-neutral-chroma` so chrome stays grey next to the primary.
- Brand tokens are plain solids (`-*` light, `dark-*` dark); `theme/color.css` picks between them with `light-dark()`.

## Runtime theming

Set both on `<html>` (see `src/routes/__root.tsx`):

```html
<html class="dark" data-brand="spotify"></html>
```

- `class` — `light` or `dark`. Sets `color-scheme` so `light-dark()` tokens follow the Mode control, not only the OS.
- `data-brand` — one of `default`, `workday`, `airbnb`, `spotify`, `discord`. Use `default` (the Sana theme) unless a tenant brand is required.

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
