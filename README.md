# Dictionary

[![Netlify Status](https://api.netlify.com/api/v1/badges/298f8b5e-17e0-4b69-8813-f83a0fd51a6a/deploy-status)](https://app.netlify.com/projects/damonzucconi-dictionary/deploys)

## Meta

- **State**: production
- **Production**:
  - **URL**: https://dictionary.blue
  - **URL**: https://dictionary.red
  - **URL**: https://dictionary.black
  - **URL**: https://dictionary.pink
  - **URL**: https://damonzucconi-dictionary.netlify.app (fallback mode: `blue`)
- **Host**: `https://app.netlify.com/projects/damonzucconi-dictionary/overview`
- **Deploys**: pushes to your default branch auto-deploy to production. [Manually trigger a deploy](https://app.netlify.com/projects/damonzucconi-dictionary/deploys)

## Local Development

```bash
yarn install
yarn dev
```

## Build

```bash
yarn build
```

Build does two things:

1. preprocesses raw dictionary data into shuffled, chunked files in `public/data`
2. builds the client app into `dist`

## Parameters

| Param       | Description                               | Type                     | Default                    |
| ----------- | ----------------------------------------- | ------------------------ | -------------------------- |
| `mode`      | Color/word-mode override                  | `red, blue, black, pink` | hostname / `blue` fallback |
| `direction` | Text flow direction                       | `up, down`               | `up`                       |
| `speed`     | Milliseconds-per-character timing factor  | `number`                 | `150`                      |
| `invert`    | Invert foreground/background color scheme | `true`                   | off                        |

## Domain-to-Mode Mapping

- `dictionary.red` → `red` (verbs)
- `dictionary.blue` → `blue` (nouns)
- `dictionary.black` → `black` (adjectives)
- `dictionary.pink` → `pink` (adverbs)

If hostname is not one of the above, mode falls back to `blue`.

## Caching

- `/data/manifest.json` → long-lived immutable cache
- `/data/*` → long-lived immutable cache
- `/assets/*` → long-lived immutable cache

Configured via `public/_headers` for Netlify.
