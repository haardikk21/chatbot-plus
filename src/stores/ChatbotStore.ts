"use client";

import { Conversation, Message } from "@/types/chat";
import { Group } from "@/types/group";
import { AIModel } from "@/types/models";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatbotStoreState {
  groups: Group[];
  conversations: Conversation[];
  currentModelId: AIModel["id"] | undefined;
  currentModelName: string;
  currentGroupId: string;
  currentConversationId: string | undefined;
  openAiApiKey?: string;

  showApiKeyModal: boolean;
  showAddGroupModal: boolean;
  showSettingsModal: boolean;

  temperature: number;

  addGroup: (name: string, emoji: string) => void;
  addConversation: (name: string, groupId: string) => Conversation;
  addMessage: (
    conversationId: string,
    role: Message["role"],
    content: string
  ) => void;

  setCurrentModelId: (modelId: AIModel["id"] | undefined) => void;
  setCurrentModelName: (modelName: string) => void;
  setCurrentGroupId: (groupId: string) => void;
  setCurrentConversationId: (conversationId: string | undefined) => void;
  setOpenAiApiKey: (apiKey: string) => void;
  setConversationName: (conversationId: string, name: string) => void;
  setConversationMessages: (
    conversationId: string,
    messages: Message[]
  ) => void;

  setTemperature: (temp: number) => void;

  getCurrentConversation(): Conversation | undefined;
  getGroupById: (id: string) => Group | undefined;
  getConversationById: (id: string) => Conversation | undefined;

  getConversationsByGroupId: (groupId: string) => Conversation[];

  deleteConversation: (id: string) => void;
  deleteGroup: (id: string) => void;

  setShowApiKeyModal: (show: boolean) => void;
  setShowAddGroupModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
}

const defaultGroupId = uuidv4();

const useChatbotStore = create<ChatbotStoreState>()(
  persist(
    (set, get) => ({
      groups: [
        {
          id: defaultGroupId,
          name: "Default",
          iconType: "emoji",
          iconEmoji: "🤖",
        },
      ],
      conversations: [],
      currentModelId: undefined,
      currentModelName: "",
      currentConversationId: undefined,
      currentGroupId: defaultGroupId,
      openAiApiKey: undefined,

      temperature: 0.3,

      showApiKeyModal: false,
      showAddGroupModal: false,
      showSettingsModal: false,

      addGroup: (name: string, emoji: string) => {
        set((state) => ({
          groups: [
            ...state.groups,
            {
              id: uuidv4(),
              name,
              iconType: "emoji",
              iconEmoji: emoji,
            },
          ],
        }));
      },

      addConversation: (name, groupId) => {
        const conversation = {
          id: uuidv4(),
          name,
          groupId,
          messages: [],
        };

        set((state) => ({
          conversations: [...state.conversations, conversation],
        }));

        return conversation;
      },

      addMessage: (conversationId, role, content) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    role,
                    content,
                  },
                ],
              };
            }

            return conversation;
          }),
        }));
      },

      setCurrentModelId: (modelId) => {
        set((state) => ({
          currentModelId: modelId,
        }));
      },

      setCurrentModelName: (modelName) => {
        set((state) => ({
          currentModelName: modelName,
        }));
      },

      setCurrentGroupId: (groupId) => {
        set((state) => ({
          currentGroupId: groupId,
        }));
      },

      setCurrentConversationId: (conversationId) => {
        set((state) => ({
          currentConversationId: conversationId,
        }));
      },

      setOpenAiApiKey: (apiKey) => {
        set((state) => ({
          openAiApiKey: apiKey,
        }));
      },

      setTemperature: (temp) => {
        set((state) => ({
          temperature: temp,
        }));
      },

      setConversationName: (conversationId, name) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                name,
              };
            }

            return conversation;
          }),
        }));
      },

      setConversationMessages: (conversationId, messages) => {
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages,
              };
            }

            return conversation;
          }),
        }));
      },

      getGroupById: (id) => {
        return get().groups.find((group) => group.id === id);
      },

      getCurrentConversation: () => {
        return get().conversations.find(
          (conversation) => conversation.id === get().currentConversationId
        );
      },

      getConversationById: (id) => {
        return get().conversations.find(
          (conversation) => conversation.id === id
        );
      },

      getConversationsByGroupId: (groupId) => {
        return get().conversations.filter(
          (conversation) => conversation.groupId === groupId
        );
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter(
            (conversation) => conversation.id !== id
          ),
        }));
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        }));
      },

      setShowApiKeyModal: (show) => {
        set(() => ({
          showApiKeyModal: show,
        }));
      },

      setShowAddGroupModal: (show) => {
        set(() => ({
          showAddGroupModal: show,
        }));
      },

      setShowSettingsModal: (show) => {
        set(() => ({
          showSettingsModal: show,
        }));
      },
    }),
    {
      name: "chatbot-plus-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useChatbotStore;
