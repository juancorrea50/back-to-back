import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Video } from "expo-av"; // Import expo-av Video
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase";
import { calculateStrength } from "../../local/scores/strength";
import style from "../styling";
import { calculateFlexibility } from "../../local/scores/flexibility";
import { calculateEndurance } from "../../local/scores/endurance";
import { calculateOverall } from "../../local/scores/overall";

// Video mapping based on workout types
const workoutVideos = {
  Bench: require("../../assets/bench-press.mp4"),
  Squat: require("../../assets/squat.mp4"),
  "Push Ups": require("../../assets/push-ups.mp4"),
  "Sit Ups": require("../../assets/sit-ups.mp4"),
  Curls: require("../../assets/curls.mp4"),
};

export default function WorkoutWalkthrough() {
  const [workoutData, setWorkoutData] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Navigation router
  const styles = style.workoutWeightPre;

  useEffect(() => {
    setIsLoading(true);
    const fetchUserSplits = async () => {
      try {
        // Get the session data from Supabase
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("User is not logged in or session is invalid.");
          return;
        }

        const userId = sessionData.session.user.id;

        // Fetch the latest user_splits entry for the logged-in user
        const { data: splitsData, error: splitsError } = await supabase
          .from("user_splits")
          .select("split_data")
          .eq("userID", userId)
          .order("created_at", { ascending: false }) // Order by created_at, latest first
          .limit(1)
          .single(); // Fetch the latest entry

        if (splitsError && splitsError.code !== "PGRST116") {
          console.error("Error fetching user splits data:", splitsError);
          Alert.alert("Error", "Failed to load user split information");
          router.push("HomeScreen");
          return;
        }

        if (!splitsData || !splitsData.split_data) {
          console.log("No split data found for the user.");
          Alert.alert("No Data", "No workout splits found. Please create a split.");
          router.push("HomeScreen");
          return;
        }

        // Parse the split data and add video sources
        const fetchedWorkoutData = splitsData.split_data
          .flat()
          .map((workout) => ({
            ...workout,
            video: workoutVideos[workout.workout] || null, // Assign video or null
          }));

        //console.log("Fetched workout data:", fetchedWorkoutData);

        // Update the state with fetched workout data
        setWorkoutData(fetchedWorkoutData);
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred");
      }

      setIsLoading(false);
    };

    fetchUserSplits();
  }, []);

  const handleNext = async () => {
    if (currentExercise < workoutData.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      await calculateStrength();
      await calculateFlexibility();
      await calculateOverall();
      router.push("workoutRoute/WorkoutSummary"); // Redirect to home or desired screen
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const exercise = workoutData[currentExercise];

  // Function to get unique instructions based on workout type
  const getInstructions = (workoutType) => {
    switch (workoutType) {
      case "Push Ups":
        return "Place your hands slightly wider than shoulder-width apart. Lower your body until your chest almost touches the floor, then push back up.";
      case "Sit Ups":
        return "Lie on your back with knees bent. Cross your arms over your chest or place them behind your head. Curl up toward your knees, then lower back down.";
      case "Curls":
        return "Stand with feet shoulder-width apart. Hold a dumbbell in each hand, curl the weights up towards your shoulders, then lower slowly.";
      case "Squat":
        return "Stand with feet shoulder-width apart. Lower your body until your thighs are parallel to the floor, then return to standing.";
      case "Bench":
        return "Lie on the bench with feet on the floor. Lower the bar to your chest and press it back up.";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {/* Exercise Content */}
      {exercise ? (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Use Video component from expo-av */}
          {exercise.video && (
            <Video
              source={exercise.video} // Video for the current workout
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping
              useNativeControls
            />
          )}
          <Text style={styles.exerciseName}>{exercise.workout}</Text>
          <Text style={styles.description}>
            {getInstructions(exercise.workout)}
          </Text>
          <Text style={styles.timer}>
            Reps: {exercise.reps} | Sets: {exercise.sets}
          </Text>
        </ScrollView>
      ) : (
        <Text>Loading workout...</Text>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentExercise > 0 && (
          <TouchableOpacity onPress={handlePrevious}>
            <LinearGradient
              colors={["#FFD95A", "#FFFFFF", "#CCAE48"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext}>
          <LinearGradient
            colors={["#FFD95A", "#FFFFFF", "#CCAE48"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {currentExercise < workoutData.length - 1 ? "Next" : "Finish"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
