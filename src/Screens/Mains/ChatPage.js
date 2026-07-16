import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Entypo } from "@expo/vector-icons";
import useAuthStore from "../../Context/authStore";
import { useMessages, useIsLoading } from "../../Context/chatStore";
import useChatStore from "../../Context/chatStore";
import Markdown from "@ronradtke/react-native-markdown-display";

const ChatPage = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  const messages = useMessages();
  const isLoading = useIsLoading();
  const { sendMessage } = useChatStore();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      Animated.timing(keyboardOffset, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: false,
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    setMessage("");
    await sendMessage(trimmed);
  };

  const renderMessage = (msg) => {
    const isUser = msg.role === "user";

    return (
      <View key={msg.id} style={[styles.messageRow, isUser && styles.messageRowUser]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            msg.isError && styles.errorBubble,
          ]}
        >
          {isUser || msg.isError ? (
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {msg.text}
            </Text>
          ) : (
            <Markdown style={markdownStyleSheet}>{msg.text}</Markdown>
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
          style={styles.iconButton}
          onPress={() => navigation.navigate("Landing")}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Zustand AI</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={logout}
          accessibilityLabel="Logout"
        >
          <Entypo name="log-out" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(renderMessage)}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#8E8E93" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <Animated.View style={[styles.inputContainer, { marginBottom: keyboardOffset }]}>
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
            style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
            disabled={!message.trim() || isLoading}
            accessibilityLabel="Send message"
          >
            <Feather name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  iconButton: {
    backgroundColor: "#2C2C2E",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 20,
  },

  messageRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  messageRowUser: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "85%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  userBubble: {
    backgroundColor: "#2C5282",
  },

  assistantBubble: {
    backgroundColor: "#2C2C2E",
  },

  errorBubble: {
    backgroundColor: "#3D1F1F",
  },

  messageText: {
    color: "#E0E0E0",
    fontSize: 16,
    lineHeight: 22,
  },

  userMessageText: {
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

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },

  loadingText: {
    color: "#8E8E93",
    fontSize: 14,
    marginLeft: 8,
  },

  inputContainer: {
    paddingHorizontal: 16,
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

  markdownBody: {
    color: "#E0E0E0",
    fontSize: 16,
    lineHeight: 22,
  },

  markdownCodeInline: {
    backgroundColor: "#3A3A3C",
    color: "#FFFFFF",
  },

  markdownFence: {
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
  },

  markdownLink: {
    color: "#5A9EFF",
  },

  markdownHeading: {
    color: "#FFFFFF",
    marginVertical: 4,
  },

  markdownListItem: {
    color: "#E0E0E0",
  },

  markdownBulletListIcon: {
    color: "#E0E0E0",
  },
});

const markdownStyleSheet = {
  body: styles.markdownBody,
  code_inline: styles.markdownCodeInline,
  fence: styles.markdownFence,
  link: styles.markdownLink,
  heading1: styles.markdownHeading,
  heading2: styles.markdownHeading,
  heading3: styles.markdownHeading,
  heading4: styles.markdownHeading,
  list_item: styles.markdownListItem,
  bullet_list_icon: styles.markdownBulletListIcon,
};

export default ChatPage;
