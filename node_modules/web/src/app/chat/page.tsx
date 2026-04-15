import type { Metadata } from "next";

import { ChatInterface } from "@/components/chat-interface";

export const metadata: Metadata = {
  title: "Chat",
  description: "Run one prompt across Gemini, ChatGPT, Claude, and Grok in parallel.",
  alternates: {
    canonical: "/chat",
  },
  openGraph: {
    title: "MultiMind Chat",
    description: "Parallel AI responses across four model panes.",
    url: "/chat",
  },
};

export default function ChatPage() {
  return <ChatInterface />;
}
