import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import style from "./styling";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); //Initialize router
  const styles = style.index;

  const handleLogin = async () => {
    {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        Alert.alert(error.message);
      }
      setLoading(false);
    }
    /*
    if (username === 'admin' && password === 'password') {
      Alert.alert('Login Successful', `Welcome, ${username}!`);
      router.push('/HomeScreen');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
      */
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Reset password link has been sent.");
  };

  const handleSignUp = () => {
    router.push("/signUp/SignUpScreen");
  };

  return (
    <View style={styles.container}>
      {/* Login Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subTitle}>Welcome</Text>
          <Text style={styles.subText}>
            Experience the power of{"\n"}Back-to-Back Excellence
          </Text>
        </View>
      </View>

      {/* Login Form Container */}
      <View style={styles.formContainer}>
        <Image
          source={require("../assets/Logo-White.png")} //use Logo
          style={styles.image}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <LinearGradient
        style={styles.button}
        colors={["#FFD95A", "#FFFFFF", "#CCAE48"]}
      >
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/*Sign Up*/}
      <View style={styles.signUpContainer}>
        <Text style={styles.subText}>
          Don't have an account?
          <Text style={styles.signUp} onPress={handleSignUp}>
            {" "}
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}
