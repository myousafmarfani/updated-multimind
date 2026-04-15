const fillerWords = /\b(?:really|very|basically|just|kind of|sort of)\b/gi;
const extraWhitespace = /\s+/g;

export function improvePrompt(prompt: string): string {
  const cleaned = prompt
    .replace(fillerWords, "")
    .replace(extraWhitespace, " ")
    .trim();

  if (!cleaned) {
    return "Explain the request clearly with objective, constraints, and expected output format.";
  }

  const sections = [
    "Objective:",
    cleaned,
    "",
    "Constraints:",
    "- Keep response accurate and concise.",
    "- Mention assumptions when details are missing.",
    "",
    "Output Format:",
    "- Provide a structured answer with headings and bullet points where useful.",
  ];

  return sections.join("\n");
}
