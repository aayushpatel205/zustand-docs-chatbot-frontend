import apiClient from "./apiClient.js";

export const queryChat = async (question) => {
  const response = await apiClient.post("/chat/query", { question });
  return response.data.data;
};
