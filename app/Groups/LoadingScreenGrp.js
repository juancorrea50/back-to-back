import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

const LoadingScreen = () => {
  const router = useRouter(); // Initialize router

  // Fetch session and group data
  const fetchSessionAndGroup = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("User is not logged in or session is invalid.");
        return 'Login'; // Navigate to login if no session
      }

      const userId = sessionData.session.user.id;

      // Fetch groups and check for membership
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('id, members');

      if (groupsError) {
        console.error('Error fetching groups data:', groupsError);
        Alert.alert('Error', 'Failed to check group membership');
        return 'ErrorScreen'; // Navigate to an error screen if needed
      }

      // Check if the user is a member of any group
      const userGroup = groupsData.find(group =>
        group.members?.some(member => member.id === userId)
      );

      return userGroup ? 'Groups/GroupScreen' : 'Groups/GroupSelection';
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
      return 'ErrorScreen'; // Navigate to an error screen if needed
    }
  };

  useEffect(() => {
    const navigateAfterLoading = async () => {
      const destination = await fetchSessionAndGroup();
      setTimeout(() => {
        router.push(destination);
      }, 3000); // 3 seconds to match the loading animation
    };

    navigateAfterLoading();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/Loading-Screen.json')}
        autoPlay
        loop={false} // Ensure the animation doesn't loop infinitely
        style={styles.animation}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
  },
  animation: {
    width: width,
    height: height,
  },
});

export default LoadingScreen;
