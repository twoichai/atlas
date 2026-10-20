# Atlas — AI for study

A student focused AI tool discovery prototype built with React and Vite. It includes an explore page, a comparison page, and a short recommendation flow. Ranking and rating values are mock data for the prototype.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

## Deploy to Vercel

This project is configured for Vercel with the Vite framework, `npm run build` as the build command, and `dist` as the output directory.

1. Push this repository to a Git provider such as GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings and deploy. No environment variables are required for this prototype.

Future changes pushed to the connected branch will trigger a new deployment. The current three views use client-side state and need no server routes.
