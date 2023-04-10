"use client";

import useChatbotStore from "@/stores/ChatbotStore";
import ChatLanding from "./ChatLanding";
import ChatMain from "./ChatMain";
import Footer from "../Footer";

export default function Chat() {
  const chatbotStore = useChatbotStore();
  return (
    <div className="relative mx-auto flex h-screen w-full flex-grow flex-col items-center py-8">
      {chatbotStore.currentModelId === undefined && <ChatLanding />}
      {chatbotStore.currentModelId && (
        <>
          <ChatMain />
        </>
      )}
      <div className="flex-grow" />
      <Footer />
    </div>
  );
}
