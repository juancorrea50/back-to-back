import React, { useState, useEffect } from "react";
import MapView, { Polyline } from "react-native-maps";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import style from "../styling";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import Tooltab from "../tooltab";
import { calculateEndurance } from "../../local/scores/endurance";

export default function RunningSummary() {
  const [runData, setRunData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userUUID, setUserUUID] = useState("");
  const [runID, setRunID] = useState("");
  const [region, setRegion] = useState({
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
    latitude: 32.32323232,
    longitude: 32.32323232,
  });
  const styles = style.runSum;
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    end_score: 0,
    spd_score: 0,
  });
  const [enduranceScore, setEnduranceScore] = useState(0); // State for endurance score

  useEffect(() => {
    const fetchRunData = async () => {
      try {
        // Get the session data from Supabase
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("User is not logged in or session is invalid.");
          return;
        }

        const userId = sessionData.session.user.id;
        setUserUUID(userId);

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

        // Fetch the most recent run data for the user
        const { data: runsData, error: runsError } = await supabase
          .from("runs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (runsError) {
          console.error("Error fetching run data:", runsError);
          Alert.alert("Error", "Failed to load run information");
          return;
        }

        if (runsData.length > 0) {
          const run = runsData[0];
          setRunData(run); // Set the fetched run data
          setRunID(run.run_id);
          console.log("run ID", run.run_id);
        } else {
          console.log("No run data found for this user.");
          Alert.alert("No Runs", "No recent run data found.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert(
          "Error",
          "An unexpected error occurred while fetching run data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRunData();
  }, []);

  const handleDiscardRun = async () => {
    setIsLoading(true);
    try {
      // delete query for the latest run
      const { error } = await supabase
        .from("runs")
        .delete()
        .eq("run_id", runID);

      // error handler
      if (error) {
        throw new Error(error.message);
      }

      //Alert.alert("Success", "Your run was deleted.");
    } catch (err) {
      // error handling for if user has other errors deleting the run
      console.error("Other error:", err);
    } finally {
      // set loading false
      setIsLoading(false);
      router.push("../../HomeScreen");
    }
  };

  const handleBackPress = () => {
    router.push("../../HomeScreen");
  };

  const handleSaveRun = () => {
    setIsLoading(true);
    //Alert.alert("Success", "Your run was saved.");
    router.push("../../HomeScreen");
    setIsLoading(false);
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

  if (!runData) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Tooltab />
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: 25,
              borderWidth: 2,
              borderColor: "#CCAE48",
              padding: 5,
            }}
          >
            No run data found. Please return to the Home Screen
          </Text>
        </View>
      </View>
    );
  }

  const handleShare = async () => {
    if (!runData) return;

    // Destructure run data and stats
    const { run_distance = 0, run_time = 0, run_data = [] } = runData;
    const avgSpeed = run_distance / (run_time / 3600); // in km/h
    const formattedTime = formatTime(run_time);
    const distanceInMiles = (run_distance * 0.621371).toFixed(2); // Convert km to miles

    const shareMessage = `Run Summary: 🏃
    - Distance: ${distanceInMiles} mi
    - Time: ${formattedTime}
    - Avg Speed: ${avgSpeed.toFixed(2)} mph
    - Endurance Score: ${userStats.end_score}%
    - Speed Score: ${userStats.spd_score}%`;

    try {
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share run data.");
    }
  };

  //console.log("Displaying run data:", runData); // Debugging output

  // Safely destructure runData with default values
  const {
    run_distance = 0, // in kilometers
    run_time = 0, // in seconds
    endurance = 0,
    run_data = [],
    created_at,
  } = runData;

  const longitude = run_data[0][0].longitude;
  const latitude = run_data[0][0].latitude;

  //console.log(run_data[0]);

  // Calculate the average speed (in km/h)
  const avgSpeed = run_distance / (run_time / 3600); // convert seconds to hours

  // Convert time to hh:mm:ss format
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formattedTime = formatTime(run_time);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <Tooltab />
        </View>
      </View>

      {/* Run Summary */}
      <View style={styles.runHeader}>
        <Text style={styles.title}>Run Summary</Text>
        <Text style={styles.subTitle}>
          Date: {new Date(created_at).toLocaleDateString()}
        </Text>
      </View>

      <MapView
        style={styles.mapDisplay}
        mapType="terrain"
        region={{
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
          latitude,
          longitude,
        }}
      >
        <Polyline
          coordinates={run_data[0]}
          strokeColor="black"
          strokeWidth={10}
        />
      </MapView>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{run_distance.toFixed(2)} mi</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formattedTime}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgSpeed.toFixed(2)} mph</Text>
          <Text style={styles.statLabel}>Avg Speed</Text>
        </View>
      </View>

      {/* Endurance Section */}
      <View style={styles.statContainer}>
        <View style={styles.enduranceContainer}>
          <View style={styles.progressCirclePlaceholder}>
            <Text style={styles.enduranceText}>{userStats.end_score}%</Text>
          </View>
          <Text style={styles.enduranceLabel}>New Endurance</Text>
        </View>
        <View style={styles.enduranceContainer}>
          <View style={styles.progressCirclePlaceholder}>
            <Text style={styles.enduranceText}>{userStats.spd_score}%</Text>
          </View>
          <Text style={styles.enduranceLabel}>New Speed</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleSaveRun}>
          <Text style={styles.buttonText}>Save Run</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share Run</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.discardButton]}
          onPress={handleDiscardRun}
        >
          <Text style={styles.buttonText}>Discard Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
