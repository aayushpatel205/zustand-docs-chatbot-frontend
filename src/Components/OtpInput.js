import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OtpInput = ({ length = 6, onChangeCode = () => {} }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const refs = useRef([]);

  const handleOtpChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    onChangeCode(newOtp.join(""));

    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => (refs.current[index] = el)}
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(e) => handleBackspace(e, index)}
          autoFocus={index === 0}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  otpInput: {
    backgroundColor: "#303134",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 14,
    width: 54,
    height: 64,
    borderWidth: 1,
    borderColor: "#303134",
  },
});

export default OtpInput;