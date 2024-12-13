// splits.js
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Tooltab from "../tooltab";
import styling from "../styling";

export default function splits() {
  const router = useRouter();
  const windWidth = Dimensions.get("window").width;
  const styles = styling.splitsMenu;
  function routeWeightRec() {
    router.push("./splitEdit");
  }
  function routeRunningRec() {
    router.push("../map/RunningList");
  }
  function routeSplitMaker() {}
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Tooltab />
      </View>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: windWidth,
          gap: 10,
          marginBottom: -80,
        }}
      >
        <Text style={styles.headerText}>Splits</Text>
      </View>

      {/*Container for splits categories */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        {/*Running */}
        <View>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={routeRunningRec}
          >
            <Text style={styles.optionText}>Latest {"\n"}Running</Text>
            <Image
              source={require("../../assets/beginner-photo 1.png")}
              style={styles.optionImage}
            />
          </TouchableOpacity>
        </View>
        {/*Weightlifting */}
        <View>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={routeWeightRec}
          >
            <Text style={styles.optionText}>Split Editor</Text>
            <Image
              source={require("../../assets/Intermediate-Photo 1.png")}
              style={styles.optionImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
