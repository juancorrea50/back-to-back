import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import style from "./styling";

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const router = useRouter();
  const styles = style.userProf;

  useEffect(() => {
    // Request permission for image picker when the component mounts
    if (Platform.OS === "android" || Platform.OS === "ios") {
      requestStoragePermission();
    }

    // Fetch profile avatar URL
    const fetchAvatarUrl = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("User is not logged in or session is invalid.");
        }

        const userId = sessionData.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          Alert.alert("Error", "Failed to load profile image");
          return;
        }

        setAvatarUrl(profileData.avatar_url);
      } catch (error) {
        console.error("Error loading avatar URL:", error);
        Alert.alert("Error", error.message || "Failed to load profile image");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("User is not logged in or session is invalid.");
        }

        const userId = sessionData.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, email")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          Alert.alert("Error", "Failed to load profile image");
          return;
        }

        setProfileName(profileData.username || "No Username");
        setEmail(profileData.email);
      } catch (error) {
        console.error("Error loading avatar URL:", error);
        Alert.alert("Error", error.message || "Failed to load profile image");
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarUrl();
    fetchUserProfile();
  }, []);

  const requestStoragePermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant media library permission to select images."
        );
      }
    } catch (err) {
      console.warn("Permission request failed:", err);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    }
    router.push("/SignInScreen");
  };

  const handlePickImage = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) throw new Error("User session not found.");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        const fileExtension = localUri.split(".").pop();
        const fileName = `avatars/${
          session.user.id
        }-${Date.now()}.${fileExtension}`;

        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, {
            uri: localUri,
            name: fileName,
            type: `image/${fileExtension}`,
          });

        if (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Error", "Failed to upload image");
          return;
        }

        const publicURL = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName).data.publicUrl;

        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            { id: session.user.id, avatar_url: publicURL },
            { onConflict: ["id"] }
          );

        if (profileError) {
          console.error("Error updating profile:", profileError);
          Alert.alert("Error", "Failed to update profile");
          return;
        }

        setAvatarUrl(publicURL);
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", err.message || "An error occurred");
    }
  };

  const handleEditField = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) throw new Error("User session not found.");

      const userId = sessionData.session.user.id;
      const updates =
        editField === "username"
          ? { username: newFieldValue }
          : { email: newFieldValue };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) {
        console.error(`Error updating ${editField}:`, error);
        Alert.alert("Error", `Failed to update ${editField}`);
        return;
      }

      if (editField === "username") {
        setProfileName(newFieldValue);
      } else {
        setEmail(newFieldValue);
      }
    } catch (err) {
      console.error("Error updating field:", err);
      Alert.alert("Error", err.message || `Failed to update ${editField}`);
    } finally {
      setEditModalVisible(false);
      setNewFieldValue("");
    }
  };

  const handleEditName = () => {
    setEditField("username");
    setNewFieldValue(profileName);
    setEditModalVisible(true);
  };

  const handleEditEmail = () => {
    setEditField("email");
    setNewFieldValue(email);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={styles.modalInput}
              value={newFieldValue}
              onChangeText={setNewFieldValue}
            />
            <TouchableOpacity
              onPress={handleEditField}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Image
              source={require("../assets/backButton.png")}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Home</Text>
        </View>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.title}>Your Profile</Text>

        <View style={styles.userContainer}>
          <View style={styles.userHeader}>
            <TouchableOpacity>
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../assets/memberPlaceholder.jpg")
                }
                style={styles.userImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.editPhotoButton}
            >
              <Text style={styles.editPhotoText}>Edit Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Username</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.info}>{profileName}</Text>
          <TouchableOpacity onPress={handleEditName}>
            <Image
              source={require("../assets/edit-icon.png")}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Email</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.info}>{email}</Text>
          <TouchableOpacity onPress={handleEditEmail}>
            <Image
              source={require("../assets/edit-icon.png")}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

    </View>
  );
}
