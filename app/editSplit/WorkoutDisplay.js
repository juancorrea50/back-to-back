import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Share,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import Tooltab from "../tooltab";
import style from "../styling";

export default function WorkourDisplay() {
  const [workoutData, setWorkoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    strength_score: 0,
  });
  const router = useRouter();

  const styles = style.workSum;

  // Fetch user workout splits
  useEffect(() => {
    const fetchUserSplits = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("User is not logged in or session is invalid.");
          return;
        }

        const userId = sessionData.session.user.id;

        // Fetch user stats
        const { data: statsData, error: statsError } = await supabase
          .from("userstats")
          .select("*")
          .eq("id", userId);

        if (statsError) throw new Error(statsError.message);
        if (!statsData || statsData.length === 0) {
          Alert.alert(
            "No Stats Recorded",
            "Log your workouts to see your scores!"
          );
        } else {
          setUserStats(statsData[0]);
        }

        // Fetch Split Data
        const { data: splitsData, error: splitsError } = await supabase
          .from("user_splits")
          .select("split_data")
          .eq("userID", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (splitsError || !splitsData?.split_data) {
          console.error(
            "Error fetching user splits data:",
            splitsError || "No data"
          );
          Alert.alert("Error", "Failed to load workout data.");
          return;
        }

        setWorkoutData(splitsData.split_data.flat());
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSplits();
  }, []);

  // Handle actions like saving, sharing, or discarding the workout
  const handleDiscardWorkout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("user_splits")
        .delete()
        .eq("splitID", workoutData[0]?.workout_id);
      if (error) throw new Error(error.message);
      Alert.alert("Success", "Your workout was deleted.");
      router.push("../../HomeScreen");
    } catch (err) {
      console.error("Error discarding workout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkout = () => {
    Alert.alert("Success", "Your workout was saved.");
    router.push("../../HomeScreen");
  };

  const handleShare = async () => {
    if (!workoutData) return;

    // Grab today's date
    const todayDate = new Date().toLocaleDateString();

    // Build the message with all workout details
    let workoutSummary = `Workout Summary (${todayDate}): 💪\n`;
    workoutData.forEach((workout) => {
      workoutSummary += `Workout: ${workout.workout}\nReps: ${workout.reps}\nSets: ${workout.sets}\n\n`;
    });

    // Add strength score to the message
    const shareMessage = `${workoutSummary}Strength Score: ${userStats.str_score}%`;

    try {
      await Share.share({ message: shareMessage });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share workout data. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD95A" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!workoutData || workoutData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.text}>No workout data found.</Text>
      </View>
    );
  }

  // Calculate strength score from the workout data
  const strengthScore = userStats.str_score;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Tooltab />
      </View>

      {/* Workout Summary */}
      <View style={styles.workoutHeader}>
        <Text style={styles.title}>Workout Summary</Text>
        <Text style={styles.subTitle}>
          Date: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* List Workouts */}
      <ScrollView style={styles.workoutList}>
        {workoutData.map((workout, index) => (
          <View key={index} style={styles.workoutCard}>
            <Text style={styles.workoutTextTitle}>{workout.workout}</Text>
            {/* Display workout type */}
            <Text style={styles.workoutText}>Reps | {workout.reps}</Text>
            {/* Display reps */}
            <Text style={styles.workoutText}>Sets | {workout.sets}</Text>
            {/* Display sets */}
          </View>
        ))}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleSaveWorkout}>
          <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
