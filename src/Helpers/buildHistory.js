const buildHistory = (messages, maxExchanges = 3) => {
  return messages
    .slice(-(maxExchanges * 2))
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.text }))
    .filter((m) => m.content && m.content.trim().length > 0);
};

export default buildHistory;
