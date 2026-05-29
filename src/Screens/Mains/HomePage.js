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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Entypo } from "@expo/vector-icons";

const INFO_ITEMS = [
  "Remembers what user said earlier in the conversation",
  "Allows user to provide follow-up corrections With Ai",
  "Limited knowledge of world and events after 2021",
  "May occasionally generate incorrect information",
  "May occasionally produce harmful instructions or biased content",
];

const HomePage = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const keyboardOffset = useRef(new Animated.Value(0)).current;

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

    const onHide = (e) => {
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

  const handleSend = () => {
    if (!message.trim()) return;
    console.log(message);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header — completely outside keyboard logic */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="dots-three-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content — completely outside keyboard logic */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>BrainBox</Text>
        {INFO_ITEMS.map((item, index) => (
          <View key={index} style={styles.infoCard}>
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input bar — Animated.View lifts by exact keyboard height, returns to 0 */}
      <Animated.View style={[styles.inputContainer, { marginBottom: keyboardOffset }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Send a message..."
            placeholderTextColor="#8E8E93"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
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

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 24,
  },

  infoCard: {
    backgroundColor: "#2C2C2E",
    width: "90%",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  infoText: {
    color: "#E0E0E0",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },

  // Animated wrapper — only this lifts/drops
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",       // vertically centers send button with input
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
    fontSize: 18,
    maxHeight: 120,
    marginRight: 10,
    // no paddingVertical here — let alignItems: center handle it
  },

  sendButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePage;