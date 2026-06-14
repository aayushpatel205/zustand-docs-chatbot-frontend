// screens/auth/SignUpPage.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,             
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "../../Context/authStore";  

const SignUpPage = ({ navigation }) => {
  const { register, isLoading } = useAuthStore(); 

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleSignUp = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (userDetails.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      await register(
        userDetails.name.trim(),
        userDetails.email.trim().toLowerCase(),
        userDetails.password
      );
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Sign Up</Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="account-outline"
            size={22}
            color="#9AA0A6"
            style={styles.inputIcon}
          />
          <TextInput
            value={userDetails.name}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, name: text })
            }
            style={styles.input}
            placeholder="Enter Your name"
            placeholderTextColor="#9AA0A6"
            autoCapitalize="words"
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color="#9AA0A6"
            style={styles.inputIcon}
          />
          <TextInput
            value={userDetails.email}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, email: text })
            }
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
            value={userDetails.password}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, password: text })
            }
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9AA0A6"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={22}
              color="#9AA0A6"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          disabled={isLoading}  // ✅ prevent double-tap while request is in flight
        >
          {isLoading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.loginButtonText}>Sign Up</Text>
          }
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signupLink}> Login</Text>
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
  subtitle: {
    fontSize: 16,
    color: "#BDC1C6",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
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
  loginButton: {
    backgroundColor: "#3C4043",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 15,
  },
  loginButtonDisabled: {
    opacity: 0.6,     // ✅ visual feedback when loading
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 30,
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

export default SignUpPage;