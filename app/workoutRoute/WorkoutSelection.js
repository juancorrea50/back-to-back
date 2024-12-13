// splits.js
import React from 'react';
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
import style from "../styling";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import Tooltab from "../tooltab";
import styling from "../styling";

export default function WorkoutSelection(){
    const router = useRouter();
    const windWidth = Dimensions.get('window').width
    const styles = styling.splitsMenu
    function routeWeightRec(){
        router.push('workoutRoute/WeightWorkouts');
    }
    function routeRunningRec(){
        router.push('../map/RunningScreen');
    }
    function routeSplitMaker(){

    }
    return(
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Tooltab/>
            </View>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: windWidth,
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Text style={styles.headerText}>Workouts</Text>
      </View>

      {/*Container for splits categories */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/*Running */}
        <View>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={routeRunningRec}
          >
            <Text style={styles.optionText}>Running</Text>
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
            <Text style={styles.optionText}>Current Split</Text>
            <Image
              source={require("../../assets/Intermediate-Photo 1.png")}
              style={styles.optionImage}
            />
          </TouchableOpacity>
        </View>
        {/*Create Your Own */}
      </View>
    </View>
  );
}