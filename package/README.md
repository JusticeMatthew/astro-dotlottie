# `astro-dotlottie`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) for loading and using Dotlottie animations

## Usage

### Prerequisites

An Astro project

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-dotlottie
```

```bash
npx astro add astro-dotlottie
```

```bash
yarn astro add astro-dotlottie
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-dotlottie
```

```bash
npm install astro-dotlottie
```

```bash
yarn add astro-dotlottie
```

2. Add the integration to your astro config

```diff
+import integration from "astro-dotlottie";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/MIT/blob/main/LICENSE). Made with ❤️ by [Matthew Justice](https://github.com/justicematthew).

## Acknowledgements

- Created using [astro-integration-template](https://github.com/florian-lefebvre/astro-integration-template).