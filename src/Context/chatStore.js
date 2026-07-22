import { create } from "zustand";
import { queryChat } from "../Service/chatService.js";
import buildHistory from "../Helpers/buildHistory.js";

let messageId = 0;
const nextId = () => `msg_${++messageId}`;

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (question) => {
    const userMessage = {
      id: nextId(),
      role: "user",
      text: question,
    };

    const history = buildHistory(get().messages);

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const { answer, sources } = await queryChat(question, history);

      const assistantMessage = {
        id: nextId(),
        role: "assistant",
        text: answer,
        sources: sources || [],
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: nextId(),
            role: "assistant",
            text: errorMessage,
            isError: true,
          },
        ],
        isLoading: false,
        error: errorMessage,
      }));
    }
  },

  clearMessages: () => set({ messages: [], error: null }),
}));

export const useMessages = () => useChatStore((state) => state.messages);
export const useIsLoading = () => useChatStore((state) => state.isLoading);

export default useChatStore;
