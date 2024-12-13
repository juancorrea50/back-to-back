import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

const LoadingScreen = () => {
  const router = useRouter(); // Initialize router

  // Fetch session and user profile data
  const fetchSessionAndProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("User is not logged in or session is invalid.");
        return "Login"; // Navigate to login if no session
      }

      const userId = sessionData.session.user.id;

      // Fetch user profile to check for username
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single(); // Fetch single user profile

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        Alert.alert("Error", "Failed to fetch profile data");
        return "ErrorScreen"; // Navigate to an error screen if needed
      }

      // Check if username exists in the user profile
      if (!userProfile?.username) {
        return "signUp/afterSignUp"; // Redirect to AfterSignUp if username is missing
      }

      return "HomeScreen"; // If username exists, navigate to home or appropriate screen
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred");
      return "ErrorScreen"; // Navigate to an error screen if needed
    }
  };

  useEffect(() => {
    const navigateAfterLoading = async () => {
      const destination = await fetchSessionAndProfile();
      setTimeout(() => {
        router.push(destination);
      }, 3000); // 3 seconds to match the loading animation
    };

    navigateAfterLoading();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/Loading-Screen.json")}
        autoPlay
        loop={false} // Ensure the animation doesn't loop infinitely
        style={styles.animation}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  animation: {
    width: width,
    height: height,
  },
});

export default LoadingScreen;