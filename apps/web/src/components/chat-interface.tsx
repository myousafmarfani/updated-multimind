"use client";

import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

import { modelIds, modelLabels, type ConversationMessage, type ModelId } from "@/lib/models";
import { ModelCard } from "@/components/model-card";

const modelMarks: Record<ModelId, ReactNode> = {
  gemini: <span aria-hidden="true">✦</span>,
  chatgpt: <span aria-hidden="true">◎</span>,
  claude: <span aria-hidden="true">◈</span>,
  grok: <span aria-hidden="true">↯</span>,
};

const sidebarItems = [
  {
    label: "Search",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
    ),
  },
  {
    label: "Chats",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <path d="M4 5.5h16v10H8.2L4 19V5.5Z" />
      </svg>
    ),
  },
  {
    label: "Images",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <rect x="4" y="5" width="16" height="14" rx="2.5" />
        <path d="m7 15 3-3 3 3 2-2 2 2" />
        <circle cx="9" cy="10" r="1.2" />
      </svg>
    ),
  },
  {
    label: "Teams",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <path d="M8 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm14 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
        <path d="M2.5 19.5c.8-2.8 2.9-4.5 5.5-4.5s4.7 1.7 5.5 4.5M12.5 19.5c.8-2.8 2.9-4.5 5.5-4.5s4.7 1.7 5.5 4.5" />
      </svg>
    ),
  },
  {
    label: "Layers",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </svg>
    ),
  },
  {
    label: "Games",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
        <path d="M7 9h10a4 4 0 0 1 4 4v3a3 3 0 0 1-3 3h-2l-2-2H10l-2 2H6a3 3 0 0 1-3-3v-3a4 4 0 0 1 4-4Z" />
        <path d="M9 12v.01M15 12v.01M12 10v4" />
      </svg>
    ),
  },
];

interface ModelPaneState {
  response: string;
  isLoading: boolean;
  error?: string;
  elapsedMs?: number;
  messageCount: number;
}

const defaultPaneState: ModelPaneState = {
  response: "",
  isLoading: false,
  elapsedMs: undefined,
  messageCount: 0,
};

function createInitialState() {
  return modelIds.reduce<Record<ModelId, ModelPaneState>>((acc, modelId) => {
    acc[modelId] = { ...defaultPaneState };
    return acc;
  }, {} as Record<ModelId, ModelPaneState>);
}

export function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [hasConversation, setHasConversation] = useState(false);
  const [maximizedModel, setMaximizedModel] = useState<ModelId | null>(null);
  const [enabledModels, setEnabledModels] = useState<Record<ModelId, boolean>>({
    gemini: false,
    chatgpt: false,
    claude: false,
    grok: false,
  });
  const [history, setHistory] = useState<Record<ModelId, ConversationMessage[]>>({
    gemini: [],
    chatgpt: [],
    claude: [],
    grok: [],
  });
  const [panes, setPanes] = useState(createInitialState);

  const healthQueries = useQueries({
    queries: modelIds.map((id) => ({
      queryKey: ["health", id],
      queryFn: async () => {
        const response = await fetch(`/api/${id}/health`, { cache: "no-store" });
        return response.json();
      },
      refetchInterval: 15_000,
    })),
  });

  const healthMap = useMemo(() => {
    return modelIds.reduce<Record<ModelId, { status: "healthy" | "degraded" | "unhealthy"; detail: string }>>(
      (acc, id, index) => {
        const data = healthQueries[index]?.data;
        acc[id] = {
          status: data?.status ?? "unhealthy",
          detail: data?.detail ?? "Service unavailable",
        };
        return acc;
      },
      {} as Record<ModelId, { status: "healthy" | "degraded" | "unhealthy"; detail: string }>,
    );
  }, [healthQueries]);

  function Sidebar() {
    const firstItem = sidebarItems[0];
    const lastItem = sidebarItems[sidebarItems.length - 1];

    return (
      <aside
        className="hidden h-full shrink-0 border-r border-white/10 bg-[#0a0f16] md:flex md:flex-col"
        style={{ width: "4.75rem" }}
      >
        <div className="flex items-center justify-center border-b border-white/10 py-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-300 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]">
            <span className="text-xl leading-none">✦</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-3 px-2 py-4">
          <button
            type="button"
            aria-label={firstItem.label}
            className="grid h-10 w-10 place-items-center rounded-2xl text-slate-400 transition hover:bg-white/6 hover:text-white"
          >
            {firstItem.icon}
          </button>

          <div className="my-2 h-px w-8 bg-white/10" />

          <div className="mt-auto pb-1">
            <button
              type="button"
              aria-label={lastItem.label}
              className="grid h-10 w-10 place-items-center rounded-2xl text-slate-400 transition hover:bg-white/6 hover:text-white"
            >
              {lastItem.icon}
            </button>
          </div>
        </nav>
      </aside>
    );
  }

  async function requestModel(modelId: ModelId, basePrompt: string) {
    const start = performance.now();

    setHistory((prev) => ({
      ...prev,
      [modelId]: [...prev[modelId], { role: "user", content: basePrompt }],
    }));

    setPanes((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        isLoading: true,
        error: undefined,
      },
    }));

    try {
      const response = await fetch(`/api/${modelId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: basePrompt,
          conversationHistory: history[modelId],
        }),
      });

      const payload = await response.json();
      const elapsedMs = Math.round(performance.now() - start);

      if (!response.ok) {
        throw new Error(payload.error ?? "Unknown model failure");
      }

      const assistantReply = String(payload.response ?? "");

      setHistory((prev) => ({
        ...prev,
        [modelId]: [...prev[modelId], { role: "assistant", content: assistantReply }],
      }));

      setPanes((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          response: assistantReply,
          isLoading: false,
          elapsedMs,
          messageCount: prev[modelId].messageCount + 2,
        },
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Request failed";

      setHistory((prev) => ({
        ...prev,
        [modelId]: [...prev[modelId], { role: "assistant", content: `Error: ${errorMessage}` }],
      }));

      setPanes((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          isLoading: false,
          error: errorMessage,
        },
      }));
    }
  }

  async function handleSend() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    const activeModelIds = modelIds.filter((modelId) => enabledModels[modelId]);
    const targetModelIds = activeModelIds.length > 0 ? activeModelIds : modelIds;

    setHasConversation(true);
    await Promise.all(targetModelIds.map((modelId) => requestModel(modelId, trimmedPrompt)));
    setPrompt("");
  }

  async function handleComposerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleSend();
  }

  function renderPane(modelId: ModelId) {
    return (
      <ModelCard
        title={modelLabels[modelId]}
        mark={modelMarks[modelId]}
        messages={history[modelId]}
        isLoading={panes[modelId].isLoading}
        status={healthMap[modelId]?.status ?? "unhealthy"}
        detail={healthMap[modelId]?.detail ?? "Unknown"}
        error={panes[modelId].error}
        isEnabled={enabledModels[modelId]}
        onToggleEnabled={() => {
          setEnabledModels((current) => {
            const nextEnabled = !current[modelId];

            if (nextEnabled) {
              setMaximizedModel(modelId);
            } else {
              setMaximizedModel((currentMaximized) =>
                currentMaximized === modelId ? null : currentMaximized,
              );
            }

            return {
              ...current,
              [modelId]: nextEnabled,
            };
          });
        }}
        isMaximized={maximizedModel === modelId}
        onToggleMaximize={() =>
          setMaximizedModel((current) => (current === modelId ? null : modelId))
        }
      />
    );
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#04060d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(19,170,136,0.28),transparent_44%),radial-gradient(circle_at_44%_22%,rgba(44,117,220,0.24),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(130,155,185,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(130,155,185,0.2)_1px,transparent_1px)] bg-size-[28px_28px] opacity-20" />

      <div className="relative z-10 flex h-full">
        <Sidebar />

        <section className={`relative flex h-full min-h-0 flex-1 flex-col overflow-hidden ${hasConversation ? "px-0 py-0" : "px-3 py-3 sm:px-5"}`}>
          {!hasConversation ? (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-display text-3xl text-white">AI Fiesta</div>
              </div>
            </div>
          ) : null}

          {!hasConversation ? (
            <>
              <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-20">
                <div className="mb-6 text-8xl text-emerald-300/85">✶</div>
                <h1 className="font-display text-center text-6xl font-semibold text-white sm:text-7xl">Hi, Friend!</h1>
                <p className="mt-3 text-center text-2xl text-slate-300">How can I assist you today?</p>

                <form
                  onSubmit={handleComposerSubmit}
                  className="mt-8 w-full rounded-4xl border border-white/14 bg-[linear-gradient(180deg,rgba(41,77,94,0.62),rgba(36,66,64,0.46))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
                >
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={3}
                    className="w-full resize-none border-none bg-transparent px-3 py-2 text-2xl text-white outline-none placeholder:text-slate-400"
                    placeholder="Ask me anything..."
                  />

                  <div className="mt-2 flex items-center justify-between px-2 pb-1">
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/8 text-2xl text-slate-200"
                    >
                      +
                    </button>
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-300/20 bg-emerald-500/18 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/26"
                    >
                      Send
                    </button>
                  </div>
                </form>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-white/16 bg-black/50 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Web Search
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/16 bg-black/50 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Generate Image ↗
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
              {maximizedModel ? (
                <motion.div
                  key="maximized-pane"
                  initial={{ opacity: 0.55, scale: 0.985, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: "easeOut" }}
                  className="flex min-h-0 flex-1 items-stretch justify-center rounded-[1.8rem] border border-white/10 bg-[#060913] px-2 py-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:px-3 sm:py-3"
                >
                  <motion.div
                    layout
                    transition={{ duration: 0.34, ease: "easeOut" }}
                    className="flex min-h-0 w-full"
                    style={{ maxWidth: "1240px" }}
                  >
                    {renderPane(maximizedModel)}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="pane-track"
                  layout
                  transition={{ duration: 0.34, ease: "easeOut" }}
                  className="model-track-scroll min-h-0 flex-1 overflow-x-auto overflow-y-hidden rounded-[1.8rem] border border-white/10 bg-[#060913] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                >
                  <div className="grid h-full min-h-0 min-w-full grid-cols-4" style={{ minWidth: "1320px" }}>
                    {modelIds.map((modelId) => (
                      <motion.div
                        key={modelId}
                        layout
                        transition={{ duration: 0.34, ease: "easeOut" }}
                        className="flex min-h-0 border-r border-white/8 last:border-r-0"
                      >
                        {renderPane(modelId)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.form
                onSubmit={handleComposerSubmit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex shrink-0 justify-center px-1 py-3 sm:px-3 sm:py-4"
              >
                <div className="flex w-full max-w-3xl items-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(24,27,35,0.92),rgba(15,18,24,0.94))] px-3 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.45)] sm:px-4 sm:py-2.5">
                  <button
                    type="button"
                    aria-label="Add attachment"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/14 bg-white/5 text-2xl text-slate-200 transition hover:bg-white/10"
                  >
                    +
                  </button>
                  <input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    className="h-10 min-w-0 flex-1 bg-transparent px-3 text-base text-white outline-none placeholder:text-slate-500 sm:h-11 sm:text-lg"
                    placeholder="Ask me anything..."
                  />
                  <button
                    type="submit"
                    aria-label="Send prompt"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/14 bg-white/5 text-slate-200 transition hover:bg-white/10"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                      <path d="M12 19V5" />
                      <path d="m7 10 5-5 5 5" />
                      <path d="M5 19h14" />
                    </svg>
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
