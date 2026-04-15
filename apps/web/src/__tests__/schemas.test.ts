import { modelRequestSchema } from "@/lib/schemas";

describe("modelRequestSchema", () => {
  test("accepts valid payload", () => {
    const parsed = modelRequestSchema.safeParse({
      prompt: "Hello",
      conversationHistory: [{ role: "user", content: "Hi" }],
    });

    expect(parsed.success).toBe(true);
  });

  test("rejects invalid role", () => {
    const parsed = modelRequestSchema.safeParse({
      prompt: "Hello",
      conversationHistory: [{ role: "system", content: "Nope" }],
    });

    expect(parsed.success).toBe(false);
  });
});
