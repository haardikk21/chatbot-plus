// Allow user to change settings
// Specifically, allow them to switch between connecting to window.ai or providing an OpenAI API Key
"use client";

import useWindowAi from "@/hooks/useWindowAi";
import useChatbotStore from "@/stores/ChatbotStore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Slider } from "../Slider";
import { AIModels } from "@/types/models";

const SettingsModal: React.FC = () => {
  const chatbotStore = useChatbotStore();
  const windowAi = useWindowAi();

  async function handleSwitchClick() {
    if (chatbotStore.currentModelId === undefined) return;
    else if (chatbotStore.currentModelId === "window.ai") {
      chatbotStore.setCurrentModelId(undefined);
      chatbotStore.setShowApiKeyModal(true);
      chatbotStore.setShowSettingsModal(false);
    } else if (windowAi) {
      const currentModel = await windowAi?.getCurrentModel();
      if (currentModel) {
        chatbotStore.setCurrentModelId("window.ai");
        chatbotStore.setCurrentModelName(currentModel);
      }
    } else {
      window.open("https://windowai.io", "_blank");
    }
  }

  return (
    <Transition.Root show={chatbotStore.showSettingsModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={chatbotStore.setShowSettingsModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-400/75 transition-opacity dark:bg-gray-700/75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-200 px-4 pb-4 pt-5 text-left text-gray-900 shadow-xl transition-all dark:bg-gray-900 dark:text-gray-100 sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Settings
                </Dialog.Title>
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <p className=" font-medium">Current AI: </p>
                  <span>{chatbotStore.currentModelId}</span>
                  <div className="flex-grow" />
                  <button
                    onClick={handleSwitchClick}
                    className="inline-flex h-6 items-center justify-center rounded-md bg-purple-200 px-2 py-1 font-medium text-purple-900 transition-colors hover:bg-purple-300"
                  >
                    Switch
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <p className="font-medium">Temperature: </p>
                  <Slider
                    value={[chatbotStore.temperature]}
                    max={1}
                    step={0.01}
                    onValueChange={(e) => chatbotStore.setTemperature(e[0])}
                  />
                  <span className="flex-shrink-0">
                    {chatbotStore.temperature}
                  </span>
                </div>

                {chatbotStore.currentModelId !== "window.ai" && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <p className="font-medium">Model: </p>
                    <select
                      className="w-full rounded-md px-2 py-1"
                      value={chatbotStore.currentModelId}
                      onChange={(e) => {
                        const selectedModel = e.target.value as "gpt-3.5-turbo" | "gpt-4"
                        chatbotStore.setCurrentModelId(selectedModel);
                        chatbotStore.setCurrentModelName(AIModels[selectedModel].name);
                      }}
                    >
                      <option value={"gpt-3.5-turbo"}>GPT 3.5 Turbo</option>
                      <option value={"gpt-4"}>GPT 4</option>
                    </select>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SettingsModal;
