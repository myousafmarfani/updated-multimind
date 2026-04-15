import { NextResponse } from "next/server";

import { modelRequestSchema } from "@/lib/schemas";
import { ModelId } from "@/lib/models";
import { serviceConfig } from "@/lib/service-config";

const REQUEST_TIMEOUT_MS = 30_000;

async function proxyFetch(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
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
    const upstream = await proxyFetch(`${config.baseUrl}/chat`, {
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
    const upstream = await proxyFetch(`${config.baseUrl}/health`, {
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
