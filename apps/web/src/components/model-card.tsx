import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ConversationMessage } from "@/lib/models";

interface ModelCardProps {
  title: string;
  mark: ReactNode;
  messages: ConversationMessage[];
  status: "healthy" | "degraded" | "unhealthy";
  detail: string;
  isLoading: boolean;
  error?: string;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

const statusClassMap = {
  healthy: "bg-emerald-400",
  degraded: "bg-amber-400",
  unhealthy: "bg-rose-400",
};

export function ModelCard({
  title,
  mark,
  messages,
  status,
  detail,
  isLoading,
  error,
  isEnabled,
  onToggleEnabled,
  isMaximized,
  onToggleMaximize,
}: ModelCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full min-h-0 w-full flex-col bg-transparent"
      aria-live="polite"
    >
      <header className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3 text-white sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`grid h-3 w-3 shrink-0 place-items-center rounded-full ${statusClassMap[status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#061018]" />
          </span>
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/24 px-3 py-1.5 text-sm font-semibold text-slate-100">
            <span className="text-base leading-none text-cyan-300">{mark}</span>
            <span className="truncate text-white">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleMaximize}
            aria-label={isMaximized ? "Minimize model window" : "Maximize model window"}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
              <path d="M14 3h7v7" />
              <path d="M10 14 21 3" />
              <path d="M21 14v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onToggleEnabled}
            aria-label={isEnabled ? "Unset model target" : "Target this model"}
            className={`relative flex h-6 w-11 items-center rounded-full border transition ${
              isEnabled ? "border-emerald-300/40 bg-emerald-400/70" : "border-white/14 bg-white/16"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.32)] transition-transform ${
                isEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 ${
          isMaximized ? "mx-auto w-full" : ""
        }`}
        style={isMaximized ? { maxWidth: "1120px" } : undefined}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#070c16]">
          <div className="chat-pane-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {messages.length === 0 ? (
              <div className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-500 sm:text-base lg:text-[1.05rem]">{detail}</div>
            ) : null}

            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div key={`${message.role}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[92%] min-w-0 whitespace-pre-wrap wrap-break-word rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[88%] sm:px-4 sm:py-3 sm:text-[0.98rem] ${
                      isUser
                        ? "bg-[#202734] text-white"
                        : "border border-[#243247] bg-[#0d1727] text-slate-100"
                    }`}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="generating-badge flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.55)]" />
                  <span className="text-[0.88rem] font-semibold text-slate-100">Generating..</span>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="flex justify-start">
                <div className="max-w-[92%] whitespace-pre-wrap wrap-break-word rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-100 sm:max-w-[88%]" style={{ overflowWrap: "anywhere" }}>
                  {error}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
