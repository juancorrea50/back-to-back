// GroupScreen.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import style from "../styling";
import Tooltab from "../tooltab";

export default function GroupScreen() {
  const router = useRouter();
  const styles = style.groupPage;
  const [groupName, setGroupName] = useState("");
  const [groupJoin, setGroupJoin] = useState("");
  const [statsView, setStatsView] = useState(false);
  const [groupId, setGroupId] = useState(""); // Store group ID
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [userUUID, setUserUUID] = useState("");
  const [displayedStats, setDisplayedStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]); // Add state for members
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [newGroupName, setNewGroupName] = useState(""); // For editing group name
  const [displayedName, setDisplayedName] = useState("");
  const [userStats, setUserStats] = useState({
    str_score: 0,
    end_score: 0,
    spd_score: 0,
    flex_score: 0,
    overall_score: 0,
  });
  const [combinedMemberData, setCombinedMemberData] = useState([]);
  const [specialRoles, setSpecialRoles] = useState([]);
  const [refresh, setRefresh] = useState(false); // Add this state
  const [memberStats, setMemberStats] = useState([]);
  const [displayedImage, setDisplayedImage] = useState(null);

  const displayMember = (member) => {
    const groupDisplay = memberStats.find((stats) => stats.id === member.id);
    setDisplayedStats(groupDisplay || null);
    setDisplayedName(member.name || "");
    if (member.name === displayedName || displayedName === "") {
      setStatsView((prev) => !prev);
    } else {
      setStatsView(true);
    }
    setDisplayedImage(member.avatarUrl || "");
  };

  useEffect(() => {
    const fetchSessionAndGroup = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("Session error:", sessionError);
          return;
        }

        const userId = sessionData.session.user.id;
        setUserUUID(userId);

        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("id, name, avatar_url, code, members");

        if (groupsError) {
          console.error("Groups error:", groupsError);
          return;
        }

        const userGroup = groupsData.find((group) =>
          group.members?.some((member) => member.id === userId)
        );

        if (userGroup) {
          setGroupId(userGroup.id);
          setGroupName(userGroup.name);
          setAvatarUrl(userGroup.avatar_url);
          setMembers(userGroup.members);
          setGroupJoin(userGroup.code);
        } else {
          console.log("User is not in any group.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchSessionAndGroup();
  }, []);

  //Fetch Member UUID and avatar
  useEffect(() => {
    if (groupId) {
      const fetchMemberData = async () => {
        try {
          const { data: groupData, error } = await supabase
            .from("groups")
            .select("id, name, avatar_url, code, members")
            .eq("id", groupId) // Ensure you're querying by groupId
            .single();

          if (error) {
            console.error("Error fetching group data:", error);
            Alert.alert("Error", "Failed to fetch group data.");
            return;
          }

          setMembers(groupData.members); // Assuming members is an array
        } catch (err) {
          console.error("Unexpected error:", err);
          Alert.alert("Error", "An unexpected error occurred");
        }
      };

      fetchMemberData();
    }
  }, [groupId]);

  useEffect(() => {
    // Function to fetch member stats from the userstats table
    const fetchMemberStats = async () => {
      if (!members || members.length === 0) return;

      try {
        // Create an array to hold all fetch promises
        const statsPromises = members.map(async (member) => {
          const { data, error } = await supabase
            .from("userstats")
            .select("*")
            .eq("id", member.id); // Adjust column name if needed

          if (error) {
            console.error(
              `Error fetching stats for member ${member.id}:`,
              error
            );
            return null;
          }
          return data ? data[0] : null; // Assuming each member has one stats record
        });

        // Resolve all promises and filter out null results
        const statsResults = await Promise.all(statsPromises);
        const validStats = statsResults.filter((stat) => stat !== null);

        setMemberStats(validStats);
      } catch (err) {
        console.error("Error fetching member stats:", err);
      }
    };

    fetchMemberStats();
  }, [members]); // Dependency on members array
  /*
  useEffect(() => {
    console.log("Members:", members);
    console.log("MemberStats:", memberStats);
  }, [members, memberStats]);
*/
  //Combine Members
  useEffect(() => {
    if (members.length > 0 && memberStats.length > 0) {
      const validMemberStats = memberStats.filter((stat) => stat !== undefined);
      // Combine members and their stats
      const combinedData = members.map((member) => {
        // Find stats for the current member
        const stats = validMemberStats.find((stat) => stat.id === member.id);

        // Merge member and stats
        return {
          ...member,
          stats: stats || {}, // Default to an empty object if no stats found
        };
      });

      //console.log("Combined Member Data:", combinedData);
      setCombinedMemberData(combinedData); // Assuming you create a new state for combined data
      calculateSpecialRoles(combinedData);
    }
  }, [members, memberStats]);

  // Helper function to calculate special roles
  const calculateSpecialRoles = (combinedMemberData) => {
    if (!combinedMemberData || combinedMemberData.length === 0) {
      console.error("No member data available to calculate special roles.");
      return;
    }

    const mostFlexible = combinedMemberData.reduce((prev, current) => {
      return prev?.stats?.flex_score > current?.stats?.flex_score
        ? prev
        : current;
    }, null);

    const strongest = combinedMemberData.reduce((prev, current) => {
      return prev?.stats?.str_score > current?.stats?.str_score
        ? prev
        : current;
    }, null);

    const fastest = combinedMemberData.reduce((prev, current) => {
      return prev?.stats?.spd_score > current?.stats?.spd_score
        ? prev
        : current;
    }, null);

    //console.log("Most Flexible:", mostFlexible);
    //console.log("Strongest:", strongest);
    //console.log("Fastest:", fastest);

    setSpecialRoles([
      {
        title: "Most Flexible",
        name: mostFlexible?.name || "No data",
        avatarUrl: mostFlexible?.avatarUrl || null,
      },
      {
        title: "Strongest",
        name: strongest?.name || "No data",
        avatarUrl: strongest?.avatarUrl || null,
      },
      {
        title: "Fastest",
        name: fastest?.name || "No data",
        avatarUrl: fastest?.avatarUrl || null,
      },
    ]);
  };

  const handlePickImage = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) throw new Error("User session not found.");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Use the correct enum from ImagePicker
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

        // Upload image directly to Supabase Storage
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

        // Get the public URL of the uploaded image
        const publicURL = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName).data.publicUrl;

        // Update the group's tablke with the new avatar URL
        const { error: profileError } = await supabase
          .from("groups")
          .upsert(
            { code: groupJoin, avatar_url: publicURL },
            { onConflict: ["code"] }
          );

        if (profileError) {
          console.error("Error updating group:", profileError);
          Alert.alert("Error", "Failed to update profile");
          return;
        }

        // Update avatar URL state
        setAvatarUrl(publicURL);
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", err.message || "An error occurred");
    }
  };

  const handleEditGroupName = async () => {
    if (!groupId || !newGroupName.trim()) {
      alert("Group ID or name is invalid.");
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) throw new Error("User session not found.");

      // Attempt to update the group name in the 'groups' table
      const { error } = await supabase
        .from("groups")
        .update({ name: newGroupName }) // Set the new group name
        .eq("id", groupId); // Ensure the update happens for the correct group ID

      // Handle any errors that occurred during the update process
      if (error) {
        console.error("Error updating group name:", error.message);
        Alert.alert("Error", "Failed to update group name");
        return;
      }

      // Successfully updated the group name
      console.log("Group name updated successfully:", newGroupName);

      // Update the UI with the new group name
      setGroupName(newGroupName);
      setIsModalVisible(false);
      Alert.alert("Success", "Group name updated successfully");
    } catch (err) {
      console.error("Unexpected error updating group name:", err);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      // Clean up and close modal
      setIsModalVisible(false);
      setNewGroupName("");
    }
  };

  const openEditModal = () => {
    setNewGroupName(groupName); // Pre-fill with current name
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
  };

  // Function to leave group
  const handleLeaveGroup = async () => {
    if (!groupId) {
      Alert.alert("Error", "No group to leave.");
      return;
    }

    try {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) throw new Error("User session not found.");

      // Remove user from group members
      const { data: groupData, error: fetchError } = await supabase
        .from("groups")
        .select("members")
        .eq("id", groupId)
        .single();

      if (fetchError) throw fetchError;

      const updatedMembers = groupData.members.filter(
        (member) => member.id !== userId
      );

      const { error: updateError } = await supabase
        .from("groups")
        .update({ members: updatedMembers })
        .eq("id", groupId);

      if (updateError) throw updateError;

      Alert.alert("Success", "You have left the group.");
      setGroupName("");
      setMembers([]);
      setAvatarUrl(null);
      setGroupId("");
      router.push("../../HomeScreen"); // Navigate to home screen after leaving group
    } catch (err) {
      console.error("Error leaving group:", err);
      Alert.alert("Error", err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Edit Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Group Name</Text>
            <TextInput
              style={styles.textInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Enter new group name"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={handleEditGroupName}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeEditModal}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.headerBar}>
        <Tooltab />
      </View>

      {/* Group Header */}
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <View style={styles.groupNameContainer}>
            <Text style={styles.groupName}>
              {groupName || "Loading group..."}
            </Text>
            <TouchableOpacity onPress={openEditModal}>
              <Image
                source={require("../../assets/edit-icon.png")}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.groupsubHeader}>Code: {groupJoin}</Text>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../assets/memberPlaceholder.jpg")
            }
            style={styles.groupImage}
          />
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.editPhotoButton}
          >
            <Text style={styles.editPhotoText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Member Slots */}
        <View style={styles.membersContainer}>
          {members.length > 0 ? (
            members.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={styles.memberSlot}
                onPress={() => displayMember(member)}
              >
                <Image
                  source={
                    member.avatarUrl
                      ? { uri: member.avatarUrl }
                      : require("../../assets/memberPlaceholder.jpg")
                  }
                  style={styles.memberImage}
                />
                <Text style={styles.memberName}>
                  {member.name || "Unnamed Member"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noMembersText}>No members available.</Text>
          )}
        </View>
      </View>

      {/*Renders user stats conditionally*/}
      {statsView && (
        <View style={styles.membersStatsContainer}>
          <View style={styles.displayMember}>
            <Image
              source={
                displayedImage
                  ? { uri: displayedImage }
                  : require("../../assets/memberPlaceholder.jpg")
              }
              style={styles.memberDisplayImage}
            />
            <Text style={styles.memberDisplayName}>
              {displayedName || "Unnamed Member"}
              {"'s Stats"}
            </Text>
          </View>

          <View style={styles.stat}>
            <View
              style={[
                styles.statBar,
                {
                  width: `${0.6 * displayedStats.flex_score + 40}%`,
                  backgroundColor: "#FF4F4B",
                },
              ]}
            >
              <Text style={styles.statText}>Flexibility</Text>
            </View>
            <Text style={styles.statValue}>{displayedStats.flex_score}</Text>
          </View>

          <View style={styles.stat}>
            <View
              style={[
                styles.statBar,
                {
                  width: `${0.6 * displayedStats.str_score + 40}%`,
                  backgroundColor: "#BF77F6",
                },
              ]}
            >
              <Text style={styles.statText}>Strength</Text>
            </View>
            <Text style={styles.statValue}>{displayedStats.str_score}</Text>
          </View>

          <View style={styles.stat}>
            <View
              style={[
                styles.statBar,
                {
                  width: `${0.6 * displayedStats.end_score + 40}%`,
                  backgroundColor: "#85CC7E",
                },
              ]}
            >
              <Text style={styles.statText}>Endurance</Text>
            </View>
            <Text style={styles.statValue}>{displayedStats.end_score}</Text>
          </View>

          <View style={styles.stat}>
            <View
              style={[
                styles.statBar,
                {
                  width: `${0.6 * displayedStats.spd_score + 40}%`,
                  backgroundColor: "#659BDF",
                },
              ]}
            >
              <Text style={styles.statText}>Speed</Text>
            </View>
            <Text style={styles.statValue}>{displayedStats.spd_score}</Text>
          </View>
        </View>
      )}

      {/* Special Spots */}
      <View style={styles.membersTitleContainer}>
        {specialRoles.map((role, index) => (
          <View key={index} style={styles.memberSlot}>
            <Text style={styles.memberTitle}>{role.title}</Text>
            <Image
              source={
                role.avatarUrl
                  ? { uri: role.avatarUrl } // Use the avatar URL if available
                  : require("../../assets/memberPlaceholder.jpg") // Fallback to placeholder
              }
              style={styles.memberSpecialImage}
            />
            <Text style={styles.memberSpecialName}>{role.name}</Text>
          </View>
        ))}
      </View>

      {/* Leave Button */}
      <View style={styles.leaveButtonContainer}>
        <TouchableOpacity
          onPress={handleLeaveGroup}
          style={styles.leaveButton}
          disabled={isLoading}
        >
          <Text style={styles.leaveButtonText}>
            {isLoading ? "Leaving..." : "Leave Group"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
