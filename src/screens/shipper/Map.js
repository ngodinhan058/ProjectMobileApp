import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements';
import Timeline from 'react-native-timeline-flatlist';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Map = () => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [currentStep, setCurrentStep] = useState(null); // Track the current step
  const [destination, setDestination] = useState({
    latitude: 21.046666732000062,
    longitude: 105.79016956900006,
  }); // Default destination (Điểm B)
  const [address, setAddress] = useState(''); // Address input from the user
  const [mapRegion, setMapRegion] = useState({
    latitude: 21.046666732000062,
    longitude: 105.79016956900006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }); // Map region state to control zoom

  const arrowPosition = useRef(new Animated.Value(0)).current; // Animated value to move the arrow
  const origin = {
    latitude: 21.046623224000029, // Tọa độ gốc (A)
    longitude: 105.79016820300006,
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
    if (!location || !destination) return;
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
  }, [location, destination]);

  useEffect(() => {
    if (location && destination) {
      getRouteFromGoongAPI();
    }
  }, [location, destination, getRouteFromGoongAPI]);

  // Handle address search
  const handleSearchAddress = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter an address.');
      return;
    }

    setLoading(true);
    const apiKey = '7d6NMyBGea1uqvClvnSeN9WC4ywy3hzbhoT0pwFI';

    const url = `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
      address
    )}&api_key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setDestination({ latitude: lat, longitude: lng });

        // Update the map region to zoom into the destination
        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('Error', 'No results found for this address.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching the coordinates.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle directions visibility and change button title
  const toggleDirections = () => {
    setShowDirections((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Destination Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearchAddress}>
        <Text style={styles.buttonText}>Search Destination</Text>
      </TouchableOpacity>

      {/* Map View */}
      <MapView
        style={styles.map}
        provider="google"
        region={mapRegion} // Use the dynamic region
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
              strokeColor="#FF6347" // Stylish red color for the polyline
              strokeWidth={6}
            />
          ))}

        {route && route[0] && (
          <Marker coordinate={route[0][Math.floor(arrowPosition._value)]}>
            <Icon
              name="arrow-forward"
              type="material"
              color="#FF6347"
              size={30}
            />
          </Marker>
        )}
      </MapView>

      {/* Loading Spinner */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      )}

      {/* Error message */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Toggle Button */}
      {!loading && !error && directions.length > 0 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleDirections} // Toggle the directions visibility
        >
          <Text style={styles.toggleButtonText}>
            {showDirections ? 'Ẩn chỉ đường' : 'Hiển thị chỉ đường'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Timeline Overlay */}
      {showDirections && (
        <View style={styles.timelineOverlay}>
          <Timeline
            data={directions.map((step, index) => ({
              time: `${index + 1}`,
              title: step.instruction,
              description: `${step.distance}, ${step.duration}`,
              icon: (
                <Icon
                  name="arrow-forward"
                  type="material"
                  size={20}
                  containerStyle={styles.timelineIcon}
                />
              ),
            }))}
            circleSize={16} // Reduce the size of the circles
            circleColor="#FF6347"
            lineColor="#e1e1e1"
            timeContainerStyle={{ minWidth: 50 }}
            timeStyle={styles.timeStyle}
            titleStyle={styles.titleStyle}
            descriptionStyle={styles.descriptionStyle}
            options={{
              style: { paddingBottom: 10 }, // Add more space at the bottom to reduce tightness
            }}
          />
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
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 999,
  },
  errorContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
  },
  errorText: {
    color: 'white',
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20, // Điều chỉnh vị trí ở dưới
    right: 20, // Điều chỉnh vị trí ở góc dưới bên phải
    paddingVertical: 12, // Tăng độ cao cho nút
    paddingHorizontal: 20, // Tăng độ rộng của nút
    backgroundColor: '#FF6347', // Màu nền nổi bật
    borderRadius: 30, // Bo góc tròn cho nút
    zIndex: 1000,
    elevation: 5, // Thêm bóng đổ cho nút
    shadowColor: '#000', // Màu bóng đổ
    shadowOffset: { width: 0, height: 4 }, // Vị trí bóng đổ
    shadowOpacity: 0.3, // Độ mờ của bóng đổ
    shadowRadius: 5, // Độ lan tỏa của bóng đổ
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18, // Tăng kích thước chữ
    fontWeight: 'bold',
    textAlign: 'center', // Căn giữa chữ trong nút
  },
  timelineOverlay: {
    position: 'absolute',
    top: 400,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
    paddingTop: 10,
  },
  timelineIcon: {
    marginTop: 5,
  },
  timeContainer: {
    flex: 0.2,
  },
  timeStyle: {
    fontSize: 12, // Giảm kích thước chữ
    color: '#FF6347', // Màu chữ đỏ cho đồng bộ
  },
  titleStyle: {
    fontSize: 14, // Kích thước chữ nhỏ hơn
    fontWeight: 'bold',
  },
  descriptionStyle: {
    fontSize: 12, // Kích thước chữ nhỏ
    color: 'grey',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Map;
