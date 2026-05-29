import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginPage = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onLoginPress = () => {
    // Add your login logic here
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Login</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color="#9AA0A6"
            style={styles.inputIcon}
          />
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#9AA0A6"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={22}
            color="#9AA0A6"
            style={styles.inputIcon}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9AA0A6"
            secureTextEntry={!isPasswordVisible}
          />

          <TouchableOpacity
            onPress={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            style={styles.eyeIconContainer}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={22}
              color="#9AA0A6"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>
            Forget Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={onLoginPress}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Create New Account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#202124",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#303134",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 45,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303134",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginVertical: 10,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  eyeIconContainer: {
    padding: 6,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotPasswordText: {
    color: "#BDC1C6",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#3C4043",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 15,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  signupText: {
    color: "#BDC1C6",
    fontSize: 14,
  },
  signupLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginPage;