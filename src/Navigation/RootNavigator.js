// navigation/RootNavigator.jsx
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import useAuthStore from "../Context/authStore";

// Auth screens
import LoginPage from "../Screens/Auth/LoginPage";
import SignUpPage from "../Screens/Auth/SignUpPage";

// Main screens
import LandingPage from "../Screens/Mains/LandingPage";
import ChatPage from "../Screens/Mains/ChatPage";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isHydrated, hydrate } = useAuthStore();

  // Runs once on app start — reads SecureStore + verifies session
  useEffect(() => {
    hydrate();
  }, []);

  // Still reading SecureStore — don't render anything yet
  // Without this, navigator flashes Login screen before hydration finishes
  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Chat" component={ChatPage} />
          </>
        ) : (
          <>
            <Stack.Screen name="Signup" component={SignUpPage} />
            <Stack.Screen name="Login" component={LoginPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RootNavigator;
