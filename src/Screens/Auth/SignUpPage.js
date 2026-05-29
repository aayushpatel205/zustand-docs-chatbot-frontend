import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import OtpInput from "../../Components/OtpInput";

const SignUpPage = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSignUpPress = () => {
    // Add your signup API call here later
    setPendingVerification(true);
  };

  const onVerifyPress = () => {
    // Add OTP verification logic here later
    console.log("OTP:", code);

    navigation.navigate("Home");
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.container}>
          <Text style={styles.title}>Verify Email</Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {userDetails.email}
          </Text>

          <OtpInput length={6} onChangeCode={setCode} />

          <TouchableOpacity onPress={onVerifyPress} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Verify & Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              setUserDetails({
                ...userDetails,
                name: text,
              })
            }
            style={styles.input}
            placeholder="Enter Your name"
            placeholderTextColor="#9AA0A6"
            autoCapitalize="words"
          />
        </View>

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
              setUserDetails({
                ...userDetails,
                email: text,
              })
            }
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#9AA0A6"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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
              setUserDetails({
                ...userDetails,
                password: text,
              })
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

        <TouchableOpacity onPress={onSignUpPress} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Sign Up</Text>
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
