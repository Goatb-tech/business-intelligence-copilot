# Business Intelligence Copilot

Local-first business lead intelligence app for finding local businesses, auditing their web presence, ranking opportunity, and generating actionable briefs.

## Current status

This is the first build slice.

- React + Vite dashboard
- Express + SQLite backend
- local run creation flow
- opportunity scoring and analytics
- AI brief generation with Ollama fallback

The Google Maps collector and website crawler are scaffolded next but not fully wired yet.

## Run locally

```bash
npm install
npm run dev
```

Client: `http://127.0.0.1:5173`

Server: `http://127.0.0.1:3001`

## Environment

Copy `.env.example` to `.env` if you want to change the Ollama model or port.

## CLI

```bash
npm run pipeline -- run-pipeline --query "dentist in Austin" --limit 12
```
