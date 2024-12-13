import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from "react-native";
import { supabase } from "../lib/supabase";
import style from "./styling.js"; // Assuming styling is defined in styling.js
import { calculateSpeed } from "../local/scores/speed";
import { calculateEndurance } from "../local/scores/endurance";
//import { calculateStrength } from "../local/scores/strength";
//import { calculateFlexibility } from "../local/scores/flexibility";
//import { calculateOverall } from "../local/scores/overall";
import Tooltab from "./tooltab";
import { useRouter } from "expo-router";

export default function StatCard() {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [profileName, setProfileName] = useState("No Username");
  const [userStats, setUserStats] = useState({
    str_score: 0,
    end_score: 0,
    spd_score: 0,
    flex_score: 0,
    overall_score: 0,
  });

  const cardRef = useRef(null); // Ref for the card container
  const styles = style.statCard;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("User is not logged in or session is invalid.");
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

        // Fetch avatar URL
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("avatar_url, username")
          .eq("id", userId)
          .single();

        if (profileError) throw new Error(profileError.message);
        setAvatarUrl(profileData.avatar_url || null);
        setProfileName(profileData.username || "No Username");
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    const updateStats = async () => {
      await calculateSpeed();
      await calculateEndurance();
      //await calculateStrength();
      //await calculateFlexibility();
      //await calculateOverall();
    };
    updateStats();
    fetchData();
  }, []);

  // Function to handle the share action
  const handleShareCard = async () => {
    try {
      const result = await Share.share({
        message: `Check out my fitness stats on Back2Back! 💪\n\n
      Overall Score: ${userStats.overall_score}\n
      Strength: ${userStats.str_score}\n
      Flexibility: ${userStats.flex_score}\n
      Endurance: ${userStats.end_score}\n
      Speed: ${userStats.spd_score}\n\n
      Join me in achieving your fitness goals! 🚀`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via activity: ${result.activityType}`);
        } else {
          console.log("Content shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      Alert.alert("Error", "Failed to share content. Please try again.");
    }
  };

  const handleBackPress = () => router.back();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Tooltab />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Header with username */}
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{profileName}</Text>
            <Text style={styles.overall}>
              Overall {userStats.overall_score.toFixed(0)}
            </Text>
          </View>

          {/* Avatar Image */}
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../assets/memberPlaceholder.jpg")
            }
            style={styles.image}
          />

          {/* Stats Section */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${0.6 * userStats.str_score + 40}%`,
                    backgroundColor: "#FF4F4B",
                  },
                ]}
              >
                <Text style={styles.statText}>Strength</Text>
              </View>
              <Text style={styles.statValue}>{userStats.str_score}</Text>
            </View>
            <View style={styles.stat}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${0.6 * userStats.flex_score + 40}%`,
                    backgroundColor: "#BF77F6",
                  },
                ]}
              >
                <Text style={styles.statText}>Flexibility</Text>
              </View>
              <Text style={styles.statValue}>{userStats.flex_score}</Text>
            </View>
            <View style={styles.stat}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${0.6 * userStats.end_score + 40}%`,
                    backgroundColor: "#659BDF",
                  },
                ]}
              >
                <Text style={styles.statText}>Endurance</Text>
              </View>
              <Text style={styles.statValue}>{userStats.end_score}</Text>
            </View>
            <View style={styles.stat}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${0.6 * userStats.spd_score + 40}%`,
                    backgroundColor: "#85CC7E",
                  },
                ]}
              >
                <Text style={styles.statText}>Speed</Text>
              </View>
              <Text style={styles.statValue}>{userStats.spd_score}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Share Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareCard}
          accessibilityLabel="Share your stats"
        >
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
