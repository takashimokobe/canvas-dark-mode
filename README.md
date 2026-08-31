# Canvas Dark Mode

Paired light and dark [Canvas Kit](https://workday.github.io/canvas-kit/) specimens, essays on this theme, and a chat that answers from those docs.

Theme (mode, brand, page background) is in the command menu: `⌘K` / `Ctrl+K`. `D` toggles light and dark when you are not typing.

## Requirements

- [Node.js](https://nodejs.org/) 22 or later
- [pnpm](https://pnpm.io/installation) 10 or later

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

The app is at [http://127.0.0.1:3000/canvas-dark-mode/](http://127.0.0.1:3000/canvas-dark-mode/). Theme follows `prefers-color-scheme` until you override it. Brand is stored in `localStorage`.

Pushes to `main` publish a static build to [GitHub Pages](https://takashimokobe.github.io/canvas-dark-mode/).

## Other scripts

```bash
pnpm build     # production build
pnpm preview   # serve the production build
pnpm lint      # ESLint
pnpm format    # Prettier + ESLint --fix
pnpm check     # Prettier check
```

## Tokens

Semantic tokens, brand ramps, and `@custom-media` names live in [`src/styles`](src/styles). See [`src/styles/README.md`](src/styles/README.md) for layer order and how `data-brand` / `color-scheme` work.
