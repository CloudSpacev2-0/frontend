# frontend
React (Vite) shop UI for the "Beyond Localhost" Azure demo.

- API addresses come from `config.js`, written at container start from the `PRODUCT_API_URL` and `ORDER_API_URL` environment variables, so one image works everywhere.
- Local dev: `npm install && npm run dev` (expects the APIs on localhost:3001 / 3002).
- CI: every push to `main` builds a `linux/amd64` image and pushes `<dockerhub-user>/frontend:latest` and `:<short-sha>`.
  Needs repo secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
- Deployed to Azure Container Apps by the `infra` repo.
