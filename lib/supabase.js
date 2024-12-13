import { AppState } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kdtwbhflemvmdfaxbkai.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdHdiaGZsZW12bWRmYXhia2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0ODEyNzEsImV4cCI6MjA0MzA1NzI3MX0.6KCDbxT6AgxTmBcHLTZl00NcRHS4FkOLtVBM_FwUS98"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});