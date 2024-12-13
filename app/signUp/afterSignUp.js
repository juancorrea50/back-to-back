import React, { useState } from "react";
import style from "../styling";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { AppState } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize router

  const styles = style.sus; // Implement styling

  // Helper functions to validate email and phone number
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNum) => {
    const phoneRegex = /^[0-9]{10}$/; // Only 10 digits for typical phone numbers
    return phoneRegex.test(phoneNum);
  };

  // Function to update the user profile
  const handleEditField = async (field, newValue) => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) throw new Error("User session not found.");

      const userId = sessionData.session.user.id;
      const updates =
        field === "username" ? { username: newValue } : { email: newValue };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) {
        console.error(`Error updating ${field}:`, error);
        Alert.alert("Error", `Failed to update ${field}`);
        return;
      }

      // Update local state if successful
      if (field === "username") {
        setUsername(newValue);
      }
    } catch (err) {
      console.error("Error updating field:", err);
      Alert.alert("Error", err.message || `Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Array to store error messages
    let errors = [];
    console.log("Button has pressed");

    // Validate Username
    if (username.trim() === "") {
      errors.push("Username is required.");
    }

    // If there are any errors, show them in a single alert
    if (errors.length > 0) {
      Alert.alert("Sign Up Failed", errors.join("\n"));
      return;
    }
    setLoading(true);

    // After successful sign-up, update user profile in the "profiles" table
    await handleEditField("username", username); // Update username
    //await handleEditField("email", email); // Update email

    // If all validations pass and profile is updated
    router.push("../HomeScreen"); // Navigate to the SignIn screen
  };

  return (
    <View style={styles.container}>
      {/* Sign Up Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Sign up</Text>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subText}>Please fill the following fields.</Text>
        </View>
      </View>

      {/* SignUp Form Container */}
      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/Logo-White.png")} //use Logo
          style={styles.image}
        />

        <Text style={styles.label}>Username*</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/*
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" // Ensure email format input
        />

        <Text style={styles.label}>* = required</Text> */}
      </View>

      {/* Sign Up Button */}
      <LinearGradient
        style={styles.button}
        colors={["#FFD95A", "#FFFFFF", "#CCAE48"]}
      >
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
