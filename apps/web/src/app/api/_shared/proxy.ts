import { NextResponse } from "next/server";

import { modelRequestSchema } from "@/lib/schemas";
import { ModelId } from "@/lib/models";
import { serviceConfig } from "@/lib/service-config";

const REQUEST_TIMEOUT_MS = 30_000;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function proxyFetch(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldUseLocalService(serviceUrl?: string) {
  return process.env.NODE_ENV !== "production" && Boolean(serviceUrl);
}

function buildMessages(payload: {
  prompt: string;
  instructions?: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  userName?: string;
}) {
  const messages: Array<Record<string, unknown>> = [];

  if (payload.instructions) {
    messages.push({ role: "system", content: payload.instructions });
  }

  for (const message of payload.conversationHistory ?? []) {
    messages.push({ role: message.role, content: message.content });
  }

  const promptText = payload.userName ? `User name: ${payload.userName}\n\n${payload.prompt}` : payload.prompt;

  messages.push({
    role: "user",
    content: [{ type: "text", text: promptText }],
  });

  return messages;
}

function extractContentText(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const textChunks: string[] = [];

    for (const item of content) {
      if (item && typeof item === "object") {
        const text = Reflect.get(item, "text");
        if (typeof text === "string") {
          textChunks.push(text);
        }
      }
    }

    return textChunks.join("\n");
  }

  return "";
}

function extractUpstreamError(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Upstream request failed";
  }

  const error = Reflect.get(payload, "error");
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const message = Reflect.get(error, "message");
    const metadata = Reflect.get(error, "metadata");
    const raw = metadata && typeof metadata === "object" ? Reflect.get(metadata, "raw") : "";

    if (typeof raw === "string" && raw.trim()) {
      return raw;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  const fallbackMessage = Reflect.get(payload, "message");
  if (typeof fallbackMessage === "string" && fallbackMessage.trim()) {
    return fallbackMessage;
  }

  return "Upstream request failed";
}

function resolveApiKey(candidateEnvNames: string[]) {
  for (const envName of candidateEnvNames) {
    const value = process.env[envName]?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

async function callOpenRouter(modelId: ModelId, json: Parameters<typeof buildMessages>[0]) {
  const config = serviceConfig[modelId];
  const apiKey = resolveApiKey(config.apiKeyEnvs);

  if (!apiKey) {
    return NextResponse.json(
      {
        model: modelId,
        status: "degraded",
        detail: "Missing OpenRouter API key",
      },
      { status: 503 },
    );
  }

  const response = await proxyFetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": "MultiMind",
    },
    body: JSON.stringify({
      model: config.openRouterModel,
      messages: buildMessages(json),
      reasoning: { enabled: true },
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: 2048,
    }),
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: extractUpstreamError(payload),
        model: modelId,
      },
      { status: response.status },
    );
  }

  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const firstChoice = choices[0] && typeof choices[0] === "object" ? choices[0] : {};
  const message = Reflect.get(firstChoice, "message");
  const responseText = extractContentText(message && typeof message === "object" ? Reflect.get(message, "content") : "");

  return NextResponse.json(
    {
      response: responseText || String(Reflect.get(payload, "response") ?? ""),
      model: String(Reflect.get(payload, "model") ?? modelId),
    },
    { status: 200 },
  );
}

export async function proxyModelPost(modelId: ModelId, request: Request) {
  try {
    const json = await request.json();
    const parsed = modelRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const config = serviceConfig[modelId];

    if (shouldUseLocalService(config.serviceUrl)) {
      const upstream = await proxyFetch(`${config.serviceUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      });

      const body = await upstream.json();

      if (!upstream.ok) {
        return NextResponse.json(
          { error: body.error ?? "Model service error", model: modelId },
          { status: upstream.status },
        );
      }

      return NextResponse.json(
        {
          response: String(body.response ?? ""),
          model: String(body.model ?? modelId),
        },
        { status: 200 },
      );
    }

    return callOpenRouter(modelId, parsed.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected proxy failure",
        model: modelId,
      },
      { status: 502 },
    );
  }
}

export async function proxyModelHealth(modelId: ModelId) {
  try {
    const config = serviceConfig[modelId];

    if (shouldUseLocalService(config.serviceUrl)) {
      const upstream = await proxyFetch(`${config.serviceUrl}/health`, {
        method: "GET",
        cache: "no-store",
      });

      const body = await upstream.json();

      if (!upstream.ok) {
        return NextResponse.json(
          {
            model: modelId,
            status: "unhealthy",
            detail: body.error ?? "Health endpoint failed",
          },
          { status: upstream.status },
        );
      }

      return NextResponse.json(
        {
          model: String(body.model ?? modelId),
          status: body.status ?? "healthy",
          detail: String(body.detail ?? "Service reachable"),
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        model: modelId,
        status: resolveApiKey(config.apiKeyEnvs) ? "healthy" : "degraded",
        detail: resolveApiKey(config.apiKeyEnvs)
          ? "OpenRouter API key configured"
          : "Missing OpenRouter API key",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        model: modelId,
        status: "unhealthy",
        detail: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 },
    );
  }
}
