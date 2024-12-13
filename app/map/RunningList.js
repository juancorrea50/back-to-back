import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator, } from "react-native";
import style from "../styling.js";
import { supabase } from "../../lib/supabase";
import Tooltab from "../tooltab";
import { format } from "date-fns"; // For formatting dates
import MapView, { Polyline } from "react-native-maps";

export default function RecentRuns() {
  const [runs, setRuns] = useState([]);
  const [expandedRuns, setExpandedRuns] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reRender, setReRender] = useState(true);

  const runningScreenStyles = style.runSum2;

  const calculateEndurance = (avgTime, avgDist) => {

    if (avgTime <= 0) {
      avgTime = 1;
    }
    avgTime /= 3600;
    let speed = avgDist / avgTime;
    let score = Math.round(speed * 10 + avgDist / 100);
    if (score > 100) {
      score = 100;
    }
    return score;
  };
  const calculateSpeed = (avgTime, avgDist) => {
    avgDist /= 5;
    avgTime /= 5;
    if(avgTime <= 0){
        avgTime = 1;
    }
    let score = Math.round(Math.sqrt(avgDist/(avgTime/3600)) * 10 + avgDist/(avgTime/3600));
    return score;
    
  };

  const expand = (created_at) => {
    setExpandedRuns((prev) => ({
      ...prev,
      [created_at]: !prev[created_at],
    }));
  };

  const handleDiscardRun = async (created_at) => {
    setIsLoading(true);
    try {
      // delete query for the latest run
      const { error } = await supabase
        .from("runs")
        .delete()
        .eq("created_at", created_at);

      // error handler
      if (error) {
        throw new Error(error.message);
      }

      Alert.alert("Success", "Your run was deleted.");
    } catch (err) {
      // error handling for if user has other errors deleting the run
      console.error("Other error:", err);
    } finally {
      setReRender(true);
      // set loading false
      setIsLoading(false);
      router.push("../../HomeScreen");
    }
  };

  useEffect(() => {
    const fetchRecentRuns = async () => {
      try {
        // Get the session data from Supabase
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("User is not logged in or session is invalid.");
          return;
        }

        const userId = sessionData.session.user.id;

        // Fetch up to 5 latest runs for the logged-in user
        const { data: runsData, error: runsError } = await supabase
          .from("runs")
          .select("created_at, run_distance, run_time, run_data")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (runsError) {
          console.error("Error fetching runs data:", runsError);
          Alert.alert("Error", "Failed to load recent runs.");
          return;
        }

        setRuns(runsData);
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };
    setReRender(false);
    fetchRecentRuns();
  }, [reRender]);

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

  const renderRun = ({ item }) => {
    const minutes = Math.floor(item.run_time / 60); // Calculate whole minutes
    const seconds = item.run_time % 60; // Get remaining seconds

    return (
      <View style={styles.runCard2}>
        <TouchableOpacity style={styles.runCard} onPress={() => expand(item.created_at)}>
          <View style={runningScreenStyles.textContainer}>
            <Text style={styles.runDate}>
              {format(new Date(item.created_at), "yyyy-MM-dd'\n'HH:mm:ss")}
            </Text>
            <Text style={styles.runDetails}>
              Distance: {item.run_distance.toFixed(2)} mi. {"\n"}Duration: {minutes} min{" "}
              {seconds} sec
            </Text>
          </View>
          {/* Endurance Section */}
          <View style={runningScreenStyles.statContainer}>
            <View style={runningScreenStyles.enduranceContainer}>
              <View style={runningScreenStyles.progressCirclePlaceholder}>
                <Text style={runningScreenStyles.enduranceText}>{calculateEndurance(item.run_time, item.run_distance)}%</Text>
              </View>
              <Text style={runningScreenStyles.enduranceLabel}>Endurance</Text>
            </View>
            <View style={runningScreenStyles.enduranceContainer}>
              <View style={runningScreenStyles.progressCirclePlaceholder}>
                <Text style={runningScreenStyles.enduranceText}>{calculateSpeed(item.run_time, item.run_distance)}%</Text>
              </View>
              <Text style={runningScreenStyles.enduranceLabel}>Speed</Text>
            </View>
          </View>
        </TouchableOpacity>

          {/*Render Map When Pressed*/}
          {expandedRuns[item.created_at] && (
            <View>
              <View style={styles.mapPlaceholder}>
                <MapView
                  style={styles.map}
                  mapType="terrain"
                  region={{
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                    latitude: item.run_data[0][0].latitude,
                    longitude: item.run_data[0][0].longitude,
                  }}
                >
                  <Polyline
                    coordinates={item.run_data[0]}
                    strokeColor="black"
                    strokeWidth={10}
                  />
                </MapView>
              </View>
                <TouchableOpacity
                  style={[styles.button, styles.discardButton]}
                  onPress={() => {handleDiscardRun(item.created_at)}}
                >
                  <Text style={styles.buttonText}>Discard Run</Text>
                </TouchableOpacity>
            </View>
          )}
        </View>
        
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Tooltab />
      </View>

      <Text style={styles.header}>Recent Runs</Text>
      {runs.length > 0 ? (
        <FlatList
          data={runs}
          keyExtractor={(item) => item.created_at}
          renderItem={renderRun}
        />
      ) : (
        <Text style={styles.noRunsText}>No recent runs available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:2,
    backgroundColor: "#232323",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFD95A",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  runCard: {
    flexDirection: "row",
    flex: 2,
    padding: 15,
    marginBottom: 2,
    borderColor: "#ccc",
    backgroundColor: "#323232",
  },
  runCard2: {
    flex: 2,
    padding: 15,
    marginBottom: 2,
    borderColor: "#ccc",
    backgroundColor: "#323232",
  },
  runDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD95A",
    marginBottom: 5,
  },
  runDetails: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  noRunsText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 50,
  },
  map: {
    flex: 1,
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    borderRadius: 20,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  button: {
    padding: 12,
    backgroundColor: "#FFD95A",
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  discardButton: {
    backgroundColor: "#FF3333",
    alignItems: "center",
  },
});
