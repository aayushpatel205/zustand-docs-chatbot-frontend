import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontawesome from "react-native-vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";
import useAuthStore from "../../Context/authStore";
import { useMessages, useIsLoading } from "../../Context/chatStore";
import useChatStore from "../../Context/chatStore";
import Markdown from "react-native-markdown-display";

const ChatPage = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const flatListRef = useRef(null);

  const messages = useMessages();
  const isLoading = useIsLoading();
  const { sendMessage } = useChatStore();
  const logout = useAuthStore((state) => state.logout);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    setMessage("");
    await sendMessage(trimmed);
  };

  // Append a synthetic thinking item while loading — same pattern as old ChatScreen
  const listData = isLoading
    ? [...messages, { id: "__thinking__", isThinking: true }]
    : messages;

  const renderMessage = ({ item: msg }) => {
    // Thinking indicator rendered as a list item (old ChatScreen pattern)
    if (msg.isThinking) {
      return (
        <View style={styles.messageRow}>
          <View style={[styles.bubble, styles.aiBubble]}>
            <View style={styles.thinkingRow}>
              <ActivityIndicator size="small" color="#8E8E93" />
              <Text style={styles.thinkingText}>Thinking...</Text>
            </View>
          </View>
        </View>
      );
    }

    const isUser = msg.role === "user";

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
            msg.isError && styles.errorBubble,
          ]}
        >
          {isUser || msg.isError ? (
            <Text style={[styles.messageText, isUser && styles.userText]}>
              {msg.text}
            </Text>
          ) : (
            <Markdown style={markdownStyles}>{msg.text}</Markdown>
          )}

          {msg.sources?.length > 0 && (
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesLabel}>Sources:</Text>
              {msg.sources.map((source, i) => (
                <Text key={i} style={styles.sourceItem}>
                  {source.title}{source.heading ? ` — ${source.heading}` : ""}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Landing")}
          accessibilityLabel="Go back"
        >
          <Fontawesome name="chevron-left" size={20} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Zustand AI</Text>

        <TouchableOpacity onPress={logout} accessibilityLabel="Logout">
          <Entypo name="log-out" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask about Zustand..."
              placeholderTextColor="#8E8E93"
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={[
                styles.sendButton,
                (!message.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              disabled={!message.trim() || isLoading}
              accessibilityLabel="Send message"
            >
              <Fontawesome name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  headerTitle: {
    color: "white",
    fontSize: 26,
    fontFamily: "Inter-Bold",
  },

  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 10,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingVertical: 10,
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 6,
  },

  messageRowUser: {
    flexDirection: "row-reverse",
  },

  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#3D7DFF",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 18,
  },

  aiBubble: {
    backgroundColor: "#2A2A2A",
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 0,
  },

  errorBubble: {
    backgroundColor: "#3D1F1F",
  },

  thinkingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  thinkingText: {
    color: "#8E8E93",
    fontSize: 16,
    marginLeft: 8,
  },

  messageText: {
    color: "#E0E0E0",
    fontSize: 16,
  },

  userText: {
    color: "#FFFFFF",
  },

  sourcesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
  },

  sourcesLabel: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  sourceItem: {
    color: "#5A9EFF",
    fontSize: 12,
    marginBottom: 2,
  },

  inputContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 24,
    backgroundColor: "#1C1C1E",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 120,
    marginRight: 10,
  },

  sendButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },
});

const markdownStyles = {
  body: {
    color: "#FFFFFF",
  },
  text: {
    color: "#FFFFFF",
  },
  strong: {
    color: "#FFFFFF",
  },
  em: {
    color: "#FFFFFF",
  },
  link: {
    color: "#4DA6FF",
  },
  heading1: { color: "#FFFFFF" },
  heading2: { color: "#FFFFFF" },
  heading3: { color: "#FFFFFF" },
  code_inline: {
    backgroundColor: "#2a2a2a",
    color: "#3d7dff",
    padding: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: "#1E1E1E",
    color: "#3d7dff",
    padding: 10,
    borderRadius: 8,
  },
  fence: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  blockquote: {
    backgroundColor: "transparent",
    borderLeftColor: "#666",
    color: "#FFFFFF",
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  },
};

export default ChatPage;