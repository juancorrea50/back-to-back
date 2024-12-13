import MapView, { Polyline } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { calculateSpeed } from "../../local/scores/speed";
import { calculateEndurance } from "../../local/scores/endurance";
import * as Location from "expo-location";
import style from "../styling.js";
import { calculateOverall } from "../../local/scores/overall";
import Tooltab from "../tooltab";

export default function RunningScreen() {
  const router = useRouter();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [polyArray, setPolyArray] = useState([]);
  const [showEndButton, setShowEndButton] = useState(false);
  const [region, setRegion] = useState({
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
    latitude: 32.32323232,
    longitude: 32.32323232,
  });

  const styles = style.runScreen;

  const [running, setRunning] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
        latitude,
        longitude,
      });

      if (running) {
        setPolyArray((polyArray) => [
          ...polyArray,
          {
            longitude: longitude,
            latitude: latitude,
          },
        ]);
      }

      setLocations([{ latitude, longitude }]); // Initialize with current location
    };

    getLocation();
    console.log(polyArray);
    const intervalId = setInterval(getLocation, 5000);
    return () => clearInterval(intervalId);
  }, [running]);

  useEffect(() => {}, [locations]);

  const handleStartRun = () => {
    const toggleRunning = () => setRunning((prev) => !prev);
    toggleRunning();
    setShowEndButton(false);
    startTimer();
  };

  const handlePauseRun = () => {
    setRunning(false);
    clearInterval(intervalId);
    setShowEndButton(true);
  };

  const showRunSummary = () => {
    const distanceInMiles = distance.toFixed(2); // Convert meters to miles
    const alertMessage = `Duration: ${formatTime(
      elapsedTime
    )}\nDistance: ${distanceInMiles} miles`;

    //Alert.alert("Run Summary", alertMessage, [{ text: "OK" }]);
  };

  const makeRun = async () => {
    try {
      // INSERT query for supabase workout type scores
      const { error } = await supabase.from("runs").insert([
        {
          run_data: [polyArray],
          run_time: elapsedTime,
          run_distance: distance,
        },
      ]);

      // error handler for if the user is not signed in
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      // error handling for if user has other errors fetching stats
      console.error("Other error:", err);
    } finally {
      // set loading false
      setLoading(false);
    }
  };

  const handleEndRun = async () => {
    setRunning(false);
    clearInterval(intervalId);

    setLoading(true);
    await makeRun();

    await calculateSpeed();
    await calculateEndurance();
    await calculateOverall();

    //Alerts User how much time elapsed and distance ran
    showRunSummary();

    setElapsedTime(0);
    setDistance(0);
    setLocations([]);
    setShowEndButton(false);
    router.push("map/RunningSummary");
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    let locationSubscription;

    const subscribeToLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocations((prevLocations) => [
            ...prevLocations,
            { latitude, longitude },
          ]);

          if (locations.length > 0) {
            const prevLocation = locations[locations.length - 1];
            const dist = getDistanceBetween(prevLocation, newLocation.coords); // Use custom distance function
            setDistance((prevDistance) => prevDistance + dist);
          }
        }
      );
    };

    if (running) {
      subscribeToLocation();
    } else if (locationSubscription) {
      locationSubscription.remove();
    }

    return () => {
      if (locationSubscription) locationSubscription.remove();
      clearInterval(intervalId);
    };
  }, [running]);

  const getDistanceBetween = (loc1, loc2) => {
    const R = 3956; // radius of Earth in miles

    // Haversine formula for calculating distance using coordinates
    // Source for this formula: GeeksForGeeks
    let longitude1 = (loc1.longitude * Math.PI) / 180;
    let longitude2 = (loc2.longitude * Math.PI) / 180;
    let latitude1 = (loc1.latitude * Math.PI) / 180;
    let latitude2 = (loc2.latitude * Math.PI) / 180;

    let dLat = latitude2 - latitude1;
    let dLon = longitude2 - longitude1;
    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c; // returns distance in meters
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        mapType="terrain"
        showsUserLocation={true}
        followsUserLocation={true}
        region={region}
      >
        <Polyline
          coordinates={polyArray}
          strokeColor="black"
          strokeWidth={10}
        />
      </MapView>
      <View style={styles.header}>
        <Tooltab />
      </View>
      <View style={styles.overlay}>
        <View style={styles.row}>
          <View style={styles.quadrant}>
            <Text style={styles.stat}>
              {" "}
              <Text style={styles.statTitle}> Duration {"\n"}</Text>{" "}
              {formatTime(elapsedTime)}{" "}
            </Text>
          </View>
          <View style={styles.quadrant}>
            <Text style={styles.stat}>
              {" "}
              <Text style={styles.statTitle}>Distance {"\n"} </Text>{" "}
              {distance.toFixed(2)} mi
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={running ? handlePauseRun : handleStartRun}
            style={[styles.quadrant, styles.button]}
          >
            <Text style={styles.buttonText}>{running ? "Pause" : "Start"}</Text>
          </TouchableOpacity>

          {showEndButton && (
            <TouchableOpacity
              onPress={handleEndRun}
              style={[styles.quadrant, styles.endButton]}
            >
              <Text style={styles.buttonText}>End Run</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
