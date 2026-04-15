from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

import requests
from fastapi import FastAPI
from pydantic import BaseModel, Field

SERVICE_ID = "claude"
MODEL_NAME = os.getenv("google/gemma-4-26b-a4b-it:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def load_env_file() -> None:
    root_dir = Path(__file__).resolve().parents[2]
    for candidate in (root_dir / ".env", root_dir / ".env.example"):
        if not candidate.exists():
            continue

        for raw_line in candidate.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_env_file()
API_KEY = os.getenv("OPENROUTER_API_KEY_02", "")
SITE_URL = os.getenv("OPENROUTER_SITE_URL") or os.getenv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
SITE_TITLE = os.getenv("OPENROUTER_SITE_NAME", "MultiMind")
app = FastAPI(title="Claude Service", version="1.0.0")


class ConversationMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=20_000)


class ChatRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=20_000)
    instructions: str | None = Field(default=None, max_length=10_000)
    conversationHistory: list[ConversationMessage] = Field(default_factory=list)
    userName: str | None = Field(default=None, max_length=120)


def build_messages(payload: ChatRequest) -> list[dict[str, object]]:
    messages: list[dict[str, object]] = []

    if payload.instructions:
        messages.append({"role": "system", "content": payload.instructions})

    for message in payload.conversationHistory:
        messages.append({"role": message.role, "content": message.content})

    prompt_text = payload.prompt
    if payload.userName:
        prompt_text = f"User name: {payload.userName}\n\n{prompt_text}"

    messages.append({"role": "user", "content": [{"type": "text", "text": prompt_text}]})
    return messages


def extract_content_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text_chunks: list[str] = []
        for item in content:
            if isinstance(item, dict):
                maybe_text = item.get("text")
                if isinstance(maybe_text, str):
                    text_chunks.append(maybe_text)
        return "\n".join(chunk for chunk in text_chunks if chunk)
    return ""


def call_openrouter(payload: ChatRequest) -> str:
    if not API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY is missing")

    response = requests.post(
        url=OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": SITE_URL,
            "X-OpenRouter-Title": SITE_TITLE,
        },
        json={
            "model": MODEL_NAME,
            "messages": build_messages(payload),
            "reasoning": {"enabled": True},
            "temperature": 0.4,
            "top_p": 0.95,
            "max_tokens": 2048,
        },
        timeout=60,
    )

    response.raise_for_status()
    payload_json = response.json()
    choices = payload_json.get("choices", [])
    if not choices:
        raise RuntimeError("OpenRouter returned no choices")

    first_choice = choices[0] if isinstance(choices[0], dict) else {}
    message = first_choice.get("message", {}) if isinstance(first_choice, dict) else {}
    response_text = extract_content_text(message.get("content") if isinstance(message, dict) else "")
    if not response_text:
        raise RuntimeError("OpenRouter returned an empty response")
    return response_text


def synthesize_fallback_response(payload: ChatRequest, reason: str) -> str:
    return f"OpenRouter fallback: {reason}\n\nPrompt: {payload.prompt[:1000]}"


@app.post("/chat")
async def chat(payload: ChatRequest):
    try:
        response_text = call_openrouter(payload)
    except Exception as exc:
        response_text = synthesize_fallback_response(payload, str(exc))
    return {"response": response_text, "model": SERVICE_ID}


@app.get("/health")
async def health():
    status = "healthy" if API_KEY else "degraded"
    detail = "OpenRouter API key configured" if API_KEY else "Running in local fallback mode"
    return {"model": SERVICE_ID, "status": status, "detail": detail}
