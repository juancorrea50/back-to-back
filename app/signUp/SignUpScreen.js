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
  const [password, setPassword] = useState("");
  const [reEnterPass, setReEnterPass] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); //Initialize router

  const styles = style.sus; //implement styling

  // Helper functions to validate email and phone number
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  /*
  const validatePhoneNumber = (phoneNum) => {
    const phoneRegex = /^[0-9]{10}$/; // Only 10 digits for typical phone numbers
    return phoneRegex.test(phoneNum);
  };
  */
  //function to update columns
  //If need more update variables and this function to save into the table
  /*UPDATE FUNCTION FOR HANDLE_NEW_USER TO CONSIDER THE NEW VARIABLE(S) BEFORE TESTING TO ENSURE THE TABLE HAS THE UPDATE SCHEMA
  async function signUp(session, username, phoneNum, email) {
    try {
      //Atempt to update profile
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        //Ensure all variables are put into the update object
        id: session?.user.id,
        username: username,
        email: email,
        phone_number: phoneNum,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      //Catch an error if returned
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      //Finally setloading variable to false
      setLoading(false);
    }
  }
*/
  const handleSignUp = async () => {
    // Array to store error messages
    let errors = [];

    // Validate Password and Re-Entered Password
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if (password !== reEnterPass) {
      errors.push("Passwords do not match.");
    }

    // Validate Email
    if (!validateEmail(email)) {
      errors.push("Please enter a valid email address.");
    }

    // If there are any errors, show them in a single alert
    if (errors.length > 0) {
      Alert.alert("Sign Up Failed", errors.join("\n"));
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "http://localhost:8081", // Replace with the correct URL for redirection
      },
    });

    const session = data?.session;

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    // Check if the user's profile has a username
    if (session?.user) {
      try {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single(); // Fetch a single profile row for the user

        if (profileError) {
          throw profileError;
        }

        // If username is missing or empty, redirect to AfterSignup
        if (!profiles || !profiles.username) {
          router.push("AfterSignup"); // Navigate to AfterSignup screen
          return;
        }

        // Otherwise, navigate to SignInScreen
        router.push("SignInScreen");
      } catch (fetchError) {
        Alert.alert("Error checking profile:", fetchError.message);
      }
    } else {
      Alert.alert("Please check your inbox for email verification!");
    }

    setLoading(false);
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

        {/*
        <Text style={styles.label}>Username*</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        */}

        <Text style={styles.label}>Password*</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Text style={styles.label}>Re-Enter Password*</Text>
        <TextInput
          style={styles.input}
          value={reEnterPass}
          onChangeText={setReEnterPass}
          secureTextEntry={true}
        />

        <Text style={styles.label}>Email*</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        {/*
        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          style={styles.input}
          value={phoneNum}
          onChangeText={setPhoneNum}
          keyboardType="numeric" // Ensure only numeric input
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
