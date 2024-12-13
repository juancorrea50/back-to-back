import { useEffect } from "react";
import { router } from 'expo-router';
import { supabase } from "../lib/supabase"

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      if(session) {
        router.replace("/HomeScreen");
      }else{
        router.replace("/SignInScreen");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if(session) {
        router.replace("/HomeScreen");
      }else{
        router.replace("/SignInScreen");
      }
    });
  }, []);

  return null;
}


