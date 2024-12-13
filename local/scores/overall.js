import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";

// Function to update the overall score in the database
const pushOverallScore = async (score, userId) => {
  try {
    // Update the overall score for the user in the database
    const { error } = await supabase
      .from("userstats")
      .update([{ overall_score: score }])
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    console.error("Error pushing overall score:", err);
  }
};

// Helper function to fetch the individual scores from the database
const fetchUserScores = async (userId) => {
  try {
    // Fetch the individual scores (Flexibility, Strength, Speed, Endurance)
    const { data, error } = await supabase
      .from("userstats") // Replace with your actual table name
      .select("flex_score, str_score, spd_score, end_score")
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    // Handle case where no scores are found
    if (!data || data.length === 0) {
      Alert.alert(
        "No Scores Found",
        "Please log your workouts to calculate your scores."
      );
      return null;
    }

    // Return the individual scores directly
    const { flex_score, str_score, spd_score, end_score } = data[0];
    return { flex_score, str_score, spd_score, end_score };
  } catch (err) {
    console.error("Error fetching scores:", err);
  }
};

// Function for calculating the overall score
export const calculateOverall = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data) {
      Alert.alert("User is not logged in");
      return;
    }

    const userId = data.user.id;
    const userScores = await fetchUserScores(userId);

    if (!userScores) {
      return; // Exit if no scores were found
    }

    const { flex_score, str_score, spd_score, end_score } = userScores;

    // Validate that all scores are available and out of 100
    if (
      flex_score === null ||
      str_score === null ||
      spd_score === null ||
      end_score === null
    ) {
      Alert.alert(
        "Incomplete Scores",
        "Make sure all workout scores are recorded."
      );
      return;
    }

    // Calculate overall score
    const overallScore = (flex_score + str_score + spd_score + end_score) / 4;

    // Cap overall score at 100
    const cappedScore = Math.min(overallScore, 100);

    // Push the overall score to the database
    await pushOverallScore(cappedScore, userId);
    /*
    Alert.alert(
      "Overall Score Calculated",
      `Your overall score is ${cappedScore.toFixed(2)}`
    );
    */
  } catch (err) {
    console.error("Error calculating overall score:", err);
    Alert.alert(
      "Error",
      "There was an issue calculating your overall score. Please try again."
    );
  }
};
