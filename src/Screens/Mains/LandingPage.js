import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import useAuthStore from "../../Context/authStore";

const WELCOME_INFO = [
  "Ask any question about Zustand documentation",
  "Get answers powered by RAG + Gemini AI",
  "Responses include source references from the docs",
];

const LandingPage = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={logout} accessibilityLabel="Logout">
          <Entypo name="log-out" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Zustand AI</Text>

        {WELCOME_INFO.map((item, index) => (
          <View key={index} style={styles.infoCard}>
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("Chat")}
          activeOpacity={0.8}
          accessibilityLabel="Start Chatting"
        >
          <Text style={styles.startButtonText}>Start Chatting</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "flex-end",
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

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 40,
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

  startButton: {
    backgroundColor: "#3C4043",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 20,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LandingPage;
