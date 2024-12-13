import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import style from "./styling";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import HomeScreen from "./HomeScreen";
import UserProfile from "./UserProfile";

export default function tooltab() {
  const router = useRouter();
  function goBack() {
    router.push("/HomeScreen");
  }

  function goUserProfile() {
    router.push("/UserProfile");
    console.log("Pressed");
  }
  const styles = style.tooltab;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.homeContainer} onPress={goBack}>
            <Image
              source={require("../assets/backButton.png")}
              style={{
                marginRight: "2px",
                marginTop: 2.5,
                height: 20,
                width: 20,
              }}
            />
            <Text
              style={{ color: "#FFD95A", fontSize: 20, fontWeight: "bold" }}
            >
              Home
            </Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={goUserProfile}>
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
      </View>
    </View>
  );
}
