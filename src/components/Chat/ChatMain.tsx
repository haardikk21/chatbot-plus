"use client";

import { basePrompt } from "@/constants";
import useIsMounted from "@/hooks/useIsMounted";
import useWindowAi from "@/hooks/useWindowAi";
import useChatbotStore from "@/stores/ChatbotStore";
import clsx from "clsx";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import Markdown from "@/components/Markdown/Markdown";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function ChatMain() {
  const isMounted = useIsMounted();
  const chatbotStore = useChatbotStore();
  const windowAi = useWindowAi();
  const [text, setText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      if (text === "") {
        textareaRef.current.style.height = "48px";
      } else {
        textareaRef.current.style.height = "24px";
        textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
        textareaRef.current.style.overflow = `${
          textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"
        }`;
      }
    }
  }, [text, textareaRef]);

  async function handleMessageSend(
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) {
    e.preventDefault();
    if (text === "") return;

    let conversation = chatbotStore.getCurrentConversation();
    if (!conversation) {
      conversation = chatbotStore.addConversation(
        text,
        chatbotStore.currentGroupId
      );
      chatbotStore.setCurrentConversationId(conversation.id);
    }

    const newMessage: AIMessage = {
      role: "user",
      content: text,
    };

    const messages = conversation.messages;
    let updatedMessages = [...messages, newMessage];
    setText("");
    if (chatbotStore.currentModelId === "window.ai") {
      const streamingOpts = {
        temperature: chatbotStore.temperature,
        maxTokens: chatbotStore.currentModelName.includes("gpt4") ? 2000 : 1000,
        onStreamResult: (result?: { message: AIMessage }, error?: Error) => {
          if (error) {
            console.error(error);
          } else if (result) {
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.role === "user") {
              updatedMessages = [
                ...updatedMessages,
                {
                  role: "assistant",
                  content: result.message.content,
                },
              ];
            } else {
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + result.message.content,
              };
            }

            chatbotStore.setConversationMessages(
              conversation!.id,
              updatedMessages
            );
          }
        },
      };

      try {
        await windowAi?.getCompletion(
          {
            messages: [
              { role: "system", content: basePrompt },
              ...updatedMessages,
            ],
          },
          streamingOpts
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      const controller = new AbortController();

      await fetchEventSource("https://api.openai.com/v1/chat/completions", {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatbotStore.openAiApiKey}`,
        },
        body: JSON.stringify({
          model: chatbotStore.currentModelId,
          messages: [
            { role: "system", content: basePrompt },
            ...updatedMessages,
          ],
          temperature: chatbotStore.temperature,
          max_tokens: chatbotStore.currentModelName.includes("4") ? 4096 : 2048,
          stream: true,
        }),
        onmessage(event) {
          console.log(event.data);

          if (event.data === "[DONE]") {
            controller.abort();
            return;
          }

          const parsedData = JSON.parse(event.data);
          const text = parsedData.choices[0].delta.content ?? "";
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.role === "user") {
            updatedMessages = [
              ...updatedMessages,
              {
                role: "assistant",
                content: text,
              },
            ];
          } else {
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + text,
            };
          }

          chatbotStore.setConversationMessages(
            conversation!.id,
            updatedMessages
          );
        },
        onclose() {
          controller.abort();
        },
      });
    }
  }

  if (!isMounted) return null;

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center">
      <h2 className="pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
        ChatBot{" "}
        <span className="rounded-md bg-purple-300 px-2 text-gray-900">
          Plus
        </span>
      </h2>

      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        ChatBot Plus is currently using{" "}
        <code className="relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400">
          {chatbotStore.currentModelId} - {chatbotStore.currentModelName}
        </code>
        .
      </span>

      <div className="mt-1 h-full w-full flex-grow overflow-y-scroll border-y border-gray-700">
        {chatbotStore.currentConversationId && (
          <div className="flex h-full flex-col gap-4">
            {chatbotStore
              .getConversationById(chatbotStore.currentConversationId)
              ?.messages.map((message) => (
                <div
                  key={message.content}
                  className={clsx(
                    "w-full gap-4 px-8 py-8",
                    message.role === "assistant"
                      ? "bg-gray-300 dark:bg-gray-800"
                      : ""
                  )}
                >
                  <div className="mx-auto flex max-w-3xl items-start gap-4">
                    <div className="flex-shrink-0">
                      {message.role === "assistant" ? (
                        <FaRobot size="24" />
                      ) : (
                        <FaUser size="24" />
                      )}
                    </div>
                    <Markdown className="prose-xl dark:prose-invert">
                      {message.content}
                    </Markdown>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <form
        className="stretch z-50 mx-auto flex w-full max-w-3xl flex-row gap-3 last:mb-6"
        onSubmit={handleMessageSend}
      >
        <div className="relative flex h-full w-full flex-1 flex-col">
          <div className="m-auto mb-2 ml-1 flex w-full justify-center gap-2"></div>
          <div className="relative flex h-full w-full flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <textarea
              ref={textareaRef}
              className="m-0 w-full resize-none border-0 bg-transparent py-3 pl-10 pr-8 text-gray-900 placeholder:text-gray-600 focus:outline-none dark:bg-transparent dark:text-white dark:placeholder:text-gray-300"
              style={{
                resize: "none",
                bottom: `${textareaRef?.current?.scrollHeight}px`,
                maxHeight: "240px",
                overflow: `${
                  textareaRef.current && textareaRef.current.scrollHeight > 400
                    ? "auto"
                    : "hidden"
                }`,
              }}
              placeholder={"Send a message..."}
              onChange={(e) => setText(e.target.value)}
              value={text}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleMessageSend(e);
                }
              }}
              rows={1}
            />
            <button
              className="absolute bottom-2 right-1 rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-gray-900 enabled:dark:hover:text-gray-400 dark:disabled:hover:bg-transparent"
              disabled={!text}
              type="submit"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
