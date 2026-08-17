# Canvas Dark Mode

A live gallery of [Canvas Kit](https://workday.github.io/canvas-kit/) components on a tokenized light/dark theme. Use it to review specimens across brands (`None`, Workday, Discord, Spotify, Airbnb) and color schemes.

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

The gallery is at [http://localhost:3000](http://localhost:3000). Theme follows `prefers-color-scheme` until you override it with the Mode control. Brand is stored in `localStorage`.

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
