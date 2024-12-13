// HomeScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import style from "./styling";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const styles = style.homeScreen;
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Array of challenge images
  const challengeImages = [
    require("../assets/weekly-challenge.png"),
    require("../assets/Intermediate-Photo 1.png"),
    require("../assets/beginner-photo 1.png"),
  ];

  // Animation function
  const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500, // Duration of fade-out
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 500, // Duration of fade-in
        useNativeDriver: true,
      }),
    ]).start();
  };

  //Gather UserName
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % challengeImages.length
      );
    }, 5000); // 3 seconds

    //Fetch Profile username
    const fetchUserProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("User is not logged in or session is invalid.");
        }

        const userId = sessionData.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          Alert.alert("Error", "Failed to load profile image");
          return;
        }

        setProfileName(profileData.username || "No Username");
      } catch (error) {
        console.error("Error loading avatar URL:", error);
        Alert.alert("Error", error.message || "Failed to load profile image");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  //Handle UserPofile
  const handleUserProfile = async () => {
    /*const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
    }*/

    //Alert.alert('UserProfile has been pressed.');
    //Navigate to UserProfile Screen
    router.push("/UserProfile");
  };

  //Handle Workout
  const handleWorkout = () => {
    //router.push('/map/RunningScreen');
    try {
      router.push("/workoutRoute/WorkoutSelection");
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", error.message || "Failed to navigate");
    }
    //Navigate to Workout Screen
  };

  //Handle Groups
  const handleCommunity = () => {
    //Alert.alert('Community button has been pressed.');
    //Navigate to Group Screen
    router.push("/Groups/LoadingScreenGrp");
    //router.push('/Groups/GroupSelection');
  };
  //Handle StartNow
  const handleStartNow = () => {
    //Navigate to Weekly Challenge Screen
    router.push("/workoutRoute/WeightWorkouts");
  };

  const handleViewLifts = () => {
    router.push("/workoutRoute/WorkoutSummary");
  };

  const handleViewRuns = () => {
    router.push("/map/RunningList");
  };

  //Handle Stats
  const handleStats = () => {
    //Navigate to Stats Screen
    router.push("/statCard");
  };

  //Handle ProgTrack
  const handleSplit = () => {
    //Alert.alert('Split button has been pressed.');
    //Navigate to Progress Tracking Screen
    router.push("/splitRoute/splitEdit");
  };

  //Handle Recommendation Widgets
  const handleRecommendation = () => {
    Alert.alert("Recommend Widget has been pressed.");
    //Navigate to Recommendation Screen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>Hi, {profileName}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleUserProfile}>
              <View style={styles.iconContainer}>
                <Image
                  source={require("../assets/User.png")} // Replace with actual image
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subHeaderText}>It's time to go back to back</Text>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navButton} onPress={handleWorkout}>
          <Image
            source={require("../assets/workout.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleSplit}>
          <Image
            source={require("../assets/progress-tracking.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>Splits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleStats}>
          <Image
            source={require("../assets/nutrition.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleCommunity}>
          <Image
            source={require("../assets/community.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>Groups</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.activityHeader}>
        <Text style={styles.myActivityText}>My Activity</Text>
      </View>
      {/* Weekly Challenges */}
      <ScrollView style={styles.sideways} horizontal={true}>
        <View style={styles.challengeContainer}>
          <View style={styles.cardChallengeContainer}>
            <View style={styles.challengeTextContainer}>
              <Text style={styles.challengeTitle}>Current {"\n"}Split</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartNow}
              >
                <Text style={styles.startButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={challengeImages[currentImageIndex]} // Replace with actual image
              style={styles.challengeImage}
            />
          </View>
        </View>

        {/* Weekly Challenges */}
        <View style={styles.challengeContainer}>
          <View style={styles.cardChallengeContainer}>
            <View style={styles.challengeTextContainer}>
              <Text style={styles.challengeTitle}>My {"\n"}Runs</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleViewRuns}
              >
                <Text style={styles.startButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={challengeImages[currentImageIndex]} // Replace with actual image
              style={styles.challengeImage}
            />
          </View>
        </View>

        {/* Weekly Challenges */}
        <View style={styles.challengeContainer}>
          <View style={styles.cardChallengeContainer}>
            <View style={styles.challengeTextContainer}>
              <Text style={styles.challengeTitle}>My {"\n"}Split</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleViewLifts}
              >
                <Text style={styles.startButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={challengeImages[currentImageIndex]} // Replace with actual image
              style={styles.challengeImage}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
