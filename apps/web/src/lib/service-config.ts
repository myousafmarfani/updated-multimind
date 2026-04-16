import { ModelId } from "@/lib/models";

export interface ServiceConfig {
  modelId: ModelId;
  openRouterModel: string;
  serviceUrl?: string;
  apiKeyEnvs: string[];
}

export const serviceConfig: Record<ModelId, ServiceConfig> = {
  gemini: {
    modelId: "gemini",
    openRouterModel: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    serviceUrl: process.env.GEMINI_SERVICE_URL,
    apiKeyEnvs: ["GEMINI_API_KEY", "OPENROUTER_API_KEY_03", "OPENROUTER_API_KEY"],
  },
  chatgpt: {
    modelId: "chatgpt",
    openRouterModel: "nvidia/nemotron-3-super-120b-a12b:free",
    serviceUrl: process.env.CHATGPT_SERVICE_URL,
    apiKeyEnvs: ["OPENAI_GPT_OSS", "OPENROUTER_API_KEY"],
  },
  claude: {
    modelId: "claude",
    openRouterModel: "google/gemma-4-26b-a4b-it:free",
    serviceUrl: process.env.CLAUDE_SERVICE_URL,
    apiKeyEnvs: ["DEEPSEEK_API_KEY", "OPENROUTER_API_KEY_02", "OPENROUTER_API_KEY"],
  },
  grok: {
    modelId: "grok",
    openRouterModel: "minimax/minimax-m2.5:free",
    serviceUrl: process.env.GROK_SERVICE_URL,
    apiKeyEnvs: ["LLAMA_API_KEY", "OPENROUTER_API_KEY_04", "OPENROUTER_API_KEY"],
  },
};
