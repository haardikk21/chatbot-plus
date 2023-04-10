export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type Conversation = {
  id: string;
  name: string;
  messages: Message[];

  groupId: string;
};
