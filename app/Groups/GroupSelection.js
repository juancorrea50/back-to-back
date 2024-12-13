import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../lib/supabase";
import style from "../styling";

export default function GroupSelection() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [groupJoin, setGroupJoin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [userUUID, setUserUUID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const styles = style.GroupSelect;

  useEffect(() => {
    const fetchSessionAndGroup = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("User is not logged in or session is invalid.");
          return;
        }

        const userId = sessionData.session.user.id;
        setUserUUID(userId);

        // Fetch user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          Alert.alert("Error", "Failed to load profile information");
          return;
        }

        const username = profileData.username || "No Username";
        const avatar_url = profileData.avatar_url;
        setProfileName(username);
        setUserAvatarUrl(avatar_url);

        // Fetch all groups and check for membership
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("id, members");

        if (groupsError) {
          console.error("Error fetching groups data:", groupsError);
          Alert.alert("Error", "Failed to check group membership");
          return;
        }

        // Check if the user is a member of any group
        const userGroup = groupsData.find((group) =>
          (group.members || []).some((member) => member.id === userId)
        );

        if (userGroup) {
          router.push("Groups/GroupScreen");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred");
      }
    };

    fetchSessionAndGroup();
  }, []);

  // Handle Image Picker Permission
  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant media library permission to select images."
      );
    }
  };

  // Handle image picking
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        const fileExtension = localUri.split(".").pop();
        const fileName = `group-avatars/${Date.now()}.${fileExtension}`;

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

        setAvatarUrl(publicURL); // Set the uploaded image URL
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || !avatarUrl) {
      Alert.alert("Error", "Please provide a group name and an avatar image.");
      return;
    }

    try {
      // Function to generate a random 4-digit code
      const generateCode = () => {
        return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      };

      let groupCode = generateCode();

      // Check if the generated code already exists in the "groups" table
      let codeExists = true;
      while (codeExists) {
        const { data, error } = await supabase
          .from("groups")
          .select("code")
          .eq("code", groupCode); // Check if the code already exists

        if (error) {
          console.error("Error checking group code:", error);
          Alert.alert("Error", "Failed to check code existence");
          return;
        }

        if (data.length === 0) {
          // If no group with the same code exists, break the loop
          codeExists = false;
        } else {
          // Regenerate the code if it already exists
          groupCode = generateCode();
        }
      }

      // Add the user as a new member
      const newMember = {
        id: userUUID,
        name: profileName, // Corrected this line
        avatarUrl: userAvatarUrl,
      };
      // Insert the new group into the Supabase database with the generated code
      const { data, error } = await supabase
        .from("groups") // Assuming you have a "groups" table in your Supabase database
        .insert([
          {
            name: groupName,
            avatar_url: avatarUrl, // Save the avatar URL
            code: groupCode, // Save the generated unique code
            members: [newMember], // Add the creator to the members array
          },
        ]);

      if (error) {
        console.error("Error creating group:", error);
        Alert.alert("Error", "Failed to create group");
        return;
      }

      // Simulate successful group creation and navigate
      Alert.alert(
        "Success",
        `Group "${groupName}" created successfully with code: ${groupCode}`
      );
      router.push(`Groups/GroupScreen`); // Navigate to the newly created group screen
    } catch (err) {
      console.error("Error creating group:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while creating the group"
      );
    }
  };
  // Handle joining a group
  const handleJoinGroup = async () => {
    if (!groupJoin) {
      Alert.alert("Error", "Please provide a group code to join.");
      return;
    }

    try {
      // Fetch the current session data
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        throw new Error("User is not logged in or session is invalid.");
      }

      const userId = sessionData.session.user.id; // Get the user ID from session

      // Fetch the group based on the entered group code
      const { data: group, error } = await supabase
        .from("groups")
        .select("*")
        .eq("code", groupJoin)
        .single();

      if (error || !group) {
        console.error("Error joining group:", error);
        Alert.alert("Error", "Group not found or an error occurred.");
        return;
      }

      // Initialize members if it's null
      const members = group.members || []; // Initialize as empty array if null
      console.log(members);

      // Check if the user is already a member of the group
      if (members.some((member) => member.id === userUUID)) {
        Alert.alert("Error", "You are already a member of this group.");
        return;
      }

      // Add the user as a new member
      const newMember = {
        id: userId,
        name: profileName, // Corrected this line
        avatarUrl: userAvatarUrl,
      };

      // Append the new member to the members array
      members.push(newMember);

      // Update the group with the new members array
      const { data: updatedGroup, error: updateError } = await supabase
        .from("groups")
        .update({
          members: members, // Update the members array directly
        })
        .eq("id", group.id);

      if (updateError) {
        console.error("Error updating group members:", updateError);
        Alert.alert("Error", "Failed to add user to group.");
        return;
      }

      // If successful, navigate to the group screen
      Alert.alert("Success", `Joined the group: "${group.name}"`);
      router.push("Groups/GroupScreen"); // Navigate to the group screen
    } catch (err) {
      console.error("Error joining group:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while joining the group."
      );
    }
  };

  const handleBackPress = () => {
    router.push("../../HomeScreen"); // Navigate back
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join or Create a Group</Text>

      {/* Input fields for Group Creation */}
      <TextInput
        style={styles.input}
        placeholder="Enter Group Name"
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor="#A0A0A0"
      />
      {/* Group Avatar Section */}
      <TouchableOpacity style={styles.AddPhotoButton} onPress={handlePickImage}>
        <Text style={styles.addPhotoText}>Add Photo (optional)</Text>
      </TouchableOpacity>
      {avatarUrl && (
        <Image source={{ uri: avatarUrl }} style={styles.avatarPreview} />
      )}

      {/* Create Group Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orDivider}>
        <Text style={styles.orText}>OR</Text>
      </View>

      {/* Input field for Joining a Group */}
      <TextInput
        style={styles.input}
        placeholder="Enter Group Code to Join"
        value={groupJoin}
        onChangeText={setGroupJoin}
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
