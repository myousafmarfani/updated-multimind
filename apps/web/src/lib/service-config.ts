import { ModelId } from "@/lib/models";

export interface ServiceConfig {
  model: string;
  baseUrl: string;
  apiKeyEnv: string;
}

export const serviceConfig: Record<ModelId, ServiceConfig> = {
  gemini: {
    model: "gemini",
    baseUrl: process.env.GEMINI_SERVICE_URL ?? "http://127.0.0.1:8001",
    apiKeyEnv: "GEMINI_API_KEY",
  },
  chatgpt: {
    model: "chatgpt",
    baseUrl: process.env.CHATGPT_SERVICE_URL ?? "http://127.0.0.1:8002",
    apiKeyEnv: "OPENAI_GPT_OSS",
  },
  claude: {
    model: "claude",
    baseUrl: process.env.CLAUDE_SERVICE_URL ?? "http://127.0.0.1:8003",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
  grok: {
    model: "grok",
    baseUrl: process.env.GROK_SERVICE_URL ?? "http://127.0.0.1:8004",
    apiKeyEnv: "LLAMA_API_KEY",
  },
};
