import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Timeline from 'react-native-timeline-flatlist';
import Icon from 'react-native-vector-icons/Ionicons'; // Sử dụng Ionicons ở đây
const { width, height } = Dimensions.get('window');

const Map = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState([]); // Store directions with distance and duration
  const [showDirections, setShowDirections] = useState(false); // State to control showing directions

  const origin = {
    latitude: 21.046623224000029, // Tọa độ gốc (A)
    longitude: 105.79016820300006,
  };
  const destination = {
    latitude: 21.046666732000062, // Tọa độ đến (B) gần gốc
    longitude: 105.79016956900006,
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.'
        );
        return;
      }
      getCurrentLocation();
    } catch (err) {
      setError('Failed to request permission');
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(userLocation.coords);
    } catch (error) {
      setError('Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Decode polyline data from Goong API
  const decodePolyline = (encoded) => {
    let polyline = [];
    let index = 0;
    let latitude = 0;
    let longitude = 0;
    while (index < encoded.length) {
      let byte;
      let shift = 0;
      let result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      latitude += dlat;
      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      longitude += dlng;
      polyline.push({ latitude: latitude / 1e5, longitude: longitude / 1e5 });
    }
    return polyline;
  };

  const getRouteFromGoongAPI = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    const apiKey = '7d6NMyBGea1uqvClvnSeN9WC4ywy3hzbhoT0pwFI';
    const url = `https://rsapi.goong.io/Direction?origin=${location.latitude},${location.longitude}&destination=${destination.latitude},${destination.longitude}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.geocoded_waypoints[0].geocoder_status !== 'OK') {
        throw new Error('Unable to find route.');
      }

      const routeData = [];
      const overviewPolyline = data.routes[0].overview_polyline.points;
      routeData.push(decodePolyline(overviewPolyline));
      setRoute(routeData);

      // Store directions with distance and duration
      const directionsData = data.routes[0].legs[0].steps.map((step) => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
      }));
      setDirections(directionsData);
    } catch (error) {
      setError(error.message || 'Error fetching route');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      getRouteFromGoongAPI();
    }
  }, [location, getRouteFromGoongAPI]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: 21.0285,
          longitude: 105.8542,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location ? location.latitude : origin.latitude,
            longitude: location ? location.longitude : origin.longitude,
          }}
          title="Điểm A"
        />
        <Marker coordinate={destination} title="Điểm B" />

        {route &&
          route.map((polylinePoints, index) => (
            <Polyline
              key={index}
              coordinates={polylinePoints}
              strokeColor="#0000FF"
              strokeWidth={6}
            />
          ))}
      </MapView>

      <Button
        title="Hiển thị chỉ đường"
        onPress={() => setShowDirections(!showDirections)}
      />

      {showDirections && directions.length > 0 && (
        <Timeline
          data={directions.map((step, index) => ({
            time: `${index + 1}`,
            title: step.instruction,
            description: `${step.distance} - ${step.duration}`,
            icon: <Icon name="ios-arrow-forward" size={30} color="red" />,
          }))}
          circleSize={20}
          circleColor="blue"
          lineColor="gray"
          timeContainerStyle={{ minWidth: 52 }}
        />
      )}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Map;
