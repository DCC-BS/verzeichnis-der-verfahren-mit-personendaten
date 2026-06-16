# Verzeichnis der Verfahren mit Personendaten

Nuxt application for the Verzeichnis der Verfahren mit Personendaten.

## Option 1: Run directly (local dev)

```bash
bun install
bun run dev
```

## Option 2: Run locally with Docker

Build the image:

```bash
docker build -t verzeichnis-der-verfahren-mit-personendaten:local .
```

Run the container (pass the API key at runtime):

```bash
docker run --rm -p 8032:8032 \
  -e NUXT_BS_API_KEY="your-api-key" \
  verzeichnis-der-verfahren-mit-personendaten:local
```

Or load it from your local `.env` file:

```bash
docker run --rm -p 8032:8032 \
  -e NUXT_BS_API_KEY="$(grep NUXT_PUBLIC_BS_API_KEY .env | cut -d= -f2-)" \
  verzeichnis-der-verfahren-mit-personendaten:local
```

Then open [http://localhost:8032](http://localhost:8032).

## GitHub Container Registry workflow

The workflow in `.github/workflows/docker.yml` builds and pushes the Docker image to GitHub Container Registry (`ghcr.io`):

- Image: `ghcr.io/opendatabs/verzeichnis-der-verfahren-mit-personendaten`
- Tags: commit SHA and `latest` on the default branch
- Runs on pushes to `main`/`master`, on tags, and via manual dispatch
