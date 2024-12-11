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

const Map = ({ navigation, route: router }) => {
  const { orderAddress } = router?.params;

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [directions, setDirections] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [destination, setDestination] = useState({
    latitude: 21.046666732000062,
    longitude: 105.79016956900006,
  });
  const [address, setAddress] = useState(orderAddress ? orderAddress : '');
  const [mapRegion, setMapRegion] = useState({
    latitude: 21.046666732000062,
    longitude: 105.79016956900006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const arrowPosition = useRef(new Animated.Value(0)).current;
  const origin = {
    latitude: 21.046623224000029,
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

  useEffect(() => {
    handleSearchAddress();
  }, []);
  const toggleDirections = () => {
    setShowDirections((prev) => !prev);
  };

  const closeMap = () => {
    navigation.navigate('Đang Chờ Giao');
  };

  useEffect(() => {
    const watchPosition = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000000,
        distanceInterval: 1,
      },
      (userLocation) => {
        setLocation(userLocation.coords);
      }
    );

    return () => {
      //watchPosition.remove();
    };
  }, []);

  useEffect(() => {
    if (location && destination) {
      getRouteFromGoongAPI();
    }
  }, [location, destination]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
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
              strokeColor="#283cff"
              strokeWidth={6}
            />
          ))}

        {route && route[0] && (
          <Marker coordinate={route[0][Math.floor(arrowPosition._value)]}>
            <View
              style={{
                backgroundColor: '#283cff', // Custom color for the marker
                borderRadius: 50,
                justifyContent: 'center',
                padding: 10, // Padding around the icon
              }}
            >
              <Icon
                name="motorcycle" // Use the FontAwesome motorcycle icon
                type="font-awesome" // Specify the icon type (FontAwesome)
                color="#fff" // Icon color (white for contrast)
                size={20} // Size of the icon
              />
            </View>
          </Marker>
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#283cff" />
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && directions.length > 0 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleDirections}
        >
          <Text style={styles.toggleButtonText}>
            {showDirections ? 'Ẩn chỉ đường' : 'Hiển thị chỉ đường'}
          </Text>
        </TouchableOpacity>
      )}

      {!loading && !error && directions.length > 0 && (
        <TouchableOpacity style={styles.toggleButtonLeft} onPress={closeMap}>
          <Icon
            name="close" // Use the FontAwesome motorcycle icon
            type="font-awesome" // Specify the icon type (FontAwesome)
            color="#fff" // Icon color (white for contrast)
            size={20} // Size of the icon
          />
        </TouchableOpacity>
      )}

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
            circleSize={16}
            circleColor="#283cff"
            lineColor="#e1e1e1"
            timeContainerStyle={{ minWidth: 50 }}
            timeStyle={styles.timeStyle}
            titleStyle={styles.titleStyle}
            descriptionStyle={styles.descriptionStyle}
            options={{
              style: { paddingBottom: 10 },
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
    bottom: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#283cff',
    borderRadius: 30,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  toggleButtonLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#283cff',
    borderRadius: 40,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontSize: 12,
    color: '#283cff',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionStyle: {
    fontSize: 12,
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
    backgroundColor: '#283cff',
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
