# Supabase Storage tus uploads

This repo contains example in both JavaScript (using NodeJS) and Python.

The JavaScript example uses [tus-js-client](https://github.com/tus/tus-js-client) and the Python example uses [tus-py-client](https://github.com/tus/tus-py-client).

This project is using [pnpm](https://pnpm.io/) (JavaScript) and [uv](https://docs.astral.sh/uv/) (Python) for dependency management.

## How to test

You can test with local Supabase if you have Docker installed on your system.

### Installing JavaScript dependencies

```sh
pnpm install
```

### Starting Supabase local instance

```sh
npx supabase start
```

### Testing JavaScript tus upload

```sh
node app.js
```

### Testing Python tus upload

```sh
uv run app.py
```
