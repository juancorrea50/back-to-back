import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import styling from "../styling";

const reps = Array.from({ length: 20 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));
const sets = Array.from({ length: 6 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

export default function EditMenu() {
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusReps, setIsFocusR] = useState(false);
  const [isFocusSets, setIsFocusS] = useState(false);
  const [workoutSelections, setWorkoutSelections] = useState(
    Array(5).fill({ workout: "", reps: "", sets: "" })
  );
  const [workoutAPI, setWorkoutAPI] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Initialize refreshKey
  const router = useRouter();

  const styles = styling.splitsMenu;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("User is not logged in or session is invalid.");
        }

        const { data: workoutData, error: statsError } = await supabase
          .from("lifts")
          .select("*");
        if (statsError) throw new Error(statsError.message);

        setWorkoutAPI(workoutData || []);
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Filter out invalid entries (where workout or reps is empty)
      const validWorkoutSelections = workoutSelections.filter(
        (selection) =>
          selection.workout !== "" &&
          selection.reps !== "" &&
          selection.sets !== ""
      );

      // Check if there are any valid entries
      if (validWorkoutSelections.length === 0) {
        Alert.alert(
          "Validation Error",
          "Please ensure each workout has a name and a number of reps."
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_splits") // Replace with your table name
        .insert([
          {
            split_data: validWorkoutSelections, // Save only the valid selections
          },
        ]);

      if (error) throw error;

      router.push("/editSplit/WorkoutDisplay");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to save workout split.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWorkoutSelections(Array(5).fill({ workout: "", reps: "", sets: "" }));
    setRefreshKey((prev) => prev + 1); // Increment refreshKey to trigger a re-render
  };

  return (
    <View key={refreshKey}>
      <View style={styles.editOptionContainer}>
        {workoutSelections.map((_, index) => (
          <View key={index} style={styles.editOption}>
            <Dropdown
              placeholderStyle={{ fontSize: 20, color: "#FFD95A" }}
              style={styles.workoutDropdown}
              selectedTextStyle={{ fontSize: 20, color: "#FFD95A" }}
              data={workoutAPI}
              labelField="lift_name"
              valueField="lift_name"
              placeholder={!isFocus ? "Workout" : "..."}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setWorkoutSelections((prev) =>
                  prev.map((selection, i) =>
                    i === index
                      ? { ...selection, workout: item.lift_name }
                      : selection
                  )
                );
                setIsFocus(false);
              }}
            />
            <Dropdown
              placeholderStyle={{ fontSize: 20, color: "#FFD95A" }}
              style={styles.repsDropdown}
              selectedTextStyle={{ fontSize: 20, color: "#FFD95A" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              data={reps}
              placeholder={!isFocusReps ? "Reps" : "..."}
              onFocus={() => setIsFocusR(true)}
              onBlur={() => setIsFocusR(false)}
              onChange={(item) => {
                setWorkoutSelections((prev) =>
                  prev.map((selection, i) =>
                    i === index ? { ...selection, reps: item.value } : selection
                  )
                );
                setIsFocusR(false);
              }}
            />
            <Dropdown
              placeholderStyle={{ fontSize: 20, color: "#FFD95A" }}
              style={styles.setsDropdown}
              selectedTextStyle={{ fontSize: 20, color: "#FFD95A" }}
              maxHeight={250}
              labelField="label"
              valueField="value"
              data={sets}
              placeholder={!isFocusSets ? "Sets" : "..."}
              onFocus={() => setIsFocusS(true)}
              onBlur={() => setIsFocusS(false)}
              onChange={(item) => {
                setWorkoutSelections((prev) =>
                  prev.map((selection, i) =>
                    i === index ? { ...selection, sets: item.value } : selection
                  )
                );
                setIsFocusS(false);
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: Dimensions.get("window").width,
        }}
      >
        <TouchableOpacity style={styles.editMenuButton} onPress={handleSubmit}>
          <Text style={styles.editMenuButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editMenuButton} onPress={handleReset}>
          <Text style={styles.editMenuButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
