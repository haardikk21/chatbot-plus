export type AIModel = {
  id: "gpt-3.5-turbo" | "gpt-4" | "window.ai";
  name: string;
};

export const AIModels: Record<AIModel["id"], AIModel> = {
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5",
  },
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
  },
  "window.ai": {
    id: "window.ai",
    name: "Window.AI",
  },
};
