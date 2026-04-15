import { improvePrompt } from "@/lib/improve-prompt";

describe("improvePrompt", () => {
  test("adds structured sections", () => {
    const result = improvePrompt("Write a backend plan");

    expect(result).toContain("Objective:");
    expect(result).toContain("Constraints:");
    expect(result).toContain("Output Format:");
  });

  test("handles low-signal prompt", () => {
    const result = improvePrompt("very basically just");
    expect(result.length).toBeGreaterThan(20);
  });
});
