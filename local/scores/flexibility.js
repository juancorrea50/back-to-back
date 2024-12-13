import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";

let workoutsData;

const pushFlexibilityScore = async (score, userId) => {
  try {
    // Update the flexibility score for the user in the database
    const { error } = await supabase
      .from("userstats")
      .update([{ flex_score: score }])
      .eq("id", userId);

    // Error handler for if the user is not signed in or other issues
    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    // Error handling for if user has other errors fetching stats
    console.error("Error pushing flexibility score:", err);
  }
};

const fetchUserWorkouts = async (userId) => {
  try {
    // Fetch the recent workout data from Supabase
    const { data, error } = await supabase
      .from("user_splits") // Replace with your actual table name
      .select("split_data")
      .eq("userID", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Error handler if there are issues fetching the data
    if (error) {
      throw new Error(error.message);
    }

    // Handle case where no workout data is found
    if (!data || data.length === 0) {
      Alert.alert(
        "No Workouts Recorded",
        "Log your workouts to calculate flexibility!"
      );
      return;
    } else {
      workoutsData = data;
    }
  } catch (err) {
    // Error handling for if there are issues fetching the stats
    console.error("Error fetching workouts:", err);
  }
};

/* Helper function for gathering user workout data */
const fetchWorkoutData = async () => {
  // Get the user profile
  const { data, error } = await supabase.auth.getUser();

  // Error handling to check if user is signed in
  if (error || !data) {
    Alert.alert("User is not logged in");
    return;
  }

  const userId = data.user.id;
  await fetchUserWorkouts(userId);
};

/* Function for calculating the flexibility score */
export const calculateFlexibility = async () => {
  try {
    let totalFlexibility = 0;
    let totalWorkouts = 0;

    await fetchWorkoutData();

    // Exercise factors for different workout types
    const exerciseFactors = {
      Bench: 0.25,
      Squat: 0.75,
      "Push ups": 0.75,
      "Sit Ups": 1,
      Curls: 0.25,
    };

    // Loop through the fetched workout data to calculate flexibility
    workoutsData.forEach((record) => {
      const workoutData = record.split_data || [];
      //console.log("Fetched workout data:", workoutData);

      // Flatten workoutData if it's an array of arrays
      const flatWorkoutData = workoutData.flat();

      // Loop through each exercise entry
      flatWorkoutData.forEach((exerciseEntry) => {
        // Log the exercise entry to check its structure
        //console.log("Exercise entry:", exerciseEntry);

        const { reps, sets, workout } = exerciseEntry;

        // Check if required fields are missing or invalid
        if (
          !workout ||
          typeof reps !== "number" ||
          typeof sets !== "number" ||
          sets <= 0 ||
          reps <= 0
        ) {
          console.warn("Skipping invalid exercise entry:", exerciseEntry);
          return; // Skip invalid entry
        }

        const factor = exerciseFactors[workout] || 1; // Default factor is 1 if no specific factor is defined
        totalFlexibility += sets * reps * factor;
        totalWorkouts += 1; // Count valid workouts
      });
    });

    // Check if any valid workouts were found
    if (totalWorkouts === 0) {
      Alert.alert(
        "No valid workouts",
        "Please log valid workouts to calculate flexibility."
      );
      return;
    }

    // Calculate and cap the flexibility score at 100
    let flexibilityScore = Math.round(totalFlexibility / totalWorkouts);
    if (flexibilityScore > 100) {
      flexibilityScore = 100;
    }

    // Push the calculated flexibility score to the database
    const { data, error } = await supabase.auth.getUser();
    if (error || !data) {
      Alert.alert("User is not logged in");
      return;
    }
    const userId = data.user.id;
    await pushFlexibilityScore(flexibilityScore, userId);

    /*Success message
    Alert.alert(
      "Flexibility Calculated",
      `Your flexibility score is ${flexibilityScore}`
    );*/
  } catch (err) {
    // Error handling for issues during the flexibility calculation process
    console.error("Error calculating flexibility:", err);
    Alert.alert(
      "Error",
      "There was an issue calculating your flexibility. Please try again."
    );
  }
};
