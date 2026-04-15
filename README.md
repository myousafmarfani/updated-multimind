# MultiMind Next.js Rebuild

Production-ready MultiMind implementation with Next.js App Router frontend and four FastAPI model services.

## Stack

- Frontend: Next.js 16, TypeScript, App Router, Tailwind CSS v4
- Motion: Framer Motion
- Data state: TanStack Query
- API validation: Zod
- Model services: Python FastAPI (Gemini, ChatGPT, Claude, Grok)
- Testing: Jest (unit)

## Features Implemented

- Landing page and chat page
- Parallel multi-model requests with isolated per-model failure handling
- Four independent response panes and conversation history per model
- Health checks per model with badge status
- Prompt improvement endpoint
- SEO metadata, Open Graph, robots.txt, sitemap.xml, JSON-LD
- One command full-stack local startup

## Project Structure

- apps/web: Next.js app
- services/gemini-service: FastAPI service
- services/chatgpt-service: FastAPI service
- services/claude-service: FastAPI service
- services/grok-service: FastAPI service
- services/requirements.txt: Python dependencies

## Setup

1. Install web dependencies:
   - npm --prefix apps/web install
2. Install Python dependencies:
   - python -m pip install -r services/requirements.txt
3. Copy env template:
   - copy .env.example .env
   - copy apps/web/.env.local.example apps/web/.env.local
4. Start full stack:
   - npm run dev

## Commands

- npm run dev: Starts web app + all four FastAPI services
- npm run stop: Stops default dev ports
- npm run lint: Runs web linting
- npm run test: Runs web unit tests
- npm run build: Builds web app

## Health Endpoints

- GET /api/gemini/health
- GET /api/chatgpt/health
- GET /api/claude/health
- GET /api/grok/health

## Model Endpoints

- POST /api/gemini
- POST /api/chatgpt
- POST /api/claude
- POST /api/grok
- POST /api/improve-prompt

Request shape:

- prompt: string
- instructions?: string
- conversationHistory?: [{ role: "user" | "assistant", content: string }]
- userName?: string

Response shape:

- response: string
- model: string

## Reliability Notes

- Each model pane updates independently; one failure does not block other panes.
- Missing model keys do not crash startup; service health reports degraded mode.
- API routes enforce payload validation with Zod.

## Testing Coverage

- Unit tests for prompt improvement and request schemas

## Deployment Notes

- Deploy Next.js app and expose Python services reachable from the web runtime.
- Set service URLs and API keys in runtime environment.
- Ensure CORS/network policy allows Next.js server to reach each Python service.
