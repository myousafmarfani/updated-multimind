export const modelIds = ["gemini", "chatgpt", "claude", "grok"] as const;

export type ModelId = (typeof modelIds)[number];

export type Role = "user" | "assistant";

export interface ConversationMessage {
  role: Role;
  content: string;
}

export interface ModelRequest {
  prompt: string;
  instructions?: string;
  conversationHistory?: ConversationMessage[];
  userName?: string;
}

export interface ModelResponse {
  response: string;
  model: string;
}

export interface ModelHealth {
  model: string;
  status: "healthy" | "degraded" | "unhealthy";
  detail: string;
}

export const modelLabels: Record<ModelId, string> = {
  gemini: "Gemini",
  chatgpt: "ChatGPT",
  claude: "Claude",
  grok: "Grok",
};
