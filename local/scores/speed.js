import { supabase } from '../../lib/supabase';
import { Alert } from 'react-native';

let dat;

const pushRunScore = async (score, userId) => {
    try {
        // SELECT query for supabase workout type scores
        const { error } = await supabase
          .from('userstats')
          .update([{spd_score: score}])
          .eq('id', userId);
        // error handler for if the user is not signed in
        if (error) {
          throw new Error(error.message); 
        }
      } catch (err) {
        // error handling for if user has other errors fetching stats
        console.error('Other error:', err); 
      }
};

const fetchUserRuns = async (userId) => {
    try {
      // SELECT query for supabase workout type scores
      const { data, error } = await supabase
        .from('runs')
        .select('run_distance, run_time')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // error handler for if the user is not signed in
      if (error) {
        throw new Error(error.message); 
      }

      // error if the user does not have any stats in the DB
      if (!data) {
        Alert.alert('No Runs Recorded', 'Log your runs to see your scores!');
        return; 
      }else{
        dat = data;
      }
    } catch (err) {
      // error handling for if user has other errors fetching stats
      console.error('Other error:', err); 
    }
  };

/* Helper for gathering user run data */ 
  const fetchData = async () => {
    // get the user profile
    const { data, error } = await supabase.auth.getUser();
    //error handling toc heck if user is signed in
    if (error || !data) {
      Alert.alert('User is not logged in');
      return;
    }
    const userId = data.user.id;
    await fetchUserRuns(userId); 
  };

/* Helper for pushing speed score using userID */ 
  const pushData = async (score) => {
    // get the user profile
    const { data, error } = await supabase.auth.getUser();
    //error handling toc heck if user is signed in
    if (error || !data) {
      Alert.alert('User is not logged in');
      return;
    }
    const userId = data.user.id;
    await pushRunScore(score, userId); 
  };

export async function calculateSpeed() {
    let avgDist = 0;
    let avgTime = 0;
    await fetchData();
    for(const i of dat){
        avgDist += i.run_distance;
        avgTime += i.run_time;
    }
    avgDist /= 5;
    avgTime /= 5;
    if(avgTime <= 0){
        avgTime = 1;
    }
    let score = Math.round(Math.sqrt(avgDist/(avgTime/3600)) * 10 + avgDist/(avgTime/3600));
    await pushData(score);
    
}