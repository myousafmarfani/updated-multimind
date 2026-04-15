import { NextResponse } from "next/server";

import { improvePrompt } from "@/lib/improve-prompt";
import { improvePromptSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = improvePromptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid prompt payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json({ improvedPrompt: improvePrompt(parsed.data.prompt) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected failure" },
      { status: 500 },
    );
  }
}
