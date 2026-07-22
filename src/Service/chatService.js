import apiClient from "./apiClient.js";

export const queryChat = async (question, history = []) => {
  const response = await apiClient.post("/chat/query", { question, history });
  return response.data.data;
};
