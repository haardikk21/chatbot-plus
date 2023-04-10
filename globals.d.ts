interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface WindowAIStreamingOpts {
  temperature?: number;
  maxTokens?: number;
  numOutputs?: number;
  onStreamResult: (result: any, error: any) => void;
}

interface Window {
  ai?: {
    getCompletion: (
      request: { messages: AIMessage[] },
      opts: WindowAIStreamingOpts
    ) => Promise<any>;
    getCurrentModel: () => Promise<string>;
  };
}
