"use client";

import useWindowAi from "@/hooks/useWindowAi";
import useChatbotStore from "@/stores/ChatbotStore";
import { useState } from "react";
import APIKeyModal from "../Modals/APIKeyModal";
import useIsMounted from "@/hooks/useIsMounted";

export default function ChatLanding() {
  const isMounted = useIsMounted();
  const chatbotStore = useChatbotStore();
  const windowAi = useWindowAi();

  async function connectAI() {
    if (windowAi) {
      const currentModel = await windowAi?.getCurrentModel();
      if (currentModel) {
        chatbotStore.setCurrentModelId("window.ai");
        chatbotStore.setCurrentModelName(currentModel);
      }
    } else {
      window.open("https://windowai.io", "_blank");
    }
  }

  if (!isMounted) return null;

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
        ChatBot{" "}
        <span className="rounded-md bg-purple-300 px-2 text-gray-900">
          Plus
        </span>
      </h2>

      <p className="max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
        ChatBot Plus is an open source chatbot UI, better than ChatGPT which
        integrates{" "}
        <code className="relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400">
          window.ai
        </code>{" "}
        keyless AI functionality. Bring your own model, or supply an OpenAI API
        Key.
      </p>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
          onClick={connectAI}
        >
          {windowAi ? "Connect AI" : "Download window.ai"}
        </button>

        <button
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-purple-200 px-4 py-2 text-sm font-medium text-purple-900 transition-colors hover:bg-purple-300"
          onClick={() => chatbotStore.setShowApiKeyModal(true)}
        >
          Enter OpenAI API Key
        </button>
      </div>

      <APIKeyModal />
    </>
  );
}
