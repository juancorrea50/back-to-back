import MapView, { Polyline } from "react-native-maps";
import React from "react";
import { useEffect, useState } from "react";
import { router } from 'expo-router';
import * as Location from 'expo-location';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
  } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';


const handleBack = () => {
  router.push('/../HomeScreen');
};

const MapScreen = () => {
  // from expo-location docs
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [running, setRunning] = useState(false);
  const [polyArray, setPolyArray] = useState([]);

  //default region (to display on the map)
  const [region, setRegion] = useState({
    latitudeDelta: 1,
    longitudeDelta: 1,
    latitude: 32.32323232,
    longitude: 32.32323232,
  });


  // from expo-location docs
  // use effect to constantly update the user location when it changes
  useEffect(() => {
    const getLocation = async () => {
      // get location access from the user
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      // set the location using expo-location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // error handling for invalid locations
      if(errorMsg){
        Alert.alert('Error', 'Location could not be fetched.');
      }
      // save the latitude and longitude values
      /* SAVE USER LOCATION TO RUN TABLE (DB) HERE. */
      const latitude = parseFloat(location.coords.latitude);
      const longitude = parseFloat(location.coords.longitude);
    
      // sets the map region based on the location using RN mapView
      setRegion({
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
        latitude,
        longitude,
      });

      setPolyArray(polyArray => [
        ...polyArray, 
        {
            longitude: longitude, 
            latitude: latitude, 
        }
      ]);
    };

    getLocation();
    const intervalId = setInterval(getLocation, 5000);
    return () => clearInterval(intervalId);
  }, []);

  /* HANDLE DB LOGIC HERE TO STORE RUN DATA (make run table with row/col for location data, refresh every x seconds */
  const handleStartRun = () => {
    setRunning(true);
    Alert.alert('Start Run Pressed', 'Start Run has been pressed.');
  };



  return (
    <View style={styles.container}>
        {/* Map Component */}
        <MapView  style={styles.map}
                  mapType="terrain"
                  showsUserLocation={true}
                  followsUserLocation={true}
                  region={region}
        >
          <Polyline coordinates={polyArray}
              strokeColor="black" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={4}
          
          />
        </MapView>
        {/* Bottom Section */}
        <View style={styles.bottom}>
            <Text style={styles.recommendationsTitle}>Start Run</Text>
            {/* Start Button */}
            <TouchableOpacity style={styles.startButton} onPress={handleStartRun}>
                <Image
                    source={require('../../assets/start_run.png')} // Replace with actual image
                    style={styles.startRun}
                />
            </TouchableOpacity>
            {/* Route back to home */}
            <LinearGradient style={styles.button} colors={['#FFD95A','#FFFFFF','#CCAE48']} start={{x:1,y:0}} end={{x:0,y:1}} locations={[.0,.44,.64]}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    </View>
  )
}

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Center content vertically at the bottom
        alignItems: 'center', // Center content horizontally
        backgroundColor: '#FFFFFF',
    },
    bottom: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex', // Center content vertically at the top
        alignItems: 'center', // Center content horizontally
        width:'100%',
        height: '35%',
      },
    map: {
        flex:1,
        height: '50%',
        justifyContent: 'flex-end', // Center content vertically at the bottom
        alignItems: 'center', // Center content horizontally,
        width: '100%',
    },
    button: {
        backgroundColor: '#FFD95A',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 70,
        borderRadius: 5,
      },
      buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
      },
      recommendationsTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000000',
        paddingLeft: 20,
        paddingTop: 10,
      },
      startRun: {
        width: 40,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
      },
    startButton: {
        paddingVertical: 10,
        paddingHorizontal: 150,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#FFD95A',
    },
    startText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
        paddingLeft: 20,
    }

})